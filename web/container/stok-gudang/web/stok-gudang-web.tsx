"use client";

import { useState } from "react";
import { Package, Archive, CheckCircle } from "lucide-react";

type TabType = "stok" | "masuk" | "keluar";

export default function StokGudangWeb({ handleLogout }: any) {
  const [activeTab, setActiveTab] = useState<TabType>("stok");

  const [data, setData] = useState<any[]>([
    { id: 1, nama: "Hoodie A", qty: 20, status: "stok" },
    { id: 2, nama: "Kaos B", qty: 10, status: "masuk" },
  ]);

  const filtered = data.filter((d) => d.status === activeTab);

  const count = (status: TabType) =>
    data.filter((d) => d.status === status).length;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r p-5 hidden md:flex flex-col">
        <h1 className="text-lg font-semibold mb-6">Stok Gudang</h1>

        {["stok", "masuk", "keluar"].map((menu) => (
          <button
            key={menu}
            onClick={() => setActiveTab(menu as TabType)}
            className={`text-left px-4 py-2 rounded-xl capitalize ${
              activeTab === menu
                ? "bg-gradient-to-r from-orange-400 to-amber-500 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {menu}
          </button>
        ))}

        <button onClick={handleLogout} className="mt-auto text-red-500 text-xs">
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6">
        <h2 className="text-xl font-semibold mb-6">Dashboard Stok Gudang</h2>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Stat title="Stok" value={count("stok")} icon={<Package />} />
          <Stat title="Masuk" value={count("masuk")} icon={<Archive />} />
          <Stat title="Keluar" value={count("keluar")} icon={<CheckCircle />} />
        </div>

        {/* LIST */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <h3 className="font-semibold mb-4 capitalize">Data {activeTab}</h3>

          <div className="space-y-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white border rounded-xl p-4 flex justify-between items-center"
              >
                <p>{item.nama}</p>
                <b>{item.qty}</b>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-gray-400 text-sm mt-6">
              Tidak ada data
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ title, value, icon }: any) {
  return (
    <div className="bg-white p-4 rounded-2xl flex items-center gap-3">
      <div className="text-orange-500">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
}
