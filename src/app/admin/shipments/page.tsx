"use client";

import { useEffect, useState, useMemo } from "react";
import StatusBadge from "@/components/StatusBadge";
import Loading from "@/components/Loading";

interface Shipment {
  id: string;
  trackingCode: string;
  origin: string;
  destination: string;
  receiverName: string;
  currentStatus: string;
  currentStep: number;
  priority: string;
  route: string[];
  createdAt: string;
  updates: { location: string }[];
}

export default function ShipmentsListPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  useEffect(() => {
    fetch("/api/shipments")
      .then((res) => res.json())
      .then((data) => {
        setShipments(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return shipments.filter((s) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        s.trackingCode.toLowerCase().includes(q) ||
        s.receiverName.toLowerCase().includes(q) ||
        s.origin.toLowerCase().includes(q) ||
        s.destination.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || s.currentStatus === statusFilter;
      const matchesPriority = priorityFilter === "all" || s.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [shipments, search, statusFilter, priorityFilter]);

  if (loading) {
    return <Loading text="Loading shipments..." />;
  }

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Shipments</h1>
          <p className="text-slate-500 text-xs mt-1 tracking-wide">
            {filtered.length} of {shipments.length} shipment{shipments.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/api/admin/export"
            className="text-xs font-semibold px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Export CSV
          </a>
          <a
            href="/admin/create"
            className="text-xs font-semibold px-5 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            + New Shipment
          </a>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex flex-col sm:flex-row flex-wrap gap-3">
        <div className="flex-1 min-w-0 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code, name, city..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm text-slate-900 bg-slate-50 placeholder-slate-400"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Statuses</option>
          <option value="picked_up">Picked Up</option>
          <option value="in_transit">In Transit</option>
          <option value="delivered">Delivered</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Priorities</option>
          <option value="standard">Standard</option>
          <option value="express">Express</option>
        </select>
        {(search || statusFilter !== "all" || priorityFilter !== "all") && (
          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
              setPriorityFilter("all");
            }}
            className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
          <svg className="w-16 h-16 mx-auto mb-4" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="36" r="20" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="2"/>
            <path d="M34 36L40 30L46 36" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
            <path d="M40 30V44" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
            <path d="M54 52L62 60" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round"/>
          </svg>
          <p className="text-slate-900 font-semibold mb-1">
            {shipments.length === 0 ? "No shipments yet" : "No matching shipments"}
          </p>
          <p className="text-slate-400 text-sm mb-6">
            {shipments.length === 0
              ? "Create your first shipment to get started"
              : "Try adjusting your search or filters"}
          </p>
          {shipments.length === 0 && (
            <a
              href="/admin/create"
              className="inline-flex px-5 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-xs font-semibold"
            >
              Create First Shipment
            </a>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-5 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Tracking Code
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Receiver
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Route
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Priority
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Location
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Created
                </th>
                <th className="px-5 py-3 text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  &nbsp;
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, idx) => (
                <tr
                  key={s.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors animate-slide-in"
                  style={{ animationDelay: `${idx * 30}ms`, opacity: 0 }}
                >
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md tracking-wider">
                      {s.trackingCode}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-xs font-medium text-slate-700">
                    {s.receiverName}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="text-xs text-slate-500">
                      {s.origin}
                      <span className="mx-1.5 text-slate-300">→</span>
                      {s.destination}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <StatusBadge status={s.currentStatus} />
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${s.priority === "express" ? "text-orange-500" : "text-slate-400"}`}>
                      {s.priority}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                    {s.updates[0]?.location || "—"}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-400">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <a
                      href={`/admin/shipments/${s.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-orange-500 hover:text-orange-700 transition-colors"
                    >
                      Details
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
