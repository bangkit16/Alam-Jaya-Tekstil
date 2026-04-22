"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStok } from "../data/orders";

export default function StokResiPage() {
  const router = useRouter();

  const [stokK001, setStokK001] = useState(0);
  const [stokK002, setStokK002] = useState(0);

  useEffect(() => {
    // 🔥 AUTH GUARD (biar gak mental login)
    if (localStorage.getItem("role")?.toLowerCase() !== "stokresi") {
      router.push("/login");
    }

    // load stok
    setStokK001(getStok("K001"));
    setStokK002(getStok("K002"));
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* NAVBAR */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b">
        <div className="px-4 md:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white flex items-center justify-center font-bold">
              S
            </div>
            <span className="font-semibold text-gray-800">Stok Resi Panel</span>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("role");
              router.push("/login");
            }}
            className="text-sm text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 md:p-8">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Stock Management
          </h1>
          <p className="text-gray-400 text-sm">
            Monitor stok barang dari gudang
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <Stat title="Stock K001" value={stokK001} />
          <Stat title="Stock K002" value={stokK002} />
          <Stat title="Total Stock" value={stokK001 + stokK002} />
        </div>

        {/* CARD DETAIL */}
        <div className="grid md:grid-cols-2 gap-6">
          <StockCard kode="K001" stok={stokK001} />
          <StockCard kode="K002" stok={stokK002} />
        </div>
      </div>
    </div>
  );
}

function Stat({ title, value }: any) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border">
      <p className="text-xs text-gray-400">{title}</p>
      <h2 className="text-xl font-semibold">{value}</h2>
    </div>
  );
}

function StockCard({ kode, stok }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border">
      <h2 className="text-lg font-semibold mb-2">{kode}</h2>

      <p className="text-3xl font-bold text-gray-800 mb-3">{stok}</p>

      <div
        className={`text-xs px-3 py-1 rounded-full inline-block ${
          stok > 10
            ? "bg-green-100 text-green-700"
            : stok > 0
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
        }`}
      >
        {stok > 10 ? "Stok Aman" : stok > 0 ? "Stok Menipis" : "Stok Habis"}
      </div>
    </div>
  );
}
