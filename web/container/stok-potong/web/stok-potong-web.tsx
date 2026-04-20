"use client";

import { useState } from "react";
import { ClipboardList, Package, CheckCircle, LogOut } from "lucide-react";

import Menunggu from "./screens/Menunggu";
import Proses from "./screens/Proses";
import Stok from "./screens/Stok";

// 🔥 ambil data untuk summary
import { useGetPermintaanStokPotong } from "@/services/stok-potong/useGetPermintaan";
import { useGetProses } from "@/services/stok-potong/useGetProses";
import { useGetStock } from "@/services/stok-potong/useGetStock";

type TabType = "menunggu" | "proses" | "stok";

const menuList = [
  { key: "menunggu", label: "Menunggu", icon: ClipboardList },
  { key: "proses", label: "Proses", icon: Package },
  { key: "stok", label: "Stok", icon: CheckCircle },
];

export default function StokPotongWeb({ handleLogout }: any) {
  const [activeTab, setActiveTab] = useState<TabType>("menunggu");

  // 🔥 summary data
  const { data: menungguData } = useGetPermintaanStokPotong();
  const { data: prosesData } = useGetProses();
  const { data: stokData } = useGetStock();

  const countMenunggu = menungguData?.data.length || 0;
  const countProses = prosesData?.data.length || 0;
  const countStok = stokData?.data.length || 0;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-orange-50">
      {/* SIDEBAR */}
      <div className="w-64 bg-white/80 backdrop-blur-xl border-r p-5 hidden md:flex flex-col shadow-lg">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-lg font-semibold">Stok Potong</h1>
          <p className="text-xs text-gray-400">Dashboard produksi</p>
        </div>

        {/* MENU */}
        <div className="flex flex-col gap-2">
          {menuList.map((menu) => {
            const Icon = menu.icon;
            return (
              <button
                key={menu.key}
                onClick={() => setActiveTab(menu.key as TabType)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition
                  ${
                    activeTab === menu.key
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <Icon size={18} />
                {menu.label}
              </button>
            );
          })}
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-2 text-red-500 hover:text-red-600 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6 space-y-6">
        {/* 🔥 SUMMARY CARDS */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/70 p-4 rounded-2xl shadow text-center">
            <p className="text-xs text-gray-500">Menunggu</p>
            <p className="text-2xl font-bold text-yellow-500">
              {countMenunggu}
            </p>
          </div>

          <div className="bg-white/70 p-4 rounded-2xl shadow text-center">
            <p className="text-xs text-gray-500">Proses</p>
            <p className="text-2xl font-bold text-blue-500">{countProses}</p>
          </div>

          <div className="bg-white/70 p-4 rounded-2xl shadow text-center">
            <p className="text-xs text-gray-500">Selesai</p>
            <p className="text-2xl font-bold text-green-500">{countStok}</p>
          </div>
        </div>

        {/* 🔥 CONTENT (TIDAK NYATU DENGAN CARD ATAS) */}
        <div>
          {activeTab === "menunggu" && <Menunggu />}
          {activeTab === "proses" && <Proses />}
          {activeTab === "stok" && <Stok />}
        </div>
      </div>
    </div>
  );
}
