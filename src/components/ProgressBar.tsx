"use client";

import { getStatusPercentage, getStatusLabel } from "@/lib/routes";

const steps = [
  { label: "Picked Up", threshold: 20 },
  { label: "In Transit", threshold: 50 },
  { label: "Arrived", threshold: 80 },
  { label: "Delivered", threshold: 100 },
];

export default function ProgressBar({ status }: { status: string }) {
  const percentage = getStatusPercentage(status);
  const label = getStatusLabel(status);

  return (
    <div className="w-full">
      <div className="flex justify-between mb-3">
        <span className="text-sm font-semibold text-slate-800">{label}</span>
        <span className="text-sm font-bold text-orange-500">{percentage}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
        <div
          className="h-3 rounded-full animate-progress-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor:
              percentage === 100 ? "#059669" : "#f97316",
          }}
        />
      </div>
      <div className="flex justify-between mt-3">
        {steps.map((step) => (
          <div key={step.label} className="flex flex-col items-center">
            <div
              className={`w-3 h-3 rounded-full mb-1 transition-all duration-500 ${
                percentage >= step.threshold
                  ? step.threshold === 100
                    ? "bg-emerald-600"
                    : "bg-orange-500"
                  : "bg-slate-200"
              }`}
            />
            <span
              className={`text-[10px] font-medium tracking-wide ${
                percentage >= step.threshold
                  ? "text-slate-800"
                  : "text-slate-400"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
