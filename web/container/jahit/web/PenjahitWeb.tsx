"use client";

import { useState } from "react";
import { ClipboardList, Package, CheckCircle, LogOut } from "lucide-react";

import Menunggu from "./screens/Menunggu";
import Proses from "./screens/Proses";
import Selesai from "./screens/Selesai";

// API COUNT
import { useGetPenjahitMenunggu } from "@/services/jahit/useGetPenjahitMenunggu";
import { useGetPenjahitProses } from "@/services/jahit/useGetPenjahitProses";
import { useGetPenjahitSelesai } from "@/services/jahit/useGetPenjahitSelesai";

type TabType = "menunggu" | "proses" | "selesai";

const menuList = [
  { key: "menunggu", label: "Menunggu", icon: ClipboardList },
  { key: "proses", label: "Proses", icon: Package },
  { key: "selesai", label: "Selesai", icon: CheckCircle },
];

export default function PenjahitWeb({ handleLogout }: any) {
  const [activeTab, setActiveTab] = useState<TabType>("menunggu");

  // 🔥 COUNT
  const { data: menunggu } = useGetPenjahitMenunggu();
  const { data: proses } = useGetPenjahitProses();
  const { data: selesai } = useGetPenjahitSelesai();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-orange-50">
      {/* SIDEBAR */}
      <div className="w-64 bg-white/80 backdrop-blur-xl border-r p-5 hidden md:flex flex-col shadow-lg">
        <div className="mb-8">
          <h1 className="text-lg font-semibold">Penjahit Panel</h1>
          <p className="text-xs text-gray-400">Produksi jahit</p>
        </div>

        <div className="flex flex-col gap-2">
          {menuList.map((menu) => {
            const Icon = menu.icon;
            return (
              <button
                key={menu.key}
                onClick={() => setActiveTab(menu.key as TabType)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm
                ${
                  activeTab === menu.key
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={18} />
                {menu.label}
              </button>
            );
          })}
        </div>

        {/* LOGOUT FIX */}
        <div className="sticky bottom-0 pt-6 mt-auto bg-white/80">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-red-500"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6 space-y-6">
        {/* STATS */}
        <div className="grid grid-cols-3 gap-4">
          <Stat title="Menunggu" value={menunggu?.data.length} />
          <Stat title="Proses" value={proses?.data.length} />
          <Stat title="Selesai" value={selesai?.data.length} />
        </div>

        {/* SCREEN */}
        {activeTab === "menunggu" && <Menunggu />}
        {activeTab === "proses" && <Proses />}
        {activeTab === "selesai" && <Selesai />}
      </div>
    </div>
  );
}

function Stat({ title, value }: any) {
  const color =
    title === "Menunggu"
      ? "text-yellow-500"
      : title === "Proses"
        ? "text-blue-500"
        : "text-green-500";

  return (
    <div className="bg-white/70 p-4 rounded-2xl shadow text-center">
      <p className="text-xs text-gray-500">{title}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
