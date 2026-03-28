"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { WasteReport, Severity, WasteType } from "@/types";

const WasteMap = dynamic(() => import("@/components/WasteMap"), { ssr: false });

const SEVERITIES: Severity[] = ["mild", "moderate", "severe", "critical"];
const WASTE_TYPES: WasteType[] = ["plastic", "organic", "electronic", "hazardous", "mixed", "unknown"];

export default function MapPage() {
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [severity, setSeverity] = useState("");
  const [wasteType, setWasteType] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (severity) params.set("severity", severity);
    if (wasteType) params.set("wasteType", wasteType);
    fetch(`/api/reports?${params}`)
      .then((r) => r.json())
      .then(setReports);
  }, [severity, wasteType]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900 mr-auto">Waste Map</h1>
        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">All Severities</option>
          {SEVERITIES.map((s) => (
            <option key={s} value={s} className="capitalize">{s}</option>
          ))}
        </select>
        <select
          value={wasteType}
          onChange={(e) => setWasteType(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">All Types</option>
          {WASTE_TYPES.map((t) => (
            <option key={t} value={t} className="capitalize">{t}</option>
          ))}
        </select>
      </div>

      {/* Legend */}
      <div className="flex gap-4 flex-wrap text-xs text-gray-600">
        {[
          { label: "Mild", color: "bg-green-500" },
          { label: "Moderate", color: "bg-yellow-500" },
          { label: "Severe", color: "bg-orange-500" },
          { label: "Critical", color: "bg-red-500" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-full ${color}`} />
            {label}
          </div>
        ))}
        <span className="ml-auto text-gray-400">{reports.length} reports</span>
      </div>

      <div className="h-[60vh] rounded-xl overflow-hidden border border-gray-200 shadow-sm">
        <WasteMap reports={reports} />
      </div>
    </div>
  );
}
