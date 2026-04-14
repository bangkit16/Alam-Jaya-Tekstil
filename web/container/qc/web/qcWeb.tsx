"use client";

import { useState } from "react";
import { Package, ClipboardList, Archive, CheckCircle } from "lucide-react";

type TabType = "menunggu" | "proses" | "masuk_box" | "selesai";

export default function QCWeb({ handleLogout }: any) {
  const [activeTab, setActiveTab] = useState<TabType>("menunggu");

  const [data, setData] = useState<any[]>([
    {
      id: 1,
      nama: "Hoodie Green Navy - L",
      qty: 25,
      status: "menunggu",
    },
    {
      id: 2,
      nama: "Hoodie Black - M",
      qty: 15,
      status: "proses",
    },
    {
      id: 3,
      nama: "Hoodie Abu - XL",
      qty: 10,
      status: "masuk_box",
    },
  ]);

  const filtered = data.filter((d) => d.status === activeTab);

  // ================= ACTION =================
  const updateStatus = (id: number, status: TabType) => {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item)),
    );
  };

  // ================= COUNT =================
  const count = (status: TabType) =>
    data.filter((d) => d.status === status).length;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r p-5 hidden md:flex flex-col">
        <h1 className="text-lg font-semibold mb-6">QC Panel</h1>

        <div className="space-y-2">
          {["menunggu", "proses", "masuk_box", "selesai"].map((menu) => (
            <button
              key={menu}
              onClick={() => setActiveTab(menu as TabType)}
              className={`w-full text-left px-4 py-2 rounded-xl capitalize ${
                activeTab === menu
                  ? "bg-gradient-to-r from-orange-400 to-amber-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {menu.replace("_", " ")}
            </button>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="mt-auto bg-red-50 text-red-500 text-xs py-2 rounded-xl"
        >
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6">
        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-semibold">Dashboard QC</h2>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Stat title="Menunggu" value={count("menunggu")} icon={<Package />} />
          <Stat
            title="Proses"
            value={count("proses")}
            icon={<ClipboardList />}
          />
          <Stat
            title="Masuk Box"
            value={count("masuk_box")}
            icon={<Archive />}
          />
          <Stat
            title="Selesai"
            value={count("selesai")}
            icon={<CheckCircle />}
          />
        </div>

        {/* LIST */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <h3 className="font-semibold mb-4 capitalize">
            Data {activeTab.replace("_", " ")}
          </h3>

          <div className="space-y-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white border rounded-xl p-4 flex justify-between items-center shadow-sm hover:shadow transition"
              >
                <div>
                  <p className="text-sm font-medium">{item.nama}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold">{item.qty}</span>

                  {/* ACTION BUTTON */}
                  {activeTab === "menunggu" && (
                    <button
                      onClick={() => updateStatus(item.id, "proses")}
                      className="bg-orange-500 text-white px-3 py-1 text-xs rounded"
                    >
                      Proses
                    </button>
                  )}

                  {activeTab === "proses" && (
                    <button
                      onClick={() => updateStatus(item.id, "masuk_box")}
                      className="bg-amber-500 text-white px-3 py-1 text-xs rounded"
                    >
                      QC Done
                    </button>
                  )}

                  {activeTab === "masuk_box" && (
                    <button
                      onClick={() => updateStatus(item.id, "selesai")}
                      className="bg-blue-500 text-white px-3 py-1 text-xs rounded"
                    >
                      Packing
                    </button>
                  )}
                </div>
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

// ================= COMPONENT =================
function Stat({ title, value, icon }: any) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-3">
      <div className="text-orange-500">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <h3 className="text-lg font-bold">{value}</h3>
      </div>
    </div>
  );
}
