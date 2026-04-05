"use client";

import { useState } from "react";

export default function PenjahitWeb({ orders, setOrders, handleLogout }: any) {
  const [activeTab, setActiveTab] = useState("menunggu");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const filtered = orders.filter((o: any) => o.status === activeTab);

  const updateStatus = (newStatus: string) => {
    setOrders((prev: any[]) =>
      prev.map((o) =>
        o.id === selectedOrder.id ? { ...o, status: newStatus } : o,
      ),
    );
    setSelectedOrder(null);
  };

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Penjahit Dashboard</h1>

      {/* TAB */}
      <div className="flex gap-4 mb-6">
        {["menunggu", "proses", "selesai"].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-3 py-1 rounded ${
              activeTab === t ? "bg-indigo-500 text-white" : "bg-gray-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map((o: any) => (
          <div
            key={o.id}
            onClick={() => setSelectedOrder(o)}
            className="bg-white p-4 rounded-xl shadow cursor-pointer"
          >
            <div className="flex justify-between">
              <span>{o.nama}</span>
              <span className="font-bold">{o.qty}</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">{o.kode}</p>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-87.5">
            <h2 className="font-semibold mb-3">{selectedOrder.nama}</h2>

            {selectedOrder.status === "menunggu" && (
              <>
                <input placeholder="Kode Potongan" className="input" />
                <input placeholder="Nama Penjahit" className="input" />
                <input placeholder="Kurir" className="input" />
                <button onClick={() => updateStatus("proses")} className="btn">
                  Proses
                </button>
              </>
            )}

            {selectedOrder.status === "proses" && (
              <>
                <input placeholder="Tanggal Kirim" className="input" />
                <button onClick={() => updateStatus("selesai")} className="btn">
                  Selesai
                </button>
              </>
            )}

            {selectedOrder.status === "selesai" && (
              <>
                <input placeholder="Jumlah Lolos" className="input" />
                <input placeholder="Reject" className="input" />
                <input placeholder="Tanggal Selesai" className="input" />
                <button className="btn">Submit</button>
              </>
            )}
          </div>
        </div>
      )}

      <button onClick={handleLogout} className="mt-6 text-red-500">
        Logout
      </button>
    </div>
  );
}
