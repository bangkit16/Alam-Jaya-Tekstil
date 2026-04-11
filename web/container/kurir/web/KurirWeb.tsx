"use client";

import { useState } from "react";
import { Truck, CheckCircle } from "lucide-react";

type TabType = "menunggu" | "proses" | "selesai";

export default function KurirWeb({ handleLogout }: any) {
  const [activeTab, setActiveTab] = useState<TabType>("menunggu");

  const countMenunggu = 3;
  const countProses = 2;
  const countSelesai = 5;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r border-gray-200 p-5 hidden md:flex flex-col">
        <div>
          <h1 className="text-lg font-semibold mb-6 text-gray-800">
            Kurir Panel
          </h1>

          <div className="space-y-2">
            {["menunggu", "proses", "selesai"].map((menu) => (
              <button
                key={menu}
                onClick={() => setActiveTab(menu as TabType)}
                className={`w-full text-left px-4 py-2 rounded-xl capitalize transition ${
                  activeTab === menu
                    ? "bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {menu}
              </button>
            ))}
          </div>
        </div>

        {/* LOGOUT SIDEBAR */}
        <button
          onClick={handleLogout}
          className="mt-auto bg-red-50 text-red-500 text-xs py-2 rounded-xl font-medium hover:bg-red-100 transition"
        >
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Pengiriman Barang
            </h2>
            <p className="text-xs text-gray-500">Divisi Kurir</p>
          </div>

          {/* LOGOUT HEADER */}
          <button
            onClick={handleLogout}
            className="hidden md:block bg-gray-100 text-gray-700 text-xs px-4 py-2 rounded-xl font-medium hover:bg-gray-200 transition"
          >
            Logout
          </button>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-3">
            <Truck className="text-orange-500" />
            <div>
              <p className="text-xs text-gray-500">Menunggu</p>
              <h3 className="text-lg font-bold">{countMenunggu}</h3>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-3">
            <Truck className="text-amber-500" />
            <div>
              <p className="text-xs text-gray-500">Proses</p>
              <h3 className="text-lg font-bold">{countProses}</h3>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-3">
            <CheckCircle className="text-green-500" />
            <div>
              <p className="text-xs text-gray-500">Selesai</p>
              <h3 className="text-lg font-bold">{countSelesai}</h3>
            </div>
          </div>
        </div>

        {/* LIST */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <h3 className="font-semibold mb-4 capitalize">Data {activeTab}</h3>

          <div className="space-y-3">
            {[1, 2, 3].map((_, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-xl p-4 flex justify-between items-center shadow-sm hover:shadow transition"
              >
                {/* LEFT */}
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Hoodie Green Navy - L
                  </p>

                  {activeTab === "menunggu" && (
                    <div className="text-[11px] text-gray-500 mt-1">
                      • Kode stok potongan <br />• Nama penjahit tujuan
                    </div>
                  )}

                  {activeTab !== "menunggu" && (
                    <div className="text-[11px] text-gray-500 mt-1">
                      • KODE: STK-001 <br />
                      • PENJAHIT: Budi <br />• KURIR: Rafi
                    </div>
                  )}
                </div>

                {/* RIGHT */}
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 mb-1">30</p>

                  {activeTab === "menunggu" && (
                    <button className="bg-gradient-to-r from-orange-400 to-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow opacity-50 cursor-not-allowed">
                      Ambil
                    </button>
                  )}

                  {activeTab === "proses" && (
                    <button className="bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold opacity-50 cursor-not-allowed">
                      Kirim
                    </button>
                  )}

                  {activeTab === "selesai" && (
                    <span className="text-green-500 text-xs font-semibold">
                      ✔ Selesai
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MOBILE LOGOUT */}
        <div className="mt-6 md:hidden">
          <button
            onClick={handleLogout}
            className="w-full bg-gray-100 text-gray-700 text-xs py-2 rounded-xl font-medium hover:bg-gray-200 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
