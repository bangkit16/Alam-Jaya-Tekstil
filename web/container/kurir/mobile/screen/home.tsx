"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { Package, Briefcase, Bell } from "lucide-react";

export default function Home({ setScreen, handleLogout }: any) {
  const { session } = useAuthStore();
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-200 via-gray-300 to-gray-400 flex justify-center items-center p-4">
      {/* PHONE FRAME */}
      <div className="w-full max-w-sm h-[90vh] bg-white rounded-[40px] shadow-2xl p-4 flex flex-col">
        {/* HEADER */}
        <div className="bg-linear-to-r from-orange-400 to-amber-500 text-white rounded-2xl p-4 mb-4 shadow-md">
          <p className="text-sm opacity-90">Welcome Back 👋</p>
        </div>

        {/* PROFILE */}
        <div className="bg-gray-50 rounded-2xl p-3 flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-400 shadow-sm">
            IMG
          </div>

          <div className="text-xs leading-relaxed">
            <p className="text-gray-500">
              Nama :
              <span className="text-gray-900 font-medium ml-1">
                {session?.session.user.name}
              </span>
            </p>

            <p className="text-gray-500">
              Divisi :
              <span className="text-gray-900 font-medium ml-1">
                {session?.session.user.role}
              </span>
            </p>

            <p className="text-gray-500">
              No Handphone :
              <span className="text-gray-900 font-medium ml-1">
                {session?.session.user.noHandphone}
              </span>
            </p>
          </div>
        </div>

        {/* MENU */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            {
              label: "Stock",
              icon: <Package size={24} />,
              color: "text-orange-500",
            },
            {
              label: "Jobs",
              icon: <Briefcase size={24} />,
              color: "text-amber-500",
              onClick: () => setScreen("jobs"),
            },
            {
              label: "Riwayat",
              icon: <Bell size={24} />,
              color: "text-red-500",
              onClick: () => setScreen("history"),
            },
          ].map((item, i) => (
            <button
              key={i}
              onClick={item.onClick}
              className="flex flex-col items-center justify-center bg-gray-50 rounded-xl py-3 shadow-sm active:scale-95 transition"
            >
              <div className={item.color}>{item.icon}</div>
              <span className="text-[11px] mt-1 text-gray-600">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="flex-1 bg-gray-50 rounded-2xl p-3 flex items-center justify-center text-gray-400 text-sm">
          Dashboard Kurir
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="mt-3 text-xs text-red-500 font-medium hover:opacity-70"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
