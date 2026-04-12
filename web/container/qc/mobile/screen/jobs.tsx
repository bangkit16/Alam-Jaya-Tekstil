"use client";

import Menunggu from "./jobs-screen/Menunggu";
import Proses from "./jobs-screen/Proses";
import MasukBox from "./jobs-screen/MasukBox";
import Selesai from "./jobs-screen/Selesai";

import { useState } from "react";

type statusType = "menunggu" | "proses" | "masuk_box" | "selesai";

export default function Jobs({ setScreen, orders = [] }: any) {
  const [filterStatus, setFilterStatus] = useState<statusType>("menunggu");
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 flex justify-center items-center p-4">
      <div className="w-full max-w-sm h-[90vh] bg-white rounded-[40px] shadow-2xl p-4 flex flex-col relative">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-orange-400 to-amber-500 text-white rounded-2xl py-2 text-center text-sm font-medium mb-4 shadow">
          QC Jobs
        </div>

        {/* SEARCH */}
        <div className="mb-3">
          <input
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-100 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* FILTER */}
        <div className="grid grid-cols-4 gap-2 mb-4 bg-gray-100 p-1 rounded-xl text-xs">
          {[
            { label: "Menunggu", value: "menunggu" },
            { label: "Proses", value: "proses" },
            { label: "Masuk Box", value: "masuk_box" },
            { label: "Selesai", value: "selesai" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setFilterStatus(item.value as statusType)}
              className={`py-1.5 rounded-lg transition ${
                filterStatus === item.value
                  ? "bg-white shadow text-gray-900 font-medium"
                  : "text-gray-500"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* ================= CONTENT ================= */}
        <div className="flex-1 overflow-auto">
          {filterStatus === "menunggu" && (
            <Menunggu orders={orders} search={search} />
          )}
          {filterStatus === "proses" && (
            <Proses orders={orders} search={search} />
          )}
          {filterStatus === "masuk_box" && (
            <MasukBox orders={orders} search={search} />
          )}
          {filterStatus === "selesai" && (
            <Selesai orders={orders} search={search} />
          )}
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
