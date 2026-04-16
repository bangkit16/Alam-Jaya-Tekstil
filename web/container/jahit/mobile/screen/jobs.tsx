"use client";

import { useState } from "react";

import Menunggu from "./jobs-screen/Menunggu";
import Proses from "./jobs-screen/Proses";
import Selesai from "./jobs-screen/Selesai";

type StatusType = "menunggu" | "proses" | "selesai";

export default function JobsJahit({ setScreen }: any) {
  const [filterStatus, setFilterStatus] = useState<StatusType>("menunggu");
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center items-center p-4">
      <div className="w-full max-w-sm h-[90vh] bg-white rounded-[40px] shadow-xl p-4 flex flex-col">
        {/* HEADER */}
        <div className="bg-orange-400 text-white rounded-2xl py-2 text-center text-sm mb-4">
          View Jobs Jahit
        </div>

        {/* SEARCH */}
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-100 px-3 py-2 rounded-xl text-sm mb-3"
        />

        {/* FILTER */}
        <div className="grid grid-cols-3 gap-2 mb-4 bg-gray-100 p-1 rounded-xl text-xs">
          {["menunggu", "proses", "selesai"].map((item) => (
            <button
              key={item}
              onClick={() => setFilterStatus(item as StatusType)}
              className={`py-1 ${
                filterStatus === item ? "bg-white shadow" : "text-gray-400"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-auto">
          {filterStatus === "menunggu" && <Menunggu />}
          {filterStatus === "proses" && <Proses />}
          {filterStatus === "selesai" && <Selesai />}
        </div>

        {/* BACK */}
        <button
          onClick={() => setScreen("home")}
          className="mt-3 bg-gray-100 py-2 rounded-xl text-xs"
        >
          Kembali
        </button>
      </div>
    </div>
  );
}
