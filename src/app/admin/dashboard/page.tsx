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
    {
      label: "Total Shipments",
      value: stats.total,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      ),
      accent: "from-slate-600 to-slate-900",
      iconBg: "bg-slate-100",
      iconColor: "text-slate-600",
    },
    {
      label: "Picked Up",
      value: stats.pickedUp,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      ),
      accent: "from-orange-400 to-orange-600",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
    },
    {
      label: "In Transit",
      value: stats.inTransit,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.141-.504 1.125-1.125l-.536-10.318A1.125 1.125 0 0019.143 6H5.357a1.125 1.125 0 00-1.118 1.007L3.75 14.25" />
        </svg>
      ),
      accent: "from-blue-400 to-blue-600",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      label: "Delivered",
      value: stats.delivered,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      accent: "from-emerald-400 to-emerald-600",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
    },
    {
      label: "Express",
      value: stats.express,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
      accent: "from-amber-400 to-amber-600",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
    },
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
            className="bg-white rounded-2xl border border-slate-200 p-5 relative overflow-hidden group hover:shadow-lg hover:border-slate-300 transition-all duration-300 animate-slide-in"
            style={{ animationDelay: `${idx * 60}ms`, opacity: 0 }}
          >
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.accent}`} />
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 ${card.iconBg} rounded-xl flex items-center justify-center ${card.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                {card.icon}
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">{card.value}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">
              {card.label}
            </p>
            {stats.total > 0 && card.label !== "Total Shipments" && (
              <div className="mt-3">
                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${card.accent} rounded-full animate-progress-fill`}
                    style={{ width: `${Math.round((card.value / stats.total) * 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">{stats.total > 0 ? Math.round((card.value / stats.total) * 100) : 0}% of total</p>
              </div>
            )}
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
