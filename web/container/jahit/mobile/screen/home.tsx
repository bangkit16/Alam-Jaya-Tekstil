"use client";

import { Package, Briefcase, Bell } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export default function Home({ setScreen, handleLogout }: any) {
  const { session } = useAuthStore();

  const menus = [
    {
      label: "Stock",
      icon: <Package size={26} />,
      color: "text-orange-500",
      onClick: () => alert("Stock coming soon"),
    },
    {
      label: "Jobs",
      icon: <Briefcase size={26} />,
      color: "text-amber-500",
      onClick: () => setScreen("jobs"),
    },
    {
      label: "Report",
      icon: <Bell size={26} />,
      color: "text-red-500",
      onClick: () => alert("Coming soon 🚀"),
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-200 via-gray-300 to-gray-400 flex justify-center items-center p-4">
      {/* PHONE FRAME */}
      <div className="w-full max-w-sm h-[90vh] bg-white rounded-[40px] shadow-2xl p-4 flex flex-col">
        {/* HEADER (SAMA DENGAN POTONG) */}
        {/* HEADER (SELARAS LOGIN) */}
        <div className="bg-linear-to-r from-orange-400 to-amber-500 text-white rounded-2xl p-4 mb-4 shadow-md">
          <p className="text-sm opacity-90">Welcome Back 👋</p>
          <p className="font-bold text-lg">{session?.session.user.name}</p>
          <p className="text-xs opacity-80">{session?.session.user.role}</p>
        </div>

        {/* PROFILE CARD */}
        <div className="bg-white border border-gray-200 rounded-2xl p-3 flex gap-3 items-center mb-4 shadow-sm">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-400">
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

            <p className="text-gray-500 truncate">
              No Handphone :
              <span className="text-gray-900 font-medium ml-1">
                {session?.session.user.email}
              </span>
            </p>
          </div>
        </div>

        {/* MENU */}
        <div className="flex justify-between mb-6 px-2">
          {menus.map((item, i) => (
            <button
              key={i}
              onClick={item.onClick}
              className="flex flex-col items-center group"
            >
              <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm group-hover:scale-110 transition duration-200">
                <div className={item.color}>{item.icon}</div>
              </div>
              <span className="text-xs mt-1 text-gray-600 group-hover:text-black">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="flex-1 bg-gray-50 rounded-2xl p-3 shadow-inner">
          <p className="text-sm text-gray-500">Aktivitas terbaru</p>

          <div className="mt-3 space-y-2 text-xs">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              ✂️ Job baru diterima
            </div>
            <div className="bg-white p-2 rounded-lg shadow-sm">
              ✅ Job selesai dikirim
            </div>
          </div>
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="mt-4 text-sm text-red-500 font-medium hover:opacity-70"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
