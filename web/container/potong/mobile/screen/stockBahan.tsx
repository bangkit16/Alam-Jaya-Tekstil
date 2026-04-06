"use client";

import { useState } from "react";

export default function StockBahan({ setScreen }: any) {
  const [selectedBahan, setSelectedBahan] = useState("tinta");

  const data = [
    { kode: "PRT-108", warna: "putih", value: 10 },
    { kode: "PRT-111", warna: "hijau", value: 9 },
    { kode: "PRT-119", warna: "kuning", value: 5 },
  ];

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center items-center p-4">
      {/* PHONE */}
      <div className="w-full max-w-sm h-[90vh] bg-white rounded-[40px] shadow-xl p-4 flex flex-col">
        {/* HEADER */}
        <div className="border border-gray-300 rounded-2xl py-2 text-center text-sm font-medium mb-4 text-gray-700">
          Stock Bahan
        </div>

        {/* TAB */}
        <div className="flex border border-gray-300 rounded-xl overflow-hidden mb-4 text-sm">
          {["tinta", "kain", "pet"].map((item) => (
            <button
              key={item}
              onClick={() => setSelectedBahan(item)}
              className={`flex-1 py-2 ${
                selectedBahan === item
                  ? "bg-purple-500 text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        {selectedBahan === "tinta" && (
          <div className="flex flex-col gap-4">
            {/* PIE + LEGEND */}
            <div className="flex items-center gap-4">
              {/* PIE (fake css) */}
              <div className="w-20 h-20 rounded-full bg-[conic-gradient(yellow_0%_20%,green_20%_55%,white_55%_100%)] border border-gray-300" />

              {/* LEGEND */}
              <div className="text-xs">
                <p className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-white border border-gray-300 inline-block" />
                  Putih : 10
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 inline-block" />
                  Hijau : 9
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-yellow-400 inline-block" />
                  Kuning : 5
                </p>
              </div>
            </div>

            {/* LIST */}
            <div className="flex flex-col gap-3 text-sm">
              {data.map((item) => (
                <div key={item.kode} className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 border border-gray-300 ${
                      item.warna === "kuning"
                        ? "bg-yellow-400"
                        : item.warna === "hijau"
                          ? "bg-green-500"
                          : "bg-white"
                    }`}
                  />
                  <div>
                    <p>{item.kode}</p>
                    <p className="text-xs text-gray-400">{item.warna}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BACK */}
        <div className="mt-auto">
          <button
            onClick={() => setScreen("stock")}
            className="text-xs text-gray-500"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}
