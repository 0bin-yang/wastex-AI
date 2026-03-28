import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { WasteReport } from "@/models/WasteReport";
import { getDistance } from "geolib";

const DEFAULT_RADIUS_METERS = 2000; // 2km

interface Cluster {
  id: string;
  centerLat: number;
  centerLng: number;
  label: string;
  reportCount: number;
  totalCarbonSaved: number;
  severityCounts: Record<string, number>;
  topWasteType: string;
}

function clusterReports(reports: any[], radius: number): Cluster[] {
  const clusters: Cluster[] = [];

  for (const report of reports) {
    const { lat, lng } = report.location;

    const existing = clusters.find((c) =>
      getDistance(
        { latitude: lat, longitude: lng },
        { latitude: c.centerLat, longitude: c.centerLng }
      ) <= radius
    );

    if (existing) {
      const n = existing.reportCount;
      existing.centerLat = (existing.centerLat * n + lat) / (n + 1);
      existing.centerLng = (existing.centerLng * n + lng) / (n + 1);
      existing.reportCount += 1;
      existing.totalCarbonSaved += report.aiAnalysis?.carbonSaving ?? 0;
      existing.severityCounts[report.severity] =
        (existing.severityCounts[report.severity] ?? 0) + 1;
      for (const t of report.wasteTypes ?? []) {
        existing.severityCounts[`wt_${t}`] = (existing.severityCounts[`wt_${t}`] ?? 0) + 1;
      }
    } else {
      const counts: Record<string, number> = { [report.severity]: 1 };
      for (const t of report.wasteTypes ?? []) {
        counts[`wt_${t}`] = (counts[`wt_${t}`] ?? 0) + 1;
      }
      clusters.push({
        id: `cluster_${clusters.length + 1}`,
        centerLat: lat,
        centerLng: lng,
        label: `Zone ${clusters.length + 1}`,
        reportCount: 1,
        totalCarbonSaved: report.aiAnalysis?.carbonSaving ?? 0,
        severityCounts: counts,
        topWasteType: report.wasteTypes?.[0] ?? "unknown",
      });
    }
  }

  for (const cluster of clusters) {
    const wtEntries = Object.entries(cluster.severityCounts)
      .filter(([k]) => k.startsWith("wt_"))
      .sort((a, b) => b[1] - a[1]);
    cluster.topWasteType = wtEntries[0]?.[0].replace("wt_", "") ?? "mixed";
    cluster.totalCarbonSaved = parseFloat(cluster.totalCarbonSaved.toFixed(2));
  }

  return clusters.sort((a, b) => b.reportCount - a.reportCount);
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const radius = parseInt(searchParams.get("radius") ?? String(DEFAULT_RADIUS_METERS));
    const reports = await WasteReport.find({}).lean();
    const clusters = clusterReports(reports, radius);
    return NextResponse.json({ clusters, total: reports.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load leaderboard";
    console.error("GET /api/leaderboard error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
