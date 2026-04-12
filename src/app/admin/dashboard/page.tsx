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
    trackingCode: string;
    receiverName: string;
  };
}

interface Stats {
  total: number;
  pickedUp: number;
  inTransit: number;
  delivered: number;
  express: number;
  recentActivity: Activity[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loading text="Loading dashboard..." />;
  }

  if (error || !stats) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 text-sm mb-4">Failed to load dashboard data.</p>
        <button onClick={() => window.location.reload()} className="text-xs font-semibold px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
          Retry
        </button>
      </div>
    );
  }

  const statCards = [
    { label: "Total Shipments", value: stats.total, color: "bg-slate-900", textColor: "text-white" },
    { label: "Picked Up", value: stats.pickedUp, color: "bg-orange-500", textColor: "text-white" },
    { label: "In Transit", value: stats.inTransit, color: "bg-blue-600", textColor: "text-white" },
    { label: "Delivered", value: stats.delivered, color: "bg-emerald-600", textColor: "text-white" },
    { label: "Express", value: stats.express, color: "bg-amber-500", textColor: "text-white" },
  ];

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-slate-500 text-xs mt-1 tracking-wide">Overview of all shipment activity</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-8">
        {statCards.map((card, idx) => (
          <div
            key={card.label}
            className={`${card.color} rounded-2xl p-5 animate-slide-in`}
            style={{ animationDelay: `${idx * 60}ms`, opacity: 0 }}
          >
            <p className={`text-[10px] ${card.textColor} opacity-70 uppercase tracking-widest font-bold`}>
              {card.label}
            </p>
            <p className={`text-3xl font-bold ${card.textColor} mt-1`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <a
          href="/admin/create"
          className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-orange-300 transition-colors group"
        >
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-orange-500 transition-colors">
            <svg className="w-5 h-5 text-orange-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-slate-900">New Shipment</p>
          <p className="text-xs text-slate-400 mt-0.5">Create a new shipment</p>
        </a>
        <a
          href="/admin/shipments"
          className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-orange-300 transition-colors group"
        >
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-slate-900 transition-colors">
            <svg className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-slate-900">All Shipments</p>
          <p className="text-xs text-slate-400 mt-0.5">View and manage shipments</p>
        </a>
        <a
          href="/api/admin/export"
          className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-orange-300 transition-colors group"
        >
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-emerald-600 transition-colors">
            <svg className="w-5 h-5 text-emerald-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-slate-900">Export CSV</p>
          <p className="text-xs text-slate-400 mt-0.5">Download all shipment data</p>
        </a>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recent Activity</p>
        </div>
        {stats.recentActivity.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400">No activity yet</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {stats.recentActivity.map((a, idx) => (
              <div
                key={a.id}
                className="px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition-colors animate-slide-in gap-1 sm:gap-0"
                style={{ animationDelay: `${idx * 30}ms`, opacity: 0 }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <StatusBadge status={a.status} />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-900 truncate">{a.description}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      <span className="font-mono font-bold">{a.shipment.trackingCode}</span>
                      <span className="mx-1.5">·</span>
                      {a.shipment.receiverName}
                    </p>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 flex-shrink-0 ml-4">
                  {new Date(a.timestamp).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
