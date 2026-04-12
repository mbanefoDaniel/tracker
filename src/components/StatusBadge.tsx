"use client";

import { getStatusLabel, getStatusColor } from "@/lib/routes";

export default function StatusBadge({
  status,
  size = "sm",
}: {
  status: string;
  size?: "sm" | "md";
}) {
  const label = getStatusLabel(status);
  const color = getStatusColor(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-semibold uppercase tracking-wider ${color} ${
        size === "md"
          ? "px-3 py-1.5 text-xs"
          : "px-2 py-1 text-[10px]"
      }`}
    >
      <span
        className={`rounded-full ${
          status === "in_transit" ? "animate-pulse-glow" : ""
        } ${size === "md" ? "w-2 h-2" : "w-1.5 h-1.5"}`}
        style={{
          backgroundColor:
            status === "delivered"
              ? "#a7f3d0"
              : status === "in_transit"
              ? "#fed7aa"
              : "#cbd5e1",
        }}
      />
      {label}
    </span>
  );
}
