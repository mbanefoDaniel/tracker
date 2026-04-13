"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

interface RouteInfo {
  origin: string;
  destination: string;
  stops: string[];
}

export default function CreateShipmentPage() {
  const router = useRouter();
  const [routes, setRoutes] = useState<RouteInfo[]>([]);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [packageDesc, setPackageDesc] = useState("");
  const [packageWeight, setPackageWeight] = useState("");
  const [priority, setPriority] = useState("standard");
  const [paymentType, setPaymentType] = useState("prepaid");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/routes")
      .then((res) => res.json())
      .then((data) => {
        setRoutes(data.routes);
        setPageLoading(false);
      })
      .catch(() => setPageLoading(false));
  }, []);

  const originCities = [...new Set(routes.map((r) => r.origin))].sort();

  const availableDestinations = origin
    ? routes.filter((r) => r.origin === origin).map((r) => r.destination)
    : [];

  const selectedRoute = routes.find(
    (r) => r.origin === origin && r.destination === destination
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination || !receiverName.trim()) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/shipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin,
          destination,
          receiverName: receiverName.trim(),
          receiverPhone: receiverPhone.trim(),
          senderName: senderName.trim(),
          senderPhone: senderPhone.trim(),
          packageDesc: packageDesc.trim(),
          packageWeight: packageWeight.trim(),
          priority,
          paymentType,
          amount: amount ? Number(amount) : 0,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        router.push(`/admin/shipments/${data.id}`);
      }
    } catch {
      setError("Failed to create shipment");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <Loading text="Loading routes..." />;
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create Shipment</h1>
        <p className="text-slate-500 text-xs mt-1 tracking-wide">Fill in the details below</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-7 space-y-5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Route Details</p>

          {/* Origin */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Origin City
            </label>
            <select
              value={origin}
              onChange={(e) => {
                setOrigin(e.target.value);
                setDestination("");
              }}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 text-sm bg-slate-50"
            >
              <option value="">Select origin city</option>
              {originCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Destination */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Destination City
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              disabled={!origin}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-slate-100 disabled:text-slate-400 text-slate-900 text-sm bg-slate-50"
            >
              <option value="">
                {origin ? "Select destination" : "Select origin first"}
              </option>
              {availableDestinations.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Route Preview */}
          {selectedRoute && (
            <div className="p-4 bg-slate-900 rounded-xl animate-fade-in-up">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                Route Preview
              </p>
              <div className="flex items-center gap-1.5 flex-wrap">
                {selectedRoute.stops.map((stop, idx) => (
                  <span key={idx} className="flex items-center">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                        idx === 0
                          ? "bg-orange-500 text-white"
                          : idx === selectedRoute.stops.length - 1
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-700 text-slate-300"
                      }`}
                    >
                      {stop}
                    </span>
                    {idx < selectedRoute.stops.length - 1 && (
                      <svg className="w-3.5 h-3.5 text-slate-600 mx-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    )}
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 mt-2.5">
                {selectedRoute.stops.length} stops · Estimated 2-4 days
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-7 space-y-5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sender Details</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Sender Name
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Enter sender's name"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 text-sm bg-slate-50 placeholder-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Sender Phone
              </label>
              <input
                type="tel"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                placeholder="e.g. 08012345678"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 text-sm bg-slate-50 placeholder-slate-400"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-7 space-y-5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Receiver Details</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Receiver Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                placeholder="Enter receiver's full name"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 text-sm bg-slate-50 placeholder-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Receiver Phone
              </label>
              <input
                type="tel"
                value={receiverPhone}
                onChange={(e) => setReceiverPhone(e.target.value)}
                placeholder="e.g. 08098765432"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 text-sm bg-slate-50 placeholder-slate-400"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-7 space-y-5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Package Details</p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Package Description
            </label>
            <input
              type="text"
              value={packageDesc}
              onChange={(e) => setPackageDesc(e.target.value)}
              placeholder="e.g. Electronics, Documents, Clothing"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 text-sm bg-slate-50 placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Package Weight
              </label>
              <input
                type="text"
                value={packageWeight}
                onChange={(e) => setPackageWeight(e.target.value)}
                placeholder="e.g. 2.5 kg"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 text-sm bg-slate-50 placeholder-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Delivery Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 text-sm bg-slate-50"
              >
                <option value="standard">Standard</option>
                <option value="express">Express</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-7 space-y-5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment Details</p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Payment Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentType("prepaid")}
                className={`px-4 py-3 rounded-xl border-2 text-xs font-semibold transition-all ${
                  paymentType === "prepaid"
                    ? "border-orange-500 bg-orange-50 text-orange-600"
                    : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300"
                }`}
              >
                <span className="block text-sm font-bold">Prepaid</span>
                <span className="block text-[10px] mt-0.5 opacity-70">Pay before delivery</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentType("cod")}
                className={`px-4 py-3 rounded-xl border-2 text-xs font-semibold transition-all ${
                  paymentType === "cod"
                    ? "border-orange-500 bg-orange-50 text-orange-600"
                    : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300"
                }`}
              >
                <span className="block text-sm font-bold">COD</span>
                <span className="block text-[10px] mt-0.5 opacity-70">Cash on Delivery</span>
              </button>
            </div>
          </div>

          {paymentType === "cod" && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-[10px] text-amber-700 font-medium flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                Delivery will be locked until payment is confirmed
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Amount ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 5000"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 text-sm bg-slate-50 placeholder-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 text-sm bg-slate-50"
              >
                <option value="cash">Cash</option>
                <option value="transfer">Bank Transfer</option>
                <option value="paystack">Paystack</option>
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

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="px-6 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-slate-50 transition-colors text-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors text-xs font-semibold flex items-center gap-2"
          >
            {loading && (
              <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {loading ? "Creating..." : "Create Shipment"}
          </button>
        </div>
      </form>
    </div>
  );
}
