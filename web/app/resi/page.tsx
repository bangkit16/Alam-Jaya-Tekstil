"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getOrders, addOrder } from "../data/orders";
import { getStok, kurangiStok } from "../data/orders";

export default function ResiPage() {
  const router = useRouter();
  const [orders, setOrders] = useState(getOrders());
  const [nama, setNama] = useState("");
  const [jumlah, setJumlah] = useState(0);
  const [kode, setKode] = useState("K001");

  useEffect(() => {
    if (localStorage.getItem("role") !== "resi") {
      router.push("/login");
    }
  }, []);

  const handleAdd = () => {
    if (!nama || jumlah <= 0) return;

    const stok = getStok(kode);

    if (stok >= jumlah) {
      addOrder({
        id: Date.now(),
        nama,
        kodeBarang: kode,
        jumlah,
        status: "selesai",
      });

      kurangiStok(kode, jumlah);

      alert(`✅ Barang tersedia (${kode}), stok berkurang`);
    } else {
      addOrder({
        id: Date.now(),
        nama,
        kodeBarang: kode,
        jumlah,
        status: "request",
      });

      alert(`❌ Stok ${kode} habis, kirim ke gudang`);
    }

    setOrders([...getOrders()]);
    setNama("");
    setJumlah(0);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 pb-24">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <button className="text-xl">☰</button>
        <h1 className="text-lg font-semibold">Resi Management</h1>
        <button>🔔</button>
      </div>

      {/* INFO STOK */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-5">
        <h2 className="text-sm font-semibold mb-2">Stock Info</h2>
        <p className="text-xs text-gray-500">K001: {getStok("K001")}</p>
        <p className="text-xs text-gray-500">K002: {getStok("K002")}</p>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
        <h2 className="text-sm font-semibold mb-3">Create Order</h2>

        <input
          placeholder="Nama Barang"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          className="w-full bg-gray-100 rounded-xl px-3 py-2 mb-3 text-sm outline-none"
        />

        <select
          value={kode}
          onChange={(e) => setKode(e.target.value)}
          className="w-full bg-gray-100 rounded-xl px-3 py-2 mb-3 text-sm outline-none"
        >
          <option value="K001">K001 (Stok Habis)</option>
          <option value="K002">K002 (Ada Stok)</option>
        </select>

        <input
          type="number"
          placeholder="Jumlah"
          value={jumlah}
          onChange={(e) => setJumlah(Number(e.target.value))}
          className="w-full bg-gray-100 rounded-xl px-3 py-2 mb-4 text-sm outline-none"
        />

        <button
          onClick={handleAdd}
          className="w-full bg-gray-800 text-white py-3 rounded-xl text-sm font-medium"
        >
          Kirim Request
        </button>
      </div>

      {/* ORDER SELESAI */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold mb-3">Order Selesai</h2>

        <div className="space-y-3">
          {orders
            .filter((o) => o.status === "selesai")
            .map((o) => (
              <div
                key={o.id}
                className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center"
              >
                <span className="text-sm">
                  {o.nama} ({o.kodeBarang})
                </span>

                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-lg">
                  selesai
                </span>
              </div>
            ))}

          {orders.filter((o) => o.status === "selesai").length === 0 && (
            <p className="text-xs text-gray-400">Belum ada</p>
          )}
        </div>
      </div>

      {/* REQUEST */}
      <div>
        <h2 className="text-sm font-semibold mb-3">Request ke Gudang</h2>

        <div className="space-y-3">
          {orders
            .filter((o) => o.status === "request")
            .map((o) => (
              <div
                key={o.id}
                className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center"
              >
                <span className="text-sm">
                  {o.nama} ({o.kodeBarang})
                </span>

                <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg">
                  request
                </span>
              </div>
            ))}

          {orders.filter((o) => o.status === "request").length === 0 && (
            <p className="text-xs text-gray-400">Tidak ada request</p>
          )}
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
