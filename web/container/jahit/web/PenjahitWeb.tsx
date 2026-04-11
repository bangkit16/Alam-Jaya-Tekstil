"use client";

import { useState } from "react";
import { Package, ClipboardList, CheckCircle } from "lucide-react";

type TabType = "menunggu" | "proses" | "selesai";

export default function PenjahitWeb({ orders, setOrders, handleLogout }: any) {
  const [activeTab, setActiveTab] = useState<TabType>("menunggu");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const filtered = orders.filter((o: any) => o.status === activeTab);

  const updateStatus = (newStatus: TabType) => {
    setOrders((prev: any[]) =>
      prev.map((o) =>
        o.id === selectedOrder.id ? { ...o, status: newStatus } : o,
      ),
    );
    setSelectedOrder(null);
  };

  const countMenunggu = orders.filter((o) => o.status === "menunggu").length;
  const countProses = orders.filter((o) => o.status === "proses").length;
  const countSelesai = orders.filter((o) => o.status === "selesai").length;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r border-gray-200 p-5 hidden md:flex flex-col">
        <div>
          <h1 className="text-lg font-semibold mb-6 text-gray-800">
            Penjahit Panel
          </h1>

          <div className="space-y-2">
            {["menunggu", "proses", "selesai"].map((menu) => (
              <button
                key={menu}
                onClick={() => setActiveTab(menu as TabType)}
                className={`w-full text-left px-4 py-2 rounded-xl capitalize transition ${
                  activeTab === menu
                    ? "bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {menu}
              </button>
            ))}
          </div>
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="mt-auto bg-red-50 text-red-500 text-xs py-2 rounded-xl font-medium hover:bg-red-100 transition"
        >
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Dashboard Jahit
          </h2>

          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
              Divisi Penjahit
            </div>

            <button
              onClick={handleLogout}
              className="hidden md:block bg-gray-100 text-gray-700 text-xs px-4 py-1.5 rounded-xl font-medium hover:bg-gray-200 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-3">
            <Package className="text-orange-500" />
            <div>
              <p className="text-xs text-gray-500">Menunggu</p>
              <h3 className="text-lg font-bold">{countMenunggu}</h3>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-3">
            <ClipboardList className="text-amber-500" />
            <div>
              <p className="text-xs text-gray-500">Proses</p>
              <h3 className="text-lg font-bold">{countProses}</h3>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-3">
            <CheckCircle className="text-green-500" />
            <div>
              <p className="text-xs text-gray-500">Selesai</p>
              <h3 className="text-lg font-bold">{countSelesai}</h3>
            </div>
          </div>
        </div>

        {/* LIST */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <h3 className="font-semibold mb-4 capitalize">Data {activeTab}</h3>

          <div className="space-y-3">
            {filtered.map((o: any) => (
              <div
                key={o.id}
                onClick={() => setSelectedOrder(o)}
                className="bg-white border border-gray-100 rounded-xl p-4 flex justify-between items-center shadow-sm hover:shadow transition cursor-pointer"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">{o.nama}</p>
                  <p className="text-xs text-gray-400 mt-1">{o.kode || "-"}</p>
                </div>

                <p className="text-lg font-bold text-orange-500">{o.qty}</p>
              </div>
            ))}
          </div>
        </div>

        {/* MOBILE LOGOUT */}
        <div className="mt-6 md:hidden">
          <button
            onClick={handleLogout}
            className="w-full bg-gray-100 text-gray-700 text-xs py-2 rounded-xl font-medium hover:bg-gray-200 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white border border-gray-200 p-6 rounded-2xl w-[400px] shadow-lg">
            <h2 className="font-semibold mb-3 text-gray-800">
              {selectedOrder.nama}
            </h2>

            {selectedOrder.status === "menunggu" && (
              <>
                <input placeholder="Kode Potongan" className="input" />
                <input placeholder="Nama Penjahit" className="input" />
                <button
                  onClick={() => updateStatus("proses")}
                  className="mt-3 bg-orange-500 text-white px-3 py-1.5 rounded-lg text-xs"
                >
                  Proses
                </button>
              </>
            )}

            {selectedOrder.status === "proses" && (
              <>
                <input placeholder="Tanggal Selesai" className="input" />
                <button
                  onClick={() => updateStatus("selesai")}
                  className="mt-3 bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs"
                >
                  Selesai
                </button>
              </>
            )}

            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-4 text-xs text-gray-500"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
