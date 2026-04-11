"use client";

import { useState } from "react";

type statusType = "qc" | "rework" | "gudang";

// ================= DUMMY DATA =================
const DUMMY_ORDERS = [
  {
    id: 1,
    nama: "Hoodie Green Navy - L",
    qty: 25,
    kodeBarang: "HD-GN-L",
    penjahit: "Adit",
    tanggalJahit: "2026-04-10",
    tanggalSelesai: null,
    status: "qc",
  },
  {
    id: 2,
    nama: "Kaos Hitam - M",
    qty: 40,
    kodeBarang: "TS-BLK-M",
    penjahit: "Budi",
    tanggalJahit: "2026-04-09",
    tanggalSelesai: null,
    status: "qc",
  },
  {
    id: 3,
    nama: "Jaket Abu - XL",
    qty: 15,
    kodeBarang: "JK-GRY-XL",
    penjahit: "Rudi",
    tanggalJahit: "2026-04-08",
    tanggalSelesai: "2026-04-11",
    status: "gudang",
  },
  {
    id: 4,
    nama: "Sweater Navy - L",
    qty: 20,
    kodeBarang: "SW-NV-L",
    penjahit: "Deni",
    tanggalJahit: "2026-04-07",
    tanggalSelesai: null,
    status: "rework",
  },
];

export default function Jobs({
  setScreen,
  orders = [],
  handleGagal = () => {},
  handleLolos = () => {},
}: any) {
  const [filterStatus, setFilterStatus] = useState<statusType>("qc");
  const [search, setSearch] = useState("");

  // ================= DATA SOURCE =================
  const dataSource = orders.length ? orders : DUMMY_ORDERS;

  // ================= FILTER =================
  const filteredData = dataSource.filter(
    (o: any) =>
      o.status === filterStatus &&
      o.nama?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 flex justify-center items-center p-4">
      <div className="w-full max-w-sm h-[90vh] bg-white rounded-[40px] shadow-2xl p-4 flex flex-col">
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
        <div className="grid grid-cols-3 gap-2 mb-4 bg-gray-100 p-1 rounded-xl text-xs">
          {[
            { label: "QC", value: "qc" },
            { label: "Rework", value: "rework" },
            { label: "Selesai", value: "gudang" },
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

        {/* CONTENT */}
        <div className="flex-1 overflow-auto space-y-2">
          {filteredData.length === 0 ? (
            <p className="text-center text-gray-400 text-sm">Tidak ada data</p>
          ) : (
            filteredData.map((o: any) => (
              <div
                key={o.id}
                className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm"
              >
                {/* TITLE */}
                <div className="flex justify-between">
                  <p className="text-sm font-medium">{o.nama}</p>
                  <p className="text-lg font-bold">{o.qty}</p>
                </div>

                {/* DETAIL */}
                <div className="text-[10px] text-gray-500 mt-1 space-y-0.5">
                  <p>Kode Stok Potongan : {o.kodeBarang || "-"}</p>
                  <p>Nama Penjahit : {o.penjahit || "-"}</p>
                  <p>Tgl Selesai: {o.tanggalSelesai || "-"}</p>
                </div>
              </div>
            ))
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
