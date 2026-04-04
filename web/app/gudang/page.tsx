"use client";

import { useEffect, useState } from "react";
import { getOrders, updateOrder, getStok } from "../data/orders";
import { useRouter } from "next/navigation";

export default function GudangPage() {
  const router = useRouter();
  const [orders, setOrders] = useState(getOrders());

  useEffect(() => {
    if (localStorage.getItem("role") !== "admin") {
      router.push("/login");
    }
  }, []);

  const kirimKePotong = (id: number) => {
    updateOrder(id, "potong");
    setOrders([...getOrders()]);
  };

  const terimaDariQC = (id: number) => {
    updateOrder(id, "selesai");
    setOrders([...getOrders()]);
  };

  const kirimKeResi = (id: number) => {
    updateOrder(id, "resi");
    setOrders([...getOrders()]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 pb-24">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <button className="text-xl">☰</button>
        <h1 className="text-lg font-semibold">Admin Gudang</h1>
        <button>🔔</button>
      </div>

      {/* SEARCH */}
      <div className="bg-gray-200 rounded-2xl px-4 py-3 mb-5 text-sm text-gray-500">
        🔍 Search SKU/Stock...
      </div>

      {/* STOCK CARDS */}
      <div className="space-y-4">
        {/* ITEM 1 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm flex justify-between items-center">
          <div>
            <h2 className="font-semibold">K001</h2>
            <p className="text-xs text-gray-400">Available Stock</p>
            <p className="text-2xl font-bold">{getStok("K001")}</p>
          </div>
          <span className="bg-green-200 text-green-700 px-3 py-1 rounded-lg text-xs">
            IN STOCK
          </span>
        </div>

        {/* ITEM 2 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm flex justify-between items-center">
          <div>
            <h2 className="font-semibold">K002</h2>
            <p className="text-xs text-gray-400">Available Stock</p>
            <p className="text-2xl font-bold">{getStok("K002")}</p>
          </div>
          <span className="bg-yellow-200 text-yellow-700 px-3 py-1 rounded-lg text-xs">
            LOW STOCK
          </span>
        </div>
      </div>

      {/* REQUEST */}
      <div className="mt-6">
        <h2 className="text-sm font-semibold mb-3">Request</h2>

        {orders.filter((o) => o.status === "request").length === 0 && (
          <p className="text-xs text-gray-400">Tidak ada request</p>
        )}

        <div className="space-y-3">
          {orders
            .filter((o) => o.status === "request")
            .map((o) => (
              <div
                key={o.id}
                className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-sm">
                    {o.nama} ({o.kodeBarang})
                  </p>
                  <p className="text-xs text-gray-400">{o.jumlah} pcs</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => kirimKePotong(o.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs"
                  >
                    Potong
                  </button>

                  <button
                    onClick={() => kirimKeResi(o.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs"
                  >
                    Resi
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* PRODUKSI */}
      <div className="mt-6">
        <h2 className="text-sm font-semibold mb-3">Dalam Produksi</h2>

        <div className="space-y-3">
          {orders
            .filter((o) => o.status === "potong")
            .map((o) => (
              <div
                key={o.id}
                className="bg-white p-4 rounded-2xl shadow-sm text-sm"
              >
                {o.nama} ({o.kodeBarang})
              </div>
            ))}
        </div>
      </div>

      {/* KE RESI */}
      <div className="mt-6">
        <h2 className="text-sm font-semibold mb-3">Ke Resi</h2>

        <div className="space-y-3">
          {orders
            .filter((o) => o.status === "resi")
            .map((o) => (
              <div
                key={o.id}
                className="bg-white p-4 rounded-2xl shadow-sm flex justify-between"
              >
                <span className="text-sm">
                  {o.nama} ({o.kodeBarang})
                </span>

                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  dikirim
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* DARI QC */}
      <div className="mt-6">
        <h2 className="text-sm font-semibold mb-3">Barang dari QC</h2>

        <div className="space-y-3">
          {orders
            .filter((o) => o.status === "gudang")
            .map((o) => (
              <div
                key={o.id}
                className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center"
              >
                <span className="text-sm">
                  {o.nama} ({o.kodeBarang})
                </span>

                <button
                  onClick={() => terimaDariQC(o.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs"
                >
                  Masukkan Stok
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
          📦
          <span>Orders</span>
        </div>
        <div className="flex flex-col items-center text-gray-400">
          📊
          <span>Stocks</span>
        </div>
        <div className="flex flex-col items-center text-gray-400">
          👤
          <span>Profile</span>
        </div>
      </div>
    </div>
  );
}
