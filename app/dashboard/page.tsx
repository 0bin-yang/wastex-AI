"use client";

import { useEffect, useState } from "react";
import { WasteReport, Severity, WasteType } from "@/types";
import { SeverityBadge } from "@/components/SeverityBadge";
import { MapPin, Calendar, Leaf, Recycle } from "lucide-react";

const SEVERITIES: Severity[] = ["mild", "moderate", "severe", "critical"];
const WASTE_TYPES: WasteType[] = ["plastic", "organic", "electronic", "hazardous", "mixed", "unknown"];

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
      <div className="w-full h-40 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-gray-200 rounded-full" />
          <div className="h-5 w-12 bg-gray-200 rounded-full" />
        </div>
        <div className="h-3 w-full bg-gray-200 rounded" />
        <div className="h-3 w-2/3 bg-gray-200 rounded" />
        <div className="flex gap-3">
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-3 w-20 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

function SkeletonStat() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 text-center animate-pulse">
      <div className="h-8 w-12 bg-gray-200 rounded mx-auto mb-2" />
      <div className="h-5 w-16 bg-gray-200 rounded-full mx-auto" />
    </div>
  );
}

export default function DashboardPage() {
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [severity, setSeverity] = useState("");
  const [wasteType, setWasteType] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (severity) params.set("severity", severity);
    if (wasteType) params.set("wasteType", wasteType);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    fetch(`/api/reports?${params}`)
      .then((r) => r.json())
      .then((data) => { setReports(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [severity, wasteType, dateFrom, dateTo]);

  const counts = SEVERITIES.reduce((acc, s) => {
    acc[s] = reports.filter((r) => r.severity === s).length;
    return acc;
  }, {} as Record<Severity, number>);

  const totalCarbonSaved = reports.reduce(
    (sum, r) => sum + (r.aiAnalysis?.carbonSaving ?? 0), 0
  ).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        {!loading && reports.length > 0 && (
          <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-xl px-3 py-1.5">
            <Leaf className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">
              {totalCarbonSaved}kg CO₂ saved across all reports
            </span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {loading
          ? SEVERITIES.map((s) => <SkeletonStat key={s} />)
          : SEVERITIES.map((s) => (
              <div key={s} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <p className="text-3xl font-bold text-gray-800">{counts[s]}</p>
                <SeverityBadge severity={s} />
              </div>
            ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 bg-white p-4 rounded-xl border border-gray-200">
        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">All Severities</option>
          {SEVERITIES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
        <select
          value={wasteType}
          onChange={(e) => setWasteType(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">All Types</option>
          {WASTE_TYPES.map((t) => <option key={t} value={t} className="capitalize">{t}</option>)}
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <span className="ml-auto text-sm text-gray-400 self-center">{reports.length} reports</span>
      </div>

      {/* Report Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : reports.length === 0 ? (
        <p className="text-center text-gray-400 py-12">No reports found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report) => (
            <div key={report._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <img src={report.imageUrl} alt="waste" className="w-full h-40 object-cover" />
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <SeverityBadge severity={report.severity} />
                  <div className="flex gap-1 flex-wrap justify-end">
                    {report.wasteTypes.map((t) => (
                      <span key={t} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs capitalize">{t}</span>
                    ))}
                  </div>
                </div>
                {report.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{report.description}</p>
                )}
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {report.location.lat.toFixed(3)}, {report.location.lng.toFixed(3)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {report.aiAnalysis?.carbonSaving ? (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <Leaf className="w-3 h-3" />
                    ~{report.aiAnalysis.carbonSaving}kg CO₂ saved
                  </div>
                ) : null}
                {report.aiAnalysis?.recyclingGuidance && (
                  <div className="flex items-start gap-1 text-xs text-blue-600">
                    <Recycle className="w-3 h-3 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{report.aiAnalysis.recyclingGuidance}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
