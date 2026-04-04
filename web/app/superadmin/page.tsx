"use client";

import { useEffect, useState } from "react";
import { getOrders } from "../data/orders";
import { useRouter } from "next/navigation";

export default function SuperAdminPage() {
  const router = useRouter();
  const [orders, setOrders] = useState(getOrders());

  useEffect(() => {
    if (localStorage.getItem("role") !== "superadmin") {
      router.push("/login");
    }
  }, []);

  const count = (status: string) =>
    orders.filter((o) => o.status === status).length;

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      {/* TOPBAR */}
      {/* 🔥 MODERN NAVBAR */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/20">
        <div className="px-4 md:px-8 py-3 flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-4">
            {/* LOGO */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold">
                A
              </div>
              <span className="font-semibold text-gray-800 tracking-tight">
                Alam Jaya Tekstil
              </span>
            </div>

            {/* SEARCH */}
            <div className="hidden md:flex items-center bg-white/80 backdrop-blur border rounded-full px-4 py-2 w-72 shadow-sm">
              <span className="text-gray-400 mr-2 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search orders..."
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {/* NOTIFICATION */}
            <div className="hidden md:flex w-9 h-9 items-center justify-center rounded-full bg-white shadow-sm cursor-pointer hover:bg-gray-100">
              🔔
            </div>

            {/* PROFILE */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm">
              <div className="w-7 h-7 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs">
                SA
              </div>
              <span className="text-sm text-gray-600 hidden md:block">
                Super Admin
              </span>
            </div>

            {/* LOGOUT */}
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
      </div>

      {/* CONTENT */}
      <div className="p-4 md:p-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Super Admin
            </h2>
            <p className="text-gray-400 text-sm">
              Monitor semua proses produksi & distribusi
            </p>
          </div>

          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-xl bg-white shadow text-sm hover:bg-gray-50">
              Update Stock
            </button>
            <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm shadow-lg">
              Dispatch
            </button>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card title="Request" value={count("request")} color="indigo" />
          <Card title="Produksi" value={count("potong")} color="blue" />
          <Card title="Jahit" value={count("jahit")} color="purple" />
          <Card title="QC" value={count("qc")} color="pink" />
          <Card title="Gudang" value={count("gudang")} color="yellow" />
          <Card title="Selesai" value={count("selesai")} color="green" />
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-3xl shadow-md overflow-hidden">
          <div className="p-5 border-b flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">Semua Order</h3>
            <span className="text-xs text-gray-400">
              Total: {orders.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-400 text-xs">
                <tr>
                  <th className="text-left p-4">Nama</th>
                  <th className="text-left p-4">Kode</th>
                  <th className="text-left p-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((o) => (
                  <tr
                    key={o.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-4 font-medium">{o.nama}</td>
                    <td className="p-4 text-gray-500">{o.kodeBarang}</td>
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

/* CARD */
function Card({ title, value, color }: any) {
  const colors: any = {
    indigo: "bg-indigo-50 text-indigo-600",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    pink: "bg-pink-50 text-pink-600",
    yellow: "bg-yellow-50 text-yellow-600",
    green: "bg-green-50 text-green-600",
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition">
      <p className="text-xs text-gray-400 mb-1">{title}</p>
      <h2 className="text-xl font-bold mb-2">{value}</h2>
      <span className={`text-[10px] px-2 py-1 rounded-full ${colors[color]}`}>
        Active
      </span>
    </div>
  );
}

/* STATUS BADGE */
function StatusBadge({ status }: any) {
  const map: any = {
    selesai: "bg-green-100 text-green-700",
    qc: "bg-blue-100 text-blue-700",
    rework: "bg-orange-100 text-orange-700",
    request: "bg-purple-100 text-purple-700",
    potong: "bg-indigo-100 text-indigo-700",
    jahit: "bg-pink-100 text-pink-700",
    gudang: "bg-yellow-100 text-yellow-700",
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
