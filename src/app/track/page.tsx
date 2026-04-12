"use client";

import { useState } from "react";
import ProgressBar from "@/components/ProgressBar";
import Timeline from "@/components/Timeline";
import StatusBadge from "@/components/StatusBadge";
import Loading from "@/components/Loading";
import { estimateDeliveryDate } from "@/lib/routes";

interface TrackingUpdate {
  id: string;
  location: string;
  status: string;
  description: string;
  timestamp: string;
}

interface Shipment {
  id: string;
  trackingCode: string;
  origin: string;
  destination: string;
  receiverName: string;
  receiverPhone: string;
  senderName: string;
  senderPhone: string;
  packageDesc: string;
  packageWeight: string;
  priority: string;
  currentStatus: string;
  route: string[];
  currentStep: number;
  createdAt: string;
  updates: TrackingUpdate[];
}

export default function TrackPage() {
  const [code, setCode] = useState("");
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError("");
    setShipment(null);

    try {
      const res = await fetch(`/api/track?code=${encodeURIComponent(code.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setShipment(data);
      }
    } catch {
      setError("Failed to fetch tracking info");
    } finally {
      setLoading(false);
    }
  };

  const currentLocation =
    shipment && shipment.updates.length > 0
      ? shipment.updates[0].location
      : null;

  const estimatedDelivery =
    shipment
      ? estimateDeliveryDate(
          new Date(shipment.createdAt),
          shipment.route.length
        )
      : null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.141-.504 1.125-1.125l-.536-10.318A1.125 1.125 0 0019.143 6H5.357a1.125 1.125 0 00-1.118 1.007L3.75 14.25" />
                </svg>
              </div>
              <div>
                <span className="text-lg font-bold text-white tracking-tight">
                  NEFO<span className="text-orange-400">Track</span>
                </span>
                <p className="text-[10px] text-slate-400 -mt-0.5 tracking-widest uppercase">Shipment Tracking</p>
              </div>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Search */}
      <div className="bg-slate-900 pb-16 sm:pb-20 pt-10 sm:pt-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          {/* Animated Truck Illustration */}
          <div className="mb-8 relative w-full max-w-md mx-auto h-24 overflow-hidden">
            {/* Road */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-700" />
            {/* Road dashes */}
            <div className="absolute bottom-[6px] left-0 right-0 h-[2px] flex gap-3" style={{ animation: "roadScroll 1.5s linear infinite" }}>
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="w-6 h-[2px] bg-slate-600 flex-shrink-0 rounded" />
              ))}
            </div>
            {/* Truck — drives continuously */}
            <svg
              className="absolute bottom-[3px]"
              style={{ animation: "truckDrive 6s ease-in-out infinite" }}
              width="96" height="72" viewBox="0 0 96 72" fill="none"
            >
              {/* Body bounce */}
              <g style={{ animation: "truckBob 0.4s ease-in-out infinite" }}>
                {/* Container */}
                <rect x="4" y="12" width="52" height="32" rx="4" fill="#334155"/>
                <rect x="8" y="16" width="16" height="12" rx="2" fill="#f97316" opacity="0.3"/>
                <rect x="28" y="16" width="16" height="12" rx="2" fill="#f97316" opacity="0.2"/>
                {/* Cabin */}
                <path d="M56 20L56 44L76 44L76 30L68 20Z" fill="#475569"/>
                <rect x="68" y="28" width="6" height="8" rx="1" fill="#94a3b8"/>
                {/* Bumper */}
                <rect x="76" y="36" width="8" height="6" rx="2" fill="#64748b"/>
                {/* Headlight */}
                <rect x="84" y="37" width="3" height="4" rx="1" fill="#fbbf24" opacity="0.8"/>
                {/* Exhaust puffs */}
                <g style={{ animation: "exhaustPuff 1s ease-out infinite" }}>
                  <circle cx="4" cy="42" r="3" fill="#64748b" opacity="0.3"/>
                </g>
                <g style={{ animation: "exhaustPuff 1s ease-out infinite 0.3s" }}>
                  <circle cx="-4" cy="38" r="2.5" fill="#64748b" opacity="0.2"/>
                </g>
              </g>
              {/* Wheels — spin continuously */}
              <g style={{ transformOrigin: "20px 56px", animation: "wheelSpin 0.5s linear infinite" }}>
                <circle cx="20" cy="56" r="8" fill="#1e293b"/>
                <circle cx="20" cy="56" r="4" fill="#f97316"/>
                <rect x="19" y="48" width="2" height="16" rx="1" fill="#334155" opacity="0.5"/>
              </g>
              <g style={{ transformOrigin: "64px 56px", animation: "wheelSpin 0.5s linear infinite" }}>
                <circle cx="64" cy="56" r="8" fill="#1e293b"/>
                <circle cx="64" cy="56" r="4" fill="#f97316"/>
                <rect x="63" y="48" width="2" height="16" rx="1" fill="#334155" opacity="0.5"/>
              </g>
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
            Track Your Shipment
          </h1>
          <p className="text-slate-400 mb-8 text-sm">
            Enter your tracking code to get real-time updates
          </p>

          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="flex-1 relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. NEFO123456"
                className="w-full pl-10 pr-4 py-3.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm font-medium tracking-wider"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-7 py-3.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 disabled:opacity-50 transition-colors text-sm"
            >
              {loading ? (
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                "Track"
              )}
            </button>
          </form>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 -mt-10">
        {/* Loading */}
        {loading && <Loading text="Looking up your shipment..." />}

        {/* Error */}
        {error && (
          <div className="animate-fade-in-up bg-white rounded-2xl border border-red-200 p-8 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <p className="text-slate-900 font-semibold mb-1">Shipment Not Found</p>
            <p className="text-sm text-slate-500">{error}</p>
          </div>
        )}

        {/* Results */}
        {shipment && (
          <div className="space-y-5 animate-fade-in-up pb-16">
            {/* Main Info Card */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              {/* Dark header strip */}
              <div className="bg-slate-900 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-0.5">Tracking Code</p>
                  <p className="text-xl font-bold text-white tracking-[0.15em] font-mono">
                    {shipment.trackingCode}
                  </p>
                </div>
                <StatusBadge status={shipment.currentStatus} size="md" />
              </div>

              <div className="p-4 sm:p-6">
                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 mb-6">
                  <div className="bg-slate-50 rounded-xl p-3.5">
                    <div className="flex items-center gap-2 mb-1.5">
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Origin</p>
                    </div>
                    <p className="text-sm font-bold text-slate-900">{shipment.origin}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3.5">
                    <div className="flex items-center gap-2 mb-1.5">
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
                      </svg>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Destination</p>
                    </div>
                    <p className="text-sm font-bold text-slate-900">{shipment.destination}</p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-3.5 border border-orange-100">
                    <div className="flex items-center gap-2 mb-1.5">
                      <svg className="w-3.5 h-3.5 text-orange-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                      </svg>
                      <p className="text-[10px] text-orange-500 uppercase tracking-widest font-semibold">Current Location</p>
                    </div>
                    <p className="text-sm font-bold text-orange-600">{currentLocation || "—"}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3.5">
                    <div className="flex items-center gap-2 mb-1.5">
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Receiver</p>
                    </div>
                    <p className="text-sm font-bold text-slate-900">{shipment.receiverName}</p>
                  </div>
                  {shipment.packageDesc && (
                    <div className="bg-slate-50 rounded-xl p-3.5">
                      <div className="flex items-center gap-2 mb-1.5">
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                        </svg>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Package</p>
                      </div>
                      <p className="text-sm font-bold text-slate-900">{shipment.packageDesc}</p>
                      {shipment.packageWeight && <p className="text-xs text-slate-500 mt-0.5">{shipment.packageWeight}</p>}
                    </div>
                  )}
                </div>

                {estimatedDelivery && shipment.currentStatus !== "delivered" && (
                  <div className="mb-6 flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-slate-900 rounded-lg flex-wrap">
                    <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs text-slate-300">
                      Estimated Delivery:{" "}
                      <span className="font-bold text-white">
                        {estimatedDelivery.toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </p>
                  </div>
                )}

                <ProgressBar status={shipment.currentStatus} />
              </div>
            </div>

            {/* Route Visualization */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6">
              <h3 className="text-xs font-bold text-slate-900 mb-4 uppercase tracking-widest">
                Route
              </h3>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 -mx-1 px-1">
                {shipment.route.map((stop: string, idx: number) => (
                  <div key={idx} className="flex items-center">
                    <div
                      className={`flex-shrink-0 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                        idx <= shipment.currentStep
                          ? idx === shipment.currentStep
                            ? "bg-orange-500 text-white"
                            : "bg-slate-800 text-white"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {stop}
                    </div>
                    {idx < shipment.route.length - 1 && (
                      <div className={`flex-shrink-0 mx-1 ${idx < shipment.currentStep ? "text-slate-800" : "text-slate-200"}`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6">
              <h3 className="text-xs font-bold text-slate-900 mb-6 uppercase tracking-widest">
                Tracking History
              </h3>
              <Timeline updates={shipment.updates} />
            </div>
          </div>
        )}

        {/* Empty state when nothing searched */}
        {!shipment && !loading && !error && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-slate-200" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <p className="text-sm text-slate-400 font-medium">Enter a tracking code above to get started</p>
          </div>
        )}
      </main>
    </div>
  );
}
