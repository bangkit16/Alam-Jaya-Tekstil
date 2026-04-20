"use client";

import { useState } from "react";
import {
  Package,
  ClipboardList,
  Archive,
  CheckCircle,
  LogOut,
} from "lucide-react";

import Menunggu from "./screens/Menunggu";
import Proses from "./screens/Proses";
import MasukBox from "./screens/MasukBox";
import Selesai from "./screens/Selesai";

// 🔥 API (buat stats aja)
import { useGetQCMenunggu } from "@/services/qc/useGetQCMenunggu";
import { useGetQCProses } from "@/services/qc/useGetQCProses";
import { useGetQCMasukBox } from "@/services/qc/useGetQCBoxMasuk";
import { useGetQCSelesai } from "@/services/qc/useGetQCSelesai";

type TabType = "menunggu" | "proses" | "masuk_box" | "selesai";

const menuList = [
  { key: "menunggu", label: "Menunggu", icon: Package },
  { key: "proses", label: "Proses", icon: ClipboardList },
  { key: "masuk_box", label: "Masuk Box", icon: Archive },
  { key: "selesai", label: "Selesai", icon: CheckCircle },
];

export default function QCWeb({ handleLogout }: any) {
  const [activeTab, setActiveTab] = useState<TabType>("menunggu");

  // 🔥 COUNT
  const { data: menunggu } = useGetQCMenunggu();
  const { data: proses } = useGetQCProses();
  const { data: box } = useGetQCMasukBox();
  const { data: selesai } = useGetQCSelesai();

  const count = {
    menunggu: menunggu?.length || 0,
    proses: proses?.length || 0,
    masuk_box: box?.length || 0,
    selesai: selesai?.length || 0,
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-orange-50">
      {/* SIDEBAR */}
      <div className="w-64 bg-white/80 backdrop-blur-xl border-r p-5 hidden md:flex flex-col shadow-lg">
        <div className="mb-8">
          <h1 className="text-lg font-semibold">QC Panel</h1>
          <p className="text-xs text-gray-400">Quality Control</p>
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

        {/* 🔥 FIX LOGOUT STICK */}
        <div className="mt-auto pt-6 border-t">
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
        <div className="grid grid-cols-4 gap-4">
          <Stat title="Menunggu" value={count.menunggu} />
          <Stat title="Proses" value={count.proses} />
          <Stat title="Masuk Box" value={count.masuk_box} />
          <Stat title="Selesai" value={count.selesai} />
        </div>

        {/* SCREEN */}
        {activeTab === "menunggu" && <Menunggu />}
        {activeTab === "proses" && <Proses />}
        {activeTab === "masuk_box" && <MasukBox />}
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
        : title === "Masuk Box"
          ? "text-purple-500"
          : "text-green-500";

  return (
    <div className="bg-white/70 p-4 rounded-2xl shadow text-center">
      <p className="text-xs text-gray-500">{title}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
