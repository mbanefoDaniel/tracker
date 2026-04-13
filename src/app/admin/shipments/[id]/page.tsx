"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
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
  paymentType: string;
  paymentStatus: string;
  amount: number;
  paymentMethod: string;
  paymentReference: string;
  deliveryLocked: boolean;
  currentStatus: string;
  route: string[];
  currentStep: number;
  createdAt: string;
  updates: TrackingUpdate[];
}

export default function ShipmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const fetchShipment = useCallback(async () => {
    try {
      const res = await fetch(`/api/shipments/${params.id}`);
      const data = await res.json();
      if (res.ok) setShipment(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchShipment();
  }, [fetchShipment]);

  const handleNextStep = async () => {
    if (!shipment) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/shipments/${shipment.id}/next-step`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) setShipment(data);
    } catch {
      // ignore
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeliver = async () => {
    if (!shipment) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/shipments/${shipment.id}/deliver`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) setShipment(data);
    } catch {
      // ignore
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!shipment) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/shipments/${shipment.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/admin/shipments");
      }
    } catch {
      // ignore
    } finally {
      setActionLoading(false);
      setDeleteConfirm(false);
    }
  };

  const handleMarkPaid = async () => {
    if (!shipment) return;
    setPaymentLoading(true);
    try {
      const res = await fetch(`/api/shipments/${shipment.id}/mark-paid`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (res.ok) setShipment(data);
    } catch {
      // ignore
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return <Loading text="Loading shipment..." />;
  }

  if (!shipment) {
    return (
      <div className="text-center py-20 animate-fade-in-up">
        <svg className="w-16 h-16 mx-auto mb-4" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="28" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="2"/>
          <path d="M32 44L40 36L48 44" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M40 36V50" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
        <p className="text-slate-500 font-medium mb-2">Shipment not found</p>
        <a
          href="/admin"
          className="text-orange-500 hover:text-orange-700 text-xs font-semibold mt-2 inline-flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to shipments
        </a>
      </div>
    );
  }

  const isDelivered = shipment.currentStatus === "delivered";
  const isAtDestination = shipment.currentStep >= shipment.route.length - 1;
  const estimatedDelivery = estimateDeliveryDate(
    new Date(shipment.createdAt),
    shipment.route.length
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <a
            href="/admin"
            className="text-xs text-slate-400 hover:text-orange-500 mb-2 inline-flex items-center gap-1 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Shipments
          </a>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {shipment.trackingCode}
          </h1>
        </div>
        <StatusBadge status={shipment.currentStatus} size="md" />
      </div>

      {/* Shipment Info Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Shipment Details</p>
            <p className="text-white font-mono font-bold text-sm mt-0.5">{shipment.trackingCode}</p>
          </div>
          {!isDelivered && (
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Est. Delivery</p>
              <p className="text-orange-400 text-xs font-semibold mt-0.5">
                {estimatedDelivery.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 mb-6">
            <div className="bg-slate-50 rounded-xl p-3.5">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Receiver</p>
              <p className="text-sm font-semibold text-slate-900 mt-1">{shipment.receiverName}</p>
              {shipment.receiverPhone && <p className="text-xs text-slate-500 mt-0.5">{shipment.receiverPhone}</p>}
            </div>
            <div className="bg-slate-50 rounded-xl p-3.5">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Sender</p>
              <p className="text-sm font-semibold text-slate-900 mt-1">{shipment.senderName || "—"}</p>
              {shipment.senderPhone && <p className="text-xs text-slate-500 mt-0.5">{shipment.senderPhone}</p>}
            </div>
            <div className="bg-slate-50 rounded-xl p-3.5">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Origin</p>
              <p className="text-sm font-semibold text-slate-900 mt-1">{shipment.origin}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3.5">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Destination</p>
              <p className="text-sm font-semibold text-slate-900 mt-1">{shipment.destination}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3.5">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Package</p>
              <p className="text-sm font-semibold text-slate-900 mt-1">{shipment.packageDesc || "—"}</p>
              {shipment.packageWeight && <p className="text-xs text-slate-500 mt-0.5">{shipment.packageWeight}</p>}
            </div>
            <div className="bg-slate-50 rounded-xl p-3.5">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Priority</p>
              <p className={`text-sm font-semibold mt-1 ${shipment.priority === "express" ? "text-orange-600" : "text-slate-900"}`}>
                {shipment.priority === "express" ? "Express" : "Standard"}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3.5">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Created</p>
              <p className="text-sm font-semibold text-slate-900 mt-1">
                {new Date(shipment.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <ProgressBar status={shipment.currentStatus} />
        </div>
      </div>

      {/* Payment Info */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className={`px-4 sm:px-6 py-3 ${shipment.deliveryLocked ? "bg-amber-50 border-b border-amber-200" : "bg-slate-50 border-b border-slate-200"}`}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment</p>
            {shipment.deliveryLocked && (
              <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                Delivery Locked
              </span>
            )}
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
            <div className="bg-slate-50 rounded-xl p-3.5">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Type</p>
              <p className="text-sm font-semibold text-slate-900 mt-1 uppercase">{shipment.paymentType}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3.5">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Status</p>
              <p className={`text-sm font-semibold mt-1 ${shipment.paymentStatus === "paid" ? "text-emerald-600" : shipment.paymentStatus === "failed" ? "text-red-500" : "text-amber-600"}`}>
                {shipment.paymentStatus === "paid" ? "Paid" : shipment.paymentStatus === "failed" ? "Failed" : "Pending"}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3.5">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Amount</p>
              <p className="text-sm font-semibold text-slate-900 mt-1">
                {shipment.amount > 0 ? `$${shipment.amount.toLocaleString()}` : "—"}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3.5">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Method</p>
              <p className="text-sm font-semibold text-slate-900 mt-1 capitalize">{shipment.paymentMethod}</p>
            </div>
          </div>

          {shipment.paymentType === "cod" && shipment.paymentStatus !== "paid" && (
            <div className="mt-5 flex items-center gap-3 flex-wrap">
              <button
                onClick={handleMarkPaid}
                disabled={paymentLoading}
                className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors text-xs font-semibold flex items-center gap-2"
              >
                {paymentLoading ? (
                  <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {paymentLoading ? "Processing..." : "Mark as Paid"}
              </button>
              <p className="text-[10px] text-slate-400">This will unlock delivery for this shipment</p>
            </div>
          )}
        </div>
      </div>

      {/* Route Visualization */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Route Progress</p>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 -mx-1 px-1">
          {shipment.route.map((stop: string, idx: number) => (
            <div key={idx} className="flex items-center">
              <div
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  idx <= shipment.currentStep
                    ? idx === shipment.currentStep
                      ? "bg-orange-500 text-white shadow-sm"
                      : "bg-slate-800 text-white"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {stop}
              </div>
              {idx < shipment.route.length - 1 && (
                <svg
                  className={`w-3.5 h-3.5 mx-0.5 flex-shrink-0 ${
                    idx < shipment.currentStep ? "text-slate-400" : "text-slate-200"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      {!isDelivered && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Actions</p>
          <div className="flex gap-3">
            {!isAtDestination && (
              <button
                onClick={handleNextStep}
                disabled={actionLoading}
                className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors text-xs font-semibold flex items-center gap-2"
              >
                {actionLoading ? (
                  <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                )}
                {actionLoading ? "Processing..." : "Next Step"}
              </button>
            )}
            <button
              onClick={handleDeliver}
              disabled={actionLoading}
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors text-xs font-semibold flex items-center gap-2"
            >
              {actionLoading ? (
                <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {actionLoading ? "Processing..." : "Mark Delivered"}
            </button>
          </div>
        </div>
      )}

      {isDelivered && (
        <div className="bg-emerald-600 rounded-2xl p-6 text-center">
          <svg className="w-14 h-14 text-white mx-auto mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-white font-bold text-sm">Shipment Delivered</p>
          <p className="text-emerald-100 text-xs mt-1">This shipment has been successfully delivered to the receiver</p>
        </div>
      )}

      {/* Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Tracking History</p>
        <Timeline updates={shipment.updates} />
      </div>

      {/* Manage */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Manage Shipment</p>
        <div className="flex flex-wrap gap-3">
          <a
            href={`/admin/shipments/${shipment.id}/edit`}
            className="px-5 py-2.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-xs font-semibold inline-flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            Edit Details
          </a>
          {!deleteConfirm ? (
            <button
              onClick={() => setDeleteConfirm(true)}
              className="px-5 py-2.5 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors text-xs font-semibold inline-flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              Delete Shipment
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-500 font-medium">Are you sure?</span>
              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors text-xs font-semibold"
              >
                {actionLoading ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                onClick={() => setDeleteConfirm(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
