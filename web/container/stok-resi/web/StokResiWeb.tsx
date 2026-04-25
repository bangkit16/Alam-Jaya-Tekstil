"use client";

import { useState } from "react";
import BoxMasuk from "./screens/BoxMasuk";
import DataBox from "./screens/DataBox";
import Permintaan from "./screens/Permintaan";
import ProsesPesanan from "./screens/ProsesPesanan";
import RiwayatPesanan from "./screens/RiwayatPesanan";

type TabType =
  | "boxMasuk"
  | "dataBox"
  | "permintaan"
  | "prosesPesanan"
  | "riwayatPesanan";

interface StokResiWebProps {
  handleLogout: () => void;
}

export default function StokResiWeb({ handleLogout }: StokResiWebProps) {
  const [activeTab, setActiveTab] = useState<TabType>("boxMasuk");

  const menus = [
    { key: "boxMasuk", label: "Box Masuk" },
    { key: "dataBox", label: "Data Box" },
    { key: "permintaan", label: "Permintaan" },
    { key: "prosesPesanan", label: "Proses Pesanan" },
    { key: "riwayatPesanan", label: "Riwayat Pesanan" },
  ];

  return (
    <div className="flex min-h-screen max-h-screen overflow-hidden bg-gradient-to-br from-gray-100 to-orange-50">
      {/* SIDEBAR */}
      <div className="w-64 bg-white/70 backdrop-blur-xl border-r border-white/40 p-5 hidden md:flex flex-col shadow-lg overflow-y-auto">
        <div>
          <h1 className="text-lg font-semibold mb-6 text-gray-800">
            Stok Resi
          </h1>

          <div className="space-y-2">
            {menus.map((menu) => (
              <button
                key={menu.key}
                onClick={() => setActiveTab(menu.key as TabType)}
                className={`w-full text-left px-4 py-2 rounded-xl transition ${
                  activeTab === menu.key
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg scale-[1.02]"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {menu.label}
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

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 flex flex-col overflow-auto">
        {/* HEADER */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800 capitalize">
            {menus.find((m) => m.key === activeTab)?.label}
          </h2>
          <p className="text-xs text-gray-400">Stok Resi Management</p>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-auto pr-2">
          {activeTab === "boxMasuk" && <BoxMasuk />}

          {activeTab === "dataBox" && <DataBox />}

          {activeTab === "permintaan" && <Permintaan />}

          {activeTab === "prosesPesanan" && <ProsesPesanan />}

          {activeTab === "riwayatPesanan" && <RiwayatPesanan />}
        </div>
      </div>
    </div>
  );
}
