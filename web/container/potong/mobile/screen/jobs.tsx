"use client";

import Menunggu from "./jobs-screen/Menunggu";
import Proses from "./jobs-screen/Proses";

import { useState } from "react";
import Selesai from "./jobs-screen/Selesai";

type statusType = "menunggu" | "proses" | "selesai";

export default function Jobs({ setScreen }: any) {
  const [filterStatus, setFilterStatus] = useState<statusType>("menunggu");
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 flex justify-center items-center p-4">
      <div className="w-full max-w-sm h-[90vh] bg-white rounded-[40px] shadow-2xl p-4 flex flex-col relative">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-orange-400 to-amber-500 text-white rounded-2xl py-2 text-center text-sm font-medium mb-4 shadow">
          View Jobs
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
        <div className="grid grid-cols-3 gap-2 mb-4 bg-gray-100 p-1 rounded-xl text-xs">
          {["menunggu", "proses", "selesai"].map((item) => (
            <button
              key={item}
              onClick={() => {
                setFilterStatus(item as statusType);
              }}
              className={`py-1.5 rounded-lg transition ${
                filterStatus === item
                  ? "bg-white shadow text-gray-900 font-medium"
                  : "text-gray-500"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* ================= CONTENT ================= */}
        <div className="flex-1 overflow-auto">
          {filterStatus === "menunggu" && <Menunggu />}
          {filterStatus === "proses" && <Proses />}
          {filterStatus === "selesai" && <Selesai />}
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
