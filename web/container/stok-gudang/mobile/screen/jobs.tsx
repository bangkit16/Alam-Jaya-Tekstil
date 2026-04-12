"use client";

import { useState, useRef } from "react";
import BoxMasuk from "./jobs-screen/BoxMasuk";
import DataBox from "./jobs-screen/DataBox";
import PermintaanResi from "./jobs-screen/PermintaanResi";
import MintaPotong from "./jobs-screen/MintaPotong";
import Tracking from "./jobs-screen/Tracking";

type tabType =
  | "box_masuk"
  | "data_box"
  | "permintaan_resi"
  | "minta_potong"
  | "tracking";

export default function Jobs({ setScreen }: any) {
  const [activeTab, setActiveTab] = useState<tabType>("box_masuk");
  const [search, setSearch] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -120, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 120, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 flex justify-center p-4">
      <div className="w-full max-w-sm h-[90vh] bg-white rounded-[40px] shadow-2xl p-4 flex flex-col relative">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-orange-400 to-amber-500 text-white rounded-2xl py-2 text-center text-sm font-medium mb-4 shadow">
          Jobs Gudang
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

        {/* TAB */}
        <div className="mb-2 bg-gray-100 p-1 rounded-xl text-xs overflow-hidden">
          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto no-scrollbar"
          >
            {[
              { label: "Box Masuk", value: "box_masuk" },
              { label: "Data Box", value: "data_box" },
              { label: "Permintaan Resi", value: "permintaan_resi" },
              { label: "Minta Potong", value: "minta_potong" },
              { label: "Tracking", value: "tracking" },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setActiveTab(item.value as tabType)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg transition ${
                  activeTab === item.value
                    ? "bg-white shadow text-gray-900 font-medium"
                    : "text-gray-500"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* PANAH SCROLL */}
        <div className="flex justify-between mb-3 px-2">
          <button
            onClick={scrollLeft}
            className="bg-white shadow px-3 py-1 rounded-lg text-xs active:scale-95"
          >
            ◀
          </button>

          <button
            onClick={scrollRight}
            className="bg-white shadow px-3 py-1 rounded-lg text-xs active:scale-95"
          >
            ▶
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-auto">
          {activeTab === "box_masuk" && <BoxMasuk search={search} />}
          {activeTab === "data_box" && <DataBox search={search} />}
          {activeTab === "permintaan_resi" && (
            <PermintaanResi search={search} />
          )}
          {activeTab === "minta_potong" && <MintaPotong search={search} />}
          {activeTab === "tracking" && <Tracking search={search} />}
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
