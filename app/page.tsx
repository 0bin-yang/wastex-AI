import Link from "next/link";
import { Camera, MapPin, BarChart3, Leaf } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center text-center gap-10 py-12">
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Leaf className="w-12 h-12 text-green-600" />
          <h1 className="text-5xl font-extrabold text-gray-900">WasteX-AI</h1>
        </div>
        <p className="text-xl text-gray-500 max-w-xl">
          AI-powered waste awareness. Report litter, detect waste types, and visualize hotspots — for a cleaner community.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl">
        {[
          {
            icon: Camera,
            title: "Report Waste",
            desc: "Snap a photo and submit a report with automatic GPS tagging.",
            href: "/report",
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            icon: MapPin,
            title: "View Map",
            desc: "Explore color-coded waste hotspots on an interactive map.",
            href: "/map",
            color: "text-orange-600",
            bg: "bg-orange-50",
          },
          {
            icon: BarChart3,
            title: "Dashboard",
            desc: "Filter and analyze reports by severity, type, and date.",
            href: "/dashboard",
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
        ].map(({ icon: Icon, title, desc, href, color, bg }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className={`p-3 rounded-xl ${bg}`}>
              <Icon className={`w-7 h-7 ${color}`} />
            </div>
            <h2 className="font-bold text-gray-800">{title}</h2>
            <p className="text-sm text-gray-500">{desc}</p>
          </Link>
        ))}
      </div>

      <Link
        href="/report"
        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl text-lg transition-colors"
      >
        Report Waste Now
      </Link>
    </div>
  );
}
