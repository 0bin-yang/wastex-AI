"use client";

import { useEffect, useRef, useState } from "react";
import { WasteReport, Severity } from "@/types";

const SEVERITY_COLORS: Record<Severity, string> = {
  mild: "#22c55e",
  moderate: "#eab308",
  severe: "#f97316",
  critical: "#ef4444",
};

const SEVERITY_HEAT_WEIGHT: Record<Severity, number> = {
  mild: 0.25,
  moderate: 0.5,
  severe: 0.75,
  critical: 1.0,
};

interface Props {
  reports: WasteReport[];
}

export default function WasteMap({ reports }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const heatLayerRef = useRef<any>(null);
  const [heatMode, setHeatMode] = useState(false);

  // Initialize map once
  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;
    if (mapInstanceRef.current) return;

    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      if (cancelled || !mapRef.current) return;

      const container = mapRef.current as HTMLDivElement & { _leaflet_id?: number };
      if (container._leaflet_id) return;

      const map = L.map(container).setView([-1.2921, 36.8219], 6);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);
    })();

    return () => { cancelled = true; };
  }, []);

  // Update markers/heatmap when reports or mode changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    (async () => {
      const L = (await import("leaflet")).default;

      // Clear markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      // Clear heatmap
      if (heatLayerRef.current) {
        heatLayerRef.current.remove();
        heatLayerRef.current = null;
      }

      if (heatMode) {
        // @ts-expect-error leaflet.heat has no types
        await import("leaflet.heat");
        const heatPoints = reports.map((r) => [
          r.location.lat,
          r.location.lng,
          SEVERITY_HEAT_WEIGHT[r.severity],
        ]);
        // @ts-expect-error leaflet.heat extends L
        heatLayerRef.current = L.heatLayer(heatPoints, {
          radius: 35,
          blur: 25,
          maxZoom: 12,
          gradient: { 0.25: "#22c55e", 0.5: "#eab308", 0.75: "#f97316", 1.0: "#ef4444" },
        }).addTo(map);
      } else {
        reports.forEach((report) => {
          const color = SEVERITY_COLORS[report.severity];
          const marker = L.circleMarker([report.location.lat, report.location.lng], {
            radius: 10,
            fillColor: color,
            color: "#fff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.85,
          }).addTo(map);

          marker.bindPopup(`
            <div style="min-width:180px">
              <img src="${report.imageUrl}" style="width:100%;border-radius:6px;margin-bottom:8px" />
              <strong style="text-transform:capitalize">${report.severity} severity</strong><br/>
              <span style="color:#666;font-size:12px">${report.wasteTypes.join(", ")}</span><br/>
              <span style="color:#999;font-size:11px">${new Date(report.createdAt).toLocaleDateString()}</span>
              ${report.aiAnalysis?.summary ? `<p style="font-size:11px;margin-top:4px">${report.aiAnalysis.summary}</p>` : ""}
              ${report.aiAnalysis?.recyclingGuidance ? `<p style="font-size:11px;color:#2563eb;margin-top:4px">♻️ ${report.aiAnalysis.recyclingGuidance}</p>` : ""}
              ${report.aiAnalysis?.carbonSaving ? `<p style="font-size:11px;color:#16a34a;margin-top:2px">🌱 ~${report.aiAnalysis.carbonSaving}kg CO₂ saved</p>` : ""}
            </div>
          `);

          markersRef.current.push(marker);
        });
      }
    })();
  }, [reports, heatMode]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-xl" />
      <button
        onClick={() => setHeatMode((v) => !v)}
        className={`absolute top-3 right-3 z-[1000] px-3 py-1.5 rounded-lg text-xs font-semibold shadow transition-colors ${
          heatMode
            ? "bg-orange-500 text-white"
            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
        }`}
      >
        {heatMode ? "🔥 Heatmap" : "📍 Markers"}
      </button>
    </div>
  );
}
