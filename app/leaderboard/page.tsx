"use client";

import { useEffect, useState } from "react";
import { Leaf, MapPin, Trophy, Recycle } from "lucide-react";

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

const RADIUS_OPTIONS = [
  { label: "500m", value: 500 },
  { label: "1km", value: 1000 },
  { label: "2km", value: 2000 },
  { label: "5km", value: 5000 },
];

const MEDAL = ["🥇", "🥈", "🥉"];

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
      <div className="w-8 h-8 bg-gray-200 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-3 w-40 bg-gray-200 rounded" />
      </div>
      <div className="h-6 w-16 bg-gray-200 rounded-full" />
    </div>
  );
}

export default function LeaderboardPage() {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [radius, setRadius] = useState(2000);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/leaderboard?radius=${radius}`)
      .then((r) => r.json())
      .then((data) => {
        setClusters(data.clusters ?? []);
        setTotal(data.total ?? 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [radius]);

  const totalCarbonSaved = clusters
    .reduce((sum, c) => sum + c.totalCarbonSaved, 0)
    .toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="mr-auto">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Neighborhood Leaderboard
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Neighborhoods ranked by waste reports within GPS radius
          </p>
        </div>

        {/* Radius selector */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1">
          {RADIUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setRadius(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                radius === opt.value
                  ? "bg-green-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      {!loading && clusters.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-3xl font-bold text-gray-800">{clusters.length}</p>
            <p className="text-sm text-gray-500 mt-1">Neighborhoods</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-3xl font-bold text-gray-800">{total}</p>
            <p className="text-sm text-gray-500 mt-1">Total Reports</p>
          </div>
          <div className="bg-green-50 rounded-xl border border-green-200 p-4 text-center col-span-2 sm:col-span-1">
            <p className="text-3xl font-bold text-green-700">{totalCarbonSaved}kg</p>
            <p className="text-sm text-green-600 mt-1 flex items-center justify-center gap-1">
              <Leaf className="w-3.5 h-3.5" /> CO₂ Saved
            </p>
          </div>
        </div>
      )}

      {/* Rankings */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
        ) : clusters.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No reports yet. Be the first to report!</p>
        ) : (
          clusters.map((cluster, index) => (
            <div
              key={cluster.id}
              className={`flex items-center gap-4 bg-white rounded-xl border p-4 transition-shadow hover:shadow-md ${
                index === 0 ? "border-yellow-300 bg-yellow-50" :
                index === 1 ? "border-gray-300 bg-gray-50" :
                index === 2 ? "border-orange-200 bg-orange-50" :
                "border-gray-200"
              }`}
            >
              {/* Rank */}
              <div className="text-2xl w-8 text-center shrink-0">
                {MEDAL[index] ?? <span className="text-sm font-bold text-gray-400">#{index + 1}</span>}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800">{cluster.label}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {cluster.centerLat.toFixed(3)}, {cluster.centerLng.toFixed(3)}
                  </span>
                  <span className="flex items-center gap-1 capitalize">
                    <Recycle className="w-3 h-3" />
                    Top: {cluster.topWasteType}
                  </span>
                  <span className="flex items-center gap-1 text-green-600">
                    <Leaf className="w-3 h-3" />
                    {cluster.totalCarbonSaved}kg CO₂
                  </span>
                </div>
              </div>

              {/* Report count badge */}
              <div className="shrink-0 text-center">
                <span className="text-2xl font-bold text-gray-800">{cluster.reportCount}</span>
                <p className="text-xs text-gray-400">reports</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
