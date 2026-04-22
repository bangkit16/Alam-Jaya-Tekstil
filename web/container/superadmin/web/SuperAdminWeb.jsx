"use client";

import UserManagement from "./screens/UserManagement";

export default function SuperAdminWeb({ handleLogout }) {
  return (
    <div className="flex min-h-screen max-h-screen overflow-hidden bg-gradient-to-br from-gray-100 to-orange-50">
      {/* SIDEBAR */}
      <div className="w-64 bg-white/70 backdrop-blur-xl border-r border-white/40 p-5 hidden md:flex flex-col shadow-lg overflow-y-auto">
        <div>
          <h1 className="text-lg font-semibold mb-6 text-gray-800">
            Super Admin
          </h1>

          <div className="space-y-2">
            <button className="w-full text-left px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg">
              User
            </button>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-auto bg-red-50 text-red-500 text-xs py-2 rounded-xl font-medium hover:bg-red-100 transition"
        >
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6 flex flex-col">
        <UserManagement />
      </div>
    </div>
  );
}
