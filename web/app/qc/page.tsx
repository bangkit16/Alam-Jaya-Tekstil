"use client";

import { useEffect, useState } from "react";
import { getOrders, updateOrder } from "../data/orders";
import { useRouter } from "next/navigation";

export default function QCPage() {
  const router = useRouter();
  const [orders, setOrders] = useState(getOrders());

  useEffect(() => {
    if (localStorage.getItem("role") !== "qc") {
      router.push("/login");
    }
  }, []);

  const handleGagal = (id: number) => {
    updateOrder(id, "rework");
    setOrders([...getOrders()]);
  };

  const handleLolos = (id: number) => {
    updateOrder(id, "gudang");
    setOrders([...getOrders()]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 pb-24">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <button className="text-xl">☰</button>
        <h1 className="text-lg font-semibold">Quality Control</h1>
        <button>🔔</button>
      </div>

      {/* SUMMARY */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
        <h2 className="text-sm font-semibold mb-2">QC Summary</h2>
        <p className="text-xs text-gray-500">
          Total Antrian: {orders.filter((o) => o.status === "qc").length}
        </p>
      </div>

      {/* ANTRIAN QC */}
      <div>
        <h2 className="text-sm font-semibold mb-3">Antrian QC</h2>

        {orders.filter((o) => o.status === "qc").length === 0 && (
          <p className="text-xs text-gray-400">Tidak ada barang</p>
        )}

        <div className="space-y-3">
          {orders
            .filter((o) => o.status === "qc")
            .map((o) => (
              <div
                key={o.id}
                className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center"
              >
                {/* INFO */}
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {o.nama}
                  </p>
                  <p className="text-xs text-gray-400">{o.kodeBarang}</p>
                  <p className="text-xs text-blue-500 mt-1">
                    Menunggu pengecekan
                  </p>
                </div>

                {/* ACTION */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleGagal(o.id)}
                    className="bg-red-500 text-white px-3 py-2 rounded-xl text-xs font-medium"
                  >
                    Gagal
                  </button>

                  <button
                    onClick={() => handleLolos(o.id)}
                    className="bg-green-600 text-white px-3 py-2 rounded-xl text-xs font-medium"
                  >
                    Lolos
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* FLOAT BUTTON */}
      <button className="fixed bottom-20 right-6 bg-gray-800 text-white w-14 h-14 rounded-full text-xl shadow-lg">
        +
      </button>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 flex justify-around text-xs">
        <div className="flex flex-col items-center text-gray-400">
          🏠
          <span>Home</span>
        </div>
        <div className="flex flex-col items-center text-gray-400">
          🧵
          <span>Jahit</span>
        </div>
        <div className="flex flex-col items-center text-black font-medium">
          🔍
          <span>QC</span>
        </div>
        <div className="flex flex-col items-center text-gray-400">
          👤
          <span>Profile</span>
        </div>
      </div>
    </div>
  );
}
