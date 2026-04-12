import { headers } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const authCookie = headersList.get("cookie") || "";
  const isAuth = authCookie.includes("admin_auth=true");

  if (
    !isAuth &&
    !headersList.get("x-admin-auth")
  ) {
    // We'll handle auth on the client side
  }

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3.5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
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
              <span className="text-[10px] bg-slate-800 text-orange-400 px-2.5 py-1 rounded-md font-bold uppercase tracking-widest border border-slate-700">
                Admin
              </span>
            </div>
            <nav className="flex items-center gap-1 flex-wrap w-full sm:w-auto">
              <a
                href="/admin/dashboard"
                className="text-xs font-medium text-slate-400 hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-slate-800"
              >
                Dashboard
              </a>
              <a
                href="/admin/shipments"
                className="text-xs font-medium text-slate-400 hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-slate-800"
              >
                Shipments
              </a>
              <a
                href="/admin/activity"
                className="text-xs font-medium text-slate-400 hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-slate-800"
              >
                Activity
              </a>
              <a
                href="/admin/settings"
                className="text-xs font-medium text-slate-400 hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-slate-800"
              >
                Settings
              </a>
              <div className="hidden sm:block w-px h-5 bg-slate-700 mx-1" />
              <a
                href="/admin/create"
                className="text-xs font-semibold px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                + New
              </a>
              <div className="hidden sm:block w-px h-5 bg-slate-700 mx-1" />
              <a
                href="/track"
                className="text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors px-3 py-2 rounded-md hover:bg-slate-800"
              >
                Tracker
              </a>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">{children}</main>
    </div>
  );
}
