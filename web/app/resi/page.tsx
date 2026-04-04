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
    <div className="min-h-screen bg-[#f8fafc]">
      {/* 🔥 NAVBAR */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b">
        <div className="px-4 md:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold">
              R
            </div>
            <span className="font-semibold text-gray-800">Resi Panel</span>
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
            Order Management
          </h1>
          <p className="text-gray-400 text-sm">
            Create order & monitor request ke gudang
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <Stat title="Stock K001" value={getStok("K001")} />
          <Stat title="Stock K002" value={getStok("K002")} />
          <Stat title="Total Order" value={orders.length} />
        </div>

        {/* FORM */}
        <div className="bg-white rounded-2xl shadow-sm border p-5 mb-8 max-w-xl">
          <h2 className="text-sm font-semibold mb-4">Create Order</h2>

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
            <option value="K001">K001</option>
            <option value="K002">K002</option>
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
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl text-sm font-medium shadow"
          >
            Kirim Order →
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b flex justify-between">
            <h3 className="font-medium text-gray-700">Orders</h3>
            <span className="text-xs text-gray-400">{orders.length} items</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-400 text-xs">
                <tr>
                  <th className="text-left p-4">Nama</th>
                  <th className="text-left p-4">Kode</th>
                  <th className="text-left p-4">Jumlah</th>
                  <th className="text-left p-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t hover:bg-gray-50">
                    <td className="p-4 font-medium">{o.nama}</td>
                    <td className="p-4 text-gray-500">{o.kodeBarang}</td>
                    <td className="p-4">{o.jumlah}</td>
                    <td className="p-4">
                      <StatusBadge status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

function StatusBadge({ status }: any) {
  const map: any = {
    selesai: "bg-green-100 text-green-700",
    request: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span
      className={`text-xs px-3 py-1 rounded-full ${
        map[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}
