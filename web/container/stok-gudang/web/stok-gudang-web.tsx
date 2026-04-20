"use client";

import { useState } from "react";
import {
  Package,
  Archive,
  CheckCircle,
  ClipboardList,
  LogOut,
} from "lucide-react";

import { useGetBoxMasuk } from "@/services/stok-gudang/useGetBoxMasuk";
import { useGetDatabox } from "@/services/stok-gudang/useGetDataBox";
import { useGetPermintaanPotong } from "@/services/stok-gudang/useGetPermintaanPotong";

// 🔥 IMPORT SCREEN
import BoxMasuk from "./screens/BoxMasuk";
import DataBox from "./screens/DataBox";
import PermintaanResi from "./screens/PermintaanResi";
import MintaPotong from "./screens/MintaPotong";

type TabType = "boxMasuk" | "dataBox" | "permintaanResi" | "mintaPotong";

export default function StokGudangWeb({ handleLogout }: any) {
  const [activeTab, setActiveTab] = useState<TabType>("boxMasuk");

  const { data: boxMasuk } = useGetBoxMasuk();
  const { data: dataBox } = useGetDatabox();
  const { data: permintaanPotong } = useGetPermintaanPotong();

  const menuList = [
    { key: "boxMasuk", label: "Box Masuk", icon: Archive },
    { key: "dataBox", label: "Data Box", icon: Package },
    { key: "permintaanResi", label: "Permintaan Resi", icon: ClipboardList },
    { key: "mintaPotong", label: "Minta Potong", icon: CheckCircle },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <div className="w-72 bg-white/80 backdrop-blur-xl border-r p-6 hidden md:flex flex-col shadow-lg">
        <div className="mb-8">
          <h1 className="text-lg font-semibold">Stok Gudang</h1>
          <p className="text-xs text-gray-400">Manajemen gudang</p>
        </div>

        <div className="flex flex-col gap-2">
          {menuList.map((menu) => {
            const Icon = menu.icon;
            return (
              <button
                key={menu.key}
                onClick={() => setActiveTab(menu.key as TabType)}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm
                ${
                  activeTab === menu.key
                    ? "bg-orange-500 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                <Icon size={18} />
                {menu.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleLogout}
          className="mt-auto bg-red-50 text-red-500 py-2 rounded-xl"
        >
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6">
        <h2 className="text-xl font-semibold mb-6">Dashboard Stok Gudang</h2>

        {/* STATS */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Stat title="Box Masuk" value={boxMasuk?.length || 0} />
          <Stat title="Data Box" value={dataBox?.length || 0} />
          <Stat title="Permintaan Resi" value={0} />
          <Stat title="Minta Potong" value={permintaanPotong?.length || 0} />
        </div>

        {/* CONTENT */}
        <div className="bg-gray-50 p-4 rounded-2xl">
          {activeTab === "boxMasuk" && <BoxMasuk />}
          {activeTab === "dataBox" && <DataBox />}
          {activeTab === "permintaanResi" && <PermintaanResi />}
          {activeTab === "mintaPotong" && <MintaPotong />}
        </div>
      </div>
    </div>
  );
}

function Stat({ title, value }: any) {
  return (
    <div className="bg-white p-4 rounded-xl text-center">
      <p className="text-xs text-gray-400">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
