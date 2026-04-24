"use client";

import { useState } from "react";

import BoxMasuk from "./jobs-screen/BoxMasuk";
import DataBox from "./jobs-screen/DataBox";
import Permintaan from "./jobs-screen/Permintaan";
import ProsesPesanan from "./jobs-screen/ProsesPesanan";
import RiwayatPesanan from "./jobs-screen/RiwayatPesanan";

type TabType =
  | "boxMasuk"
  | "dataBox"
  | "permintaan"
  | "prosesPesanan"
  | "riwayatPesanan";

export default function Jobs({ setScreen }: any) {
  const [tab, setTab] = useState<TabType>("boxMasuk");
  const [search, setSearch] = useState("");

  const tabs = [
    { key: "boxMasuk", label: "Box Masuk" },
    { key: "dataBox", label: "Data Box" },
    { key: "permintaan", label: "Permintaan" },
    { key: "prosesPesanan", label: "Proses Pesanan" },
    { key: "riwayatPesanan", label: "Riwayat Pesanan" },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-200 via-gray-300 to-gray-400 flex justify-center items-center p-4">
      <div className="w-full max-w-sm h-[90vh] bg-white rounded-[40px] shadow-2xl p-4 flex flex-col relative">
        {/* HEADER */}
        <div className="bg-linear-to-r from-orange-400 to-amber-500 text-white rounded-2xl py-2 text-center text-sm font-medium mb-4 shadow">
          View Jobs
        </div>

        {/* SEARCH */}
        <div className="mb-3">
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-100 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* 🔥 TAB SCROLLABLE (FIX UTAMA) */}
        <div className="mb-4">
          <div className="overflow-x-auto">
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl text-[10px] min-w-max">
              {tabs.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setTab(item.key as TabType)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                    tab === item.key
                      ? "bg-white shadow text-gray-900 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-auto">
          {tab === "boxMasuk" && <BoxMasuk />}
          {tab === "dataBox" && <DataBox />}
          {tab === "permintaan" && <Permintaan />}
          {tab === "prosesPesanan" && <ProsesPesanan />}
          {tab === "riwayatPesanan" && <RiwayatPesanan />}
        </div>

        {/* BACK */}
        <div className="mt-3">
          <button
            onClick={() => setScreen("home")}
            className="w-full bg-gray-100 text-gray-700 text-xs py-2 rounded-xl font-medium hover:bg-gray-200 active:scale-95 transition"
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
