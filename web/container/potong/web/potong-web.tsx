"use client";

import { Package, ClipboardList, CheckCircle } from "lucide-react";

export default function PotongWeb(props: any) {
  const { orders, activeTab, setActiveTab, filteredOrders } = props;

  const count = (status: string) =>
    orders.filter((o: any) => o.status === status).length;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <div className="w-64 bg-white shadow-lg p-5 hidden md:block">
        <h1 className="text-xl font-bold mb-6 text-indigo-600">Potong Panel</h1>

        <div className="space-y-3">
          {["menunggu", "proses", "selesai"].map((menu) => (
            <button
              key={menu}
              onClick={() => setActiveTab(menu)}
              className={`w-full text-left px-4 py-2 rounded-lg capitalize ${
                activeTab === menu
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {menu}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Dashboard Produksi
          </h2>

          <div className="text-sm text-gray-500">Divisi Potong</div>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3">
            <Package className="text-indigo-600" />
            <div>
              <p className="text-xs text-gray-500">Menunggu</p>
              <h3 className="text-lg font-bold">{count("menunggu")}</h3>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3">
            <ClipboardList className="text-yellow-500" />
            <div>
              <p className="text-xs text-gray-500">Proses</p>
              <h3 className="text-lg font-bold">{count("proses")}</h3>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3">
            <CheckCircle className="text-green-600" />
            <div>
              <p className="text-xs text-gray-500">Selesai</p>
              <h3 className="text-lg font-bold">{count("selesai")}</h3>
            </div>
          </div>
        </div>

        {/* TABLE / LIST */}
        <div className="bg-white border border-gray-200 rounded-xl shadow p-4">
          <h3 className="font-semibold mb-4 capitalize">Order {activeTab}</h3>

          <div className="space-y-3">
            {filteredOrders.map((o: any) => (
              <div
                key={o.id}
                className="border border-gray-200 rounded-lg p-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{o.nama}</p>
                  <p className="text-xs text-gray-400">Status: {o.status}</p>
                </div>

                <div>
                  {o.status === "menunggu" && (
                    <button className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm">
                      Mulai
                    </button>
                  )}

                  {o.status === "proses" && (
                    <button className="bg-gray-800 text-white px-3 py-1 rounded-lg text-sm">
                      Selesai
                    </button>
                  )}

                  {o.status === "selesai" && (
                    <span className="text-green-600 text-sm">✔ Done</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
