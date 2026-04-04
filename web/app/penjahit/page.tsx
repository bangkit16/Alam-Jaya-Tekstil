"use client";

import { useEffect, useState } from "react";
import { getOrders, updateOrder } from "../data/orders";
import { useRouter } from "next/navigation";

export default function PenjahitPage() {
  const router = useRouter();
  const [orders, setOrders] = useState(getOrders());

  useEffect(() => {
    if (localStorage.getItem("role") !== "jahit") {
      router.push("/login");
    }
  }, []);

  const selesai = (id: number) => {
    updateOrder(id, "qc");
    setOrders([...getOrders()]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 pb-24">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <button className="text-xl">☰</button>
        <h1 className="text-lg font-semibold">Tailor Production</h1>
        <button>🔔</button>
      </div>

      {/* JAHIT BARU */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold mb-3">Jahit Baru</h2>

        {orders.filter((o) => o.status === "jahit").length === 0 && (
          <p className="text-xs text-gray-400">Tidak ada pekerjaan</p>
        )}

        <div className="space-y-3">
          {orders
            .filter((o) => o.status === "jahit")
            .map((o) => (
              <div
                key={o.id}
                className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="text-sm font-medium">
                    {o.nama} ({o.kodeBarang})
                  </p>
                  <p className="text-xs text-gray-400">Siap dijahit</p>
                </div>

                <button
                  onClick={() => selesai(o.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-medium"
                >
                  Kirim QC
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* REWORK */}
      <div>
        <h2 className="text-sm font-semibold mb-3">Rework dari QC</h2>

        {orders.filter((o) => o.status === "rework").length === 0 && (
          <p className="text-xs text-gray-400">Tidak ada rework</p>
        )}

        <div className="space-y-3">
          {orders
            .filter((o) => o.status === "rework")
            .map((o) => (
              <div
                key={o.id}
                className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="text-sm font-medium">
                    {o.nama} ({o.kodeBarang})
                  </p>
                  <p className="text-xs text-orange-500">Perlu jahit ulang</p>
                </div>

                <button
                  onClick={() => selesai(o.id)}
                  className="bg-orange-500 text-white px-4 py-2 rounded-xl text-xs font-medium"
                >
                  Rework → QC
                </button>
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
        <div className="flex flex-col items-center text-black font-medium">
          🧵
          <span>Jahit</span>
        </div>
        <div className="flex flex-col items-center text-gray-400">
          📊
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
