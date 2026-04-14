"use client";

import { useState } from "react";
import { Package, ClipboardList, CheckCircle, Truck } from "lucide-react";

import { useGetPermintaan } from "@/services/potong/useGetPermintaan";
import { useGetProses } from "@/services/potong/useGetProses";
import { useGetStokKirim } from "@/services/potong/useGetStokKirim";
import { usePutPermintaan } from "@/services/potong/usePutPermintaan";
import { usePutProses } from "@/services/potong/usePutProses";
import { usePutStokPotong } from "@/services/potong/usePutStokPotong";

type TabType = "menunggu" | "proses" | "kirim";

export default function PotongWeb({ handleLogout }: any) {
  const [activeTab, setActiveTab] = useState<TabType>("menunggu");

  // ================= API =================
  const { data: dataPermintaan, isLoading: isLoadingPermintaan } =
    useGetPermintaan();

  const { data: dataProses, isLoading: isLoadingProses } = useGetProses();

  const { data: dataStokKirim, isLoading: isLoadingStokKirim } =
    useGetStokKirim();

  const { mutate: mutatePermintaan } = usePutPermintaan();
  const { mutate: mutateProses } = usePutProses();
  const { mutate: mutateStokKirim } = usePutStokPotong();

  // ================= ACTION =================
  const handlePermintaan = (item: any) => {
    mutatePermintaan({
      id: item.id_permintaan,
      data: {
        kode_kain: "WEB",
        pemotong: "web",
        pengecek: "web",
      },
    });
  };

  const handleProses = (item: any) => {
    mutateProses({
      id: item.id_permintaan,
      data: {
        kodeKain: item.kode_kain, //
        jumlahHasil: item.jumlah, //
        idPemotong: ["web"], //
      },
    });
  };

  const handleKirim = (item: any) => {
    mutateStokKirim({
      id: item.id_stok_potong,
      data: {
        penjahit: "web",
        admin: "web",
        tanggal_kirim: new Date().toISOString(),
      },
    });
  };

  // ================= DATA =================
  const getData = () => {
    if (activeTab === "menunggu") return dataPermintaan || [];
    if (activeTab === "proses") return dataProses || [];
    if (activeTab === "kirim") return dataStokKirim || [];
    return [];
  };

  const isLoading =
    (activeTab === "menunggu" && isLoadingPermintaan) ||
    (activeTab === "proses" && isLoadingProses) ||
    (activeTab === "kirim" && isLoadingStokKirim);

  const countMenunggu = dataPermintaan?.length || 0;
  const countProses = dataProses?.length || 0;
  const countKirim = dataStokKirim?.length || 0;

  // ================= UI =================
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r border-gray-200 p-5 hidden md:flex flex-col">
        <div>
          <h1 className="text-lg font-semibold mb-6 text-gray-800">
            Potong Panel
          </h1>

          <div className="space-y-2">
            {["menunggu", "proses", "kirim"].map((menu) => (
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

        {/* 🔥 LOGOUT SIDEBAR */}
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
            Dashboard Produksi
          </h2>

          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
              Divisi Potong
            </div>

            {/* 🔥 LOGOUT HEADER */}
            <button
              onClick={handleLogout}
              className="hidden md:block bg-gray-100 text-gray-700 text-xs px-4 py-1.5 rounded-xl font-medium hover:bg-gray-200 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* CARDS */}
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
            <Truck className="text-green-500" />
            <div>
              <p className="text-xs text-gray-500">Kirim</p>
              <h3 className="text-lg font-bold">{countKirim}</h3>
            </div>
          </div>
        </div>

        {/* LIST */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <h3 className="font-semibold mb-4 capitalize">Data {activeTab}</h3>

          {isLoading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : (
            <div className="space-y-3">
              {getData().map((item: any, index: number) => (
                <div
                  key={index}
                  className="bg-white border border-gray-100 rounded-xl p-4 flex justify-between items-center shadow-sm hover:shadow transition"
                >
                  <div>
                    {item.is_urgent && (
                      <span className="bg-red-100 text-red-500 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                        URGENT
                      </span>
                    )}

                    <p className="text-sm font-medium text-gray-800 mt-1">
                      {item.nama_produk} - {item.ukuran}
                    </p>
                  </div>

                  <div>
                    {activeTab === "menunggu" && (
                      <button
                        onClick={() => handlePermintaan(item)}
                        className="bg-gradient-to-r from-orange-400 to-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow hover:opacity-90"
                      >
                        Proses
                      </button>
                    )}

                    {activeTab === "proses" && (
                      <button
                        onClick={() => handleProses(item)}
                        className="bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-amber-600"
                      >
                        Selesai
                      </button>
                    )}

                    {activeTab === "kirim" && (
                      <button
                        onClick={() => handleKirim(item)}
                        className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-600"
                      >
                        Kirim
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🔥 MOBILE LOGOUT */}
        <div className="mt-6 md:hidden">
          <button
            onClick={handleLogout}
            className="w-full bg-gray-100 text-gray-700 text-xs py-2 rounded-xl font-medium hover:bg-gray-200 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
