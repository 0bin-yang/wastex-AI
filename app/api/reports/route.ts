import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { WasteReport } from "@/models/WasteReport";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const filter: Record<string, unknown> = {};

    const severity = searchParams.get("severity");
    const wasteType = searchParams.get("wasteType");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    if (severity) filter.severity = severity;
    if (wasteType) filter.wasteTypes = wasteType;
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) (filter.createdAt as Record<string, Date>).$gte = new Date(dateFrom);
      if (dateTo) (filter.createdAt as Record<string, Date>).$lte = new Date(dateTo);
    }

    const reports = await WasteReport.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json(reports);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch reports";
    console.error("GET /api/reports error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const report = await WasteReport.create(body);
    return NextResponse.json(report, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create report";
    console.error("POST /api/reports error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
