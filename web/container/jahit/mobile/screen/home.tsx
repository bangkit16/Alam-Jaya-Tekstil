"use client";

import { Package, Briefcase, Bell } from "lucide-react";

export default function Home({ setScreen, handleLogout }: any) {
  return (
    <div className="min-h-screen bg-gray-200 flex justify-center items-center p-4">
      {/* PHONE FRAME */}
      <div className="w-full max-w-sm h-[90vh] bg-white rounded-[40px] shadow-xl p-4 flex flex-col">
        {/* HEADER PROFILE */}
        <div className="border border-gray-300 rounded-2xl p-3 flex gap-3 items-center mb-4">
          {/* FOTO */}
          <div className="w-16 h-16 border border-gray-300 rounded-md flex items-center justify-center text-xs text-gray-400">
            FOTO
          </div>

          {/* INFO */}
          <div className="text-xs">
            <p className="font-semibold text-sm text-gray-900">ADIT NDONG</p>
            <p className="text-gray-500">Divisi Jahit</p>
            <p className="text-gray-400 text-[10px]">00189021</p>
          </div>
        </div>

        {/* MENU */}
        <div className="flex justify-around mb-6">
          {/* STOCK */}
          <button className="flex flex-col items-center">
            <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
              <Package size={28} className="text-orange-500" />
            </div>
            <span className="text-xs mt-1 text-gray-600">Stock</span>
          </button>

          {/* JOBS */}
          <button
            onClick={() => setScreen("jobs")}
            className="flex flex-col items-center"
          >
            <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
              <Briefcase size={28} className="text-brown-500" />
            </div>
            <span className="text-xs mt-1 text-gray-600">Jobs</span>
          </button>

          {/* REPORT */}
          <button className="flex flex-col items-center">
            <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
              <Bell size={28} className="text-red-500" />
            </div>
            <span className="text-xs mt-1 text-gray-600">Report</span>
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 border border-gray-200 rounded-2xl"></div>

        {/* LOGOUT */}
        <button onClick={handleLogout} className="mt-4 text-xs text-red-500">
          Logout
        </button>
      </div>
    </div>
  );
}
