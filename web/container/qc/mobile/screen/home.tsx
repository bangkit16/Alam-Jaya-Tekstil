"use client";

import { Package, Briefcase, Bell } from "lucide-react";

export default function Home({ setScreen, handleLogout }: any) {
  return (
    <div className="min-h-screen bg-gray-200 flex justify-center items-center p-4">
      <div className="w-full max-w-sm h-[90vh] bg-white rounded-[40px] shadow-xl p-4 flex flex-col">
        {/* HEADER */}
        <div className="border border-gray-300 rounded-2xl p-3 mb-4">
          <p className="text-sm font-semibold">QC USER</p>
          <p className="text-xs text-gray-400">Divisi QC</p>
        </div>

        {/* MENU */}
        <div className="flex justify-around mb-6">
          <button className="flex flex-col items-center">
            <Package size={28} className="text-orange-500" />
            <span className="text-xs mt-1">Stock</span>
          </button>

          <button
            onClick={() => setScreen("jobs")}
            className="flex flex-col items-center"
          >
            <Briefcase size={28} className="text-purple-500" />
            <span className="text-xs mt-1">QC Jobs</span>
          </button>

          <button className="flex flex-col items-center">
            <Bell size={28} className="text-red-500" />
            <span className="text-xs mt-1">Report</span>
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 border rounded-2xl flex items-center justify-center text-gray-400 text-sm">
          Dashboard QC
        </div>

        {/* LOGOUT */}
        <button onClick={handleLogout} className="mt-4 text-xs text-red-500">
          Logout
        </button>
      </div>
    </div>
  );
}
