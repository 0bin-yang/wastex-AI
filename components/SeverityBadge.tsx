"use client";

import { Severity } from "@/types";

const SEVERITY_COLORS: Record<Severity, string> = {
  mild: "bg-green-100 text-green-800",
  moderate: "bg-yellow-100 text-yellow-800",
  severe: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${SEVERITY_COLORS[severity]}`}>
      {severity}
    </span>
  );
}
