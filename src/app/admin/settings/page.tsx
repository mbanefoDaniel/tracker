"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "nefotrack_settings";

interface Settings {
  companyName: string;
  companyPhone: string;
  companyEmail: string;
  companyAddress: string;
}

const defaults: Settings = {
  companyName: "NEFOTrack Logistics",
  companyPhone: "",
  companyEmail: "",
  companyAddress: "",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaults);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSettings({ ...defaults, ...JSON.parse(stored) });
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputClass =
    "w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 text-sm bg-slate-50 placeholder-slate-400";

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 text-xs mt-1 tracking-wide">Company information and preferences</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-7 space-y-5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Company Information</p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Company Name</label>
            <input
              type="text"
              value={settings.companyName}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              placeholder="Your company name"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone</label>
              <input
                type="tel"
                value={settings.companyPhone}
                onChange={(e) => setSettings({ ...settings, companyPhone: e.target.value })}
                placeholder="e.g. +234 801 234 5678"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                value={settings.companyEmail}
                onChange={(e) => setSettings({ ...settings, companyEmail: e.target.value })}
                placeholder="e.g. info@nefotrack.com"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Address</label>
            <input
              type="text"
              value={settings.companyAddress}
              onChange={(e) => setSettings({ ...settings, companyAddress: e.target.value })}
              placeholder="Company address"
              className={inputClass}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-7 space-y-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Info</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-3.5">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Version</p>
              <p className="text-sm font-semibold text-slate-900 mt-1">1.0.0</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3.5">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Environment</p>
              <p className="text-sm font-semibold text-slate-900 mt-1">Development</p>
            </div>
          </div>
        </div>

        {saved && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-600 font-medium flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Settings saved successfully
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-xs font-semibold"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
