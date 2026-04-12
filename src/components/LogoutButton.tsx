"use client";

export default function LogoutButton() {
  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <button
      onClick={handleLogout}
      className="text-xs font-medium text-slate-500 hover:text-red-400 transition-colors px-3 py-2 rounded-md hover:bg-slate-800"
    >
      Logout
    </button>
  );
}
