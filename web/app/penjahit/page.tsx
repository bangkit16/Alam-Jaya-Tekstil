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

  const jahitList = orders.filter((o) => o.status === "jahit");
  const reworkList = orders.filter((o) => o.status === "rework");

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* NAVBAR */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b">
        <div className="px-4 md:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold">
              J
            </div>
            <span className="font-semibold text-gray-800">Tailor Panel</span>
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
            Tailor Production
          </h1>
          <p className="text-gray-400 text-sm">Proses jahit & rework dari QC</p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <Stat title="Jahit Baru" value={jahitList.length} />
          <Stat title="Rework" value={reworkList.length} />
          <Stat title="Total" value={orders.length} />
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b flex justify-between">
            <h3 className="font-medium text-gray-700">Production Queue</h3>
            <span className="text-xs text-gray-400">{orders.length} items</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-400 text-xs">
                <tr>
                  <th className="text-left p-4">Nama</th>
                  <th className="text-left p-4">Kode</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-right p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {orders
                  .filter((o) => o.status === "jahit" || o.status === "rework")
                  .map((o) => (
                    <tr key={o.id} className="border-t hover:bg-gray-50">
                      {/* NAMA */}
                      <td className="p-4 font-medium">{o.nama}</td>

                      {/* KODE */}
                      <td className="p-4 text-gray-500">{o.kodeBarang}</td>

                      {/* STATUS */}
                      <td className="p-4">
                        <StatusBadge status={o.status} />
                      </td>

                      {/* ACTION */}
                      <td className="p-4 text-right">
                        <button
                          onClick={() => selesai(o.id)}
                          className={`px-4 py-2 rounded-xl text-xs text-white shadow
                          ${
                            o.status === "rework"
                              ? "bg-orange-500"
                              : "bg-indigo-600"
                          }`}
                        >
                          {o.status === "rework" ? "Rework → QC" : "Kirim QC"}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* EMPTY STATE */}
        {jahitList.length === 0 && reworkList.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-6">
            Tidak ada pekerjaan
          </p>
        )}
      </div>
    </div>
  );
}

/* COMPONENTS */

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
    jahit: "bg-indigo-100 text-indigo-700",
    rework: "bg-orange-100 text-orange-700",
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
