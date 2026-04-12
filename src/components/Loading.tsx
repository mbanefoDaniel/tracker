"use client";

export default function Loading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6">
      {/* Animated truck */}
      <div className="relative w-32 h-20">
        {/* Road line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-200 overflow-hidden">
          <div className="h-full w-full animate-[roadSlide_1s_linear_infinite] bg-[repeating-linear-gradient(90deg,#1e293b_0px,#1e293b_8px,transparent_8px,transparent_16px)]" />
        </div>
        {/* Truck body */}
        <div className="absolute bottom-[2px] left-1/2 -translate-x-1/2 animate-[truckBounce_0.6s_ease-in-out_infinite]">
          <svg width="64" height="44" viewBox="0 0 64 44" fill="none">
            {/* Cargo */}
            <rect x="0" y="4" width="36" height="24" rx="3" fill="#1e293b" />
            <rect x="4" y="8" width="10" height="8" rx="1" fill="#f97316" opacity="0.3" />
            <rect x="16" y="8" width="10" height="8" rx="1" fill="#f97316" opacity="0.2" />
            {/* Cabin */}
            <path d="M36 12 L36 28 L52 28 L52 20 L44 12 Z" fill="#334155" />
            <rect x="44" y="16" width="6" height="6" rx="1" fill="#94a3b8" />
            {/* Bumper */}
            <rect x="52" y="24" width="6" height="4" rx="1" fill="#475569" />
            {/* Wheels */}
            <circle cx="12" cy="32" r="6" fill="#334155" />
            <circle cx="12" cy="32" r="3" fill="#94a3b8" className="animate-spin" style={{ transformOrigin: "12px 32px" }} />
            <circle cx="44" cy="32" r="6" fill="#334155" />
            <circle cx="44" cy="32" r="3" fill="#94a3b8" className="animate-spin" style={{ transformOrigin: "44px 32px" }} />
          </svg>
        </div>
      </div>
      {/* Text with pulse */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-[dotPulse_1.4s_ease-in-out_infinite]" />
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-[dotPulse_1.4s_ease-in-out_0.2s_infinite]" />
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-[dotPulse_1.4s_ease-in-out_0.4s_infinite]" />
        </div>
        <span className="text-sm font-medium text-slate-500">{text}</span>
      </div>
    </div>
  );
}
