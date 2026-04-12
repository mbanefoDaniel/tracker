"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Loading from "@/components/Loading";

interface Shipment {
  id: string;
  trackingCode: string;
  receiverName: string;
  receiverPhone: string;
  senderName: string;
  senderPhone: string;
  packageDesc: string;
  packageWeight: string;
  priority: string;
}

export default function EditShipmentPage() {
  const params = useParams();
  const router = useRouter();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [packageDesc, setPackageDesc] = useState("");
  const [packageWeight, setPackageWeight] = useState("");
  const [priority, setPriority] = useState("standard");

  const fetchShipment = useCallback(async () => {
    try {
      const res = await fetch(`/api/shipments/${params.id}`);
      const data = await res.json();
      if (res.ok) {
        setShipment(data);
        setReceiverName(data.receiverName);
        setReceiverPhone(data.receiverPhone || "");
        setSenderName(data.senderName || "");
        setSenderPhone(data.senderPhone || "");
        setPackageDesc(data.packageDesc || "");
        setPackageWeight(data.packageWeight || "");
        setPriority(data.priority || "standard");
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchShipment();
  }, [fetchShipment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiverName.trim()) {
      setError("Receiver name is required");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch(`/api/shipments/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverName: receiverName.trim(),
          receiverPhone: receiverPhone.trim(),
          senderName: senderName.trim(),
          senderPhone: senderPhone.trim(),
          packageDesc: packageDesc.trim(),
          packageWeight: packageWeight.trim(),
          priority,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update");
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch {
      setError("Failed to update shipment");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading text="Loading shipment..." />;
  }

  if (!shipment) {
    return (
      <div className="text-center py-20 animate-fade-in-up">
        <p className="text-slate-500 font-medium mb-2">Shipment not found</p>
        <a href="/admin/shipments" className="text-orange-500 hover:text-orange-700 text-xs font-semibold">
          Back to shipments
        </a>
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 text-sm bg-slate-50 placeholder-slate-400";

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      <div className="mb-8">
        <a
          href={`/admin/shipments/${shipment.id}`}
          className="text-xs text-slate-400 hover:text-orange-500 mb-2 inline-flex items-center gap-1 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to {shipment.trackingCode}
        </a>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Edit Shipment</h1>
        <p className="text-slate-500 text-xs mt-1 tracking-wide font-mono">{shipment.trackingCode}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-7 space-y-5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sender Details</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Sender Name</label>
              <input type="text" value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="Sender name" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Sender Phone</label>
              <input type="tel" value={senderPhone} onChange={(e) => setSenderPhone(e.target.value)} placeholder="e.g. 08012345678" className={inputClass} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-7 space-y-5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Receiver Details</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Receiver Name <span className="text-red-400">*</span>
              </label>
              <input type="text" value={receiverName} onChange={(e) => setReceiverName(e.target.value)} placeholder="Receiver full name" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Receiver Phone</label>
              <input type="tel" value={receiverPhone} onChange={(e) => setReceiverPhone(e.target.value)} placeholder="e.g. 08098765432" className={inputClass} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-7 space-y-5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Package Details</p>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Package Description</label>
            <input type="text" value={packageDesc} onChange={(e) => setPackageDesc(e.target.value)} placeholder="e.g. Electronics, Documents" className={inputClass} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Package Weight</label>
              <input type="text" value={packageWeight} onChange={(e) => setPackageWeight(e.target.value)} placeholder="e.g. 2.5 kg" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} className={inputClass}>
                <option value="standard">Standard</option>
                <option value="express">Express</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-600 font-medium flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-600 font-medium flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Shipment updated successfully
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push(`/admin/shipments/${shipment.id}`)}
            className="px-6 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-slate-50 transition-colors text-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors text-xs font-semibold flex items-center gap-2"
          >
            {saving && (
              <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
