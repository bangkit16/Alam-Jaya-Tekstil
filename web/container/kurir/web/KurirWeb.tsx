"use client";

import { useState } from "react";
import { ClipboardList, Truck, CheckCircle, LogOut } from "lucide-react";

import Menunggu from "./screens/Menunggu";
import Proses from "./screens/Proses";
import Selesai from "./screens/Selesai";

// summary
import { useGetKurirMenunggu } from "@/services/kurir/useGetKurirMenunggu";
import { useGetKurirProses } from "@/services/kurir/useGetKurirProses";
import { useGetKurirSelesai } from "@/services/kurir/useGetKurirSelesai";

type TabType = "menunggu" | "proses" | "selesai";

const menuList = [
  { key: "menunggu", label: "Menunggu", icon: ClipboardList },
  { key: "proses", label: "Proses", icon: Truck },
  { key: "selesai", label: "Selesai", icon: CheckCircle },
];

export default function KurirWeb({ handleLogout }: any) {
  const [activeTab, setActiveTab] = useState<TabType>("menunggu");

  // summary
  const { data: menunggu } = useGetKurirMenunggu();
  const { data: proses } = useGetKurirProses();
  const { data: selesai } = useGetKurirSelesai();

  const countMenunggu = menunggu?.length || 0;
  const countProses = proses?.length || 0;
  const countSelesai = selesai?.data.length || 0;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-orange-50">
      {/* SIDEBAR */}
      <div className="w-64 bg-white/80 backdrop-blur-xl border-r p-5 hidden md:flex flex-col shadow-lg">
        <div className="mb-8">
          <h1 className="text-lg font-semibold">Kurir Panel</h1>
          <p className="text-xs text-gray-400">Pengiriman barang</p>
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

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-2 text-red-500"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6 space-y-6">
        {/* SUMMARY */}
        <div className="grid grid-cols-3 gap-4">
          <Card title="Menunggu" count={countMenunggu} />
          <Card title="Proses" count={countProses} />
          <Card title="Selesai" count={countSelesai} />
        </div>

        {/* SCREEN */}
        <div>
          {activeTab === "menunggu" && <Menunggu />}
          {activeTab === "proses" && <Proses />}
          {activeTab === "selesai" && <Selesai />}
        </div>
      </div>
    </div>
  );
}

function Card({ title, count }: any) {
  const color =
    title === "Menunggu"
      ? "text-yellow-500"
      : title === "Proses"
        ? "text-blue-500"
        : "text-green-500";

  return (
    <div className="bg-white/70 p-4 rounded-2xl shadow text-center">
      <p className="text-xs text-gray-500">{title}</p>
      <p className={`text-2xl font-bold ${color}`}>{count}</p>
    </div>
  );
}
