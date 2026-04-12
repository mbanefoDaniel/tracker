"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import StatusBadge from "@/components/StatusBadge";

interface Activity {
  id: string;
  location: string;
  status: string;
  description: string;
  timestamp: string;
  shipment: {
    id: string;
    trackingCode: string;
    receiverName: string;
  };
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setActivities(data.recentActivity || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loading text="Loading activity..." />;
  }

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Activity Log</h1>
        <p className="text-slate-500 text-xs mt-1 tracking-wide">Recent tracking updates across all shipments</p>
      </div>

      {activities.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
          <svg className="w-16 h-16 mx-auto mb-4" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="28" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="2"/>
            <path d="M40 28V40L48 44" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="text-slate-900 font-semibold mb-1">No activity yet</p>
          <p className="text-slate-400 text-sm">Activity will appear here as shipments are updated</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {activities.map((a, idx) => (
              <a
                key={a.id}
                href={`/admin/shipments/${a.shipment.id}`}
                className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition-colors animate-slide-in gap-2"
                style={{ animationDelay: `${idx * 30}ms`, opacity: 0 }}
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <StatusBadge status={a.status} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{a.description}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {a.shipment.trackingCode}
                      </span>
                      <span className="text-[10px] text-slate-400">{a.shipment.receiverName}</span>
                      <span className="hidden sm:inline text-[10px] text-slate-300">·</span>
                      <span className="hidden sm:inline text-[10px] text-slate-400">{a.location}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="text-xs text-slate-500">
                    {new Date(a.timestamp).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {new Date(a.timestamp).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
