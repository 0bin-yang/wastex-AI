"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Plus, LayoutDashboard, Leaf, Trophy } from "lucide-react";

const NAV = [
  { href: "/", label: "Home", icon: Leaf },
  { href: "/report", label: "Report", icon: Plus },
  { href: "/map", label: "Map", icon: MapPin },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-green-700 text-lg">
          <Leaf className="w-5 h-5" />
          WasteX-AI
        </Link>
        <div className="flex items-center gap-1">
          {NAV.slice(1).map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === href
                  ? "bg-green-100 text-green-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
