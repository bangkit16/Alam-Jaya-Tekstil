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

export default function PotongWeb() {
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
        kode_potongan: item.kode_kain,
        jumlah_lolos: item.jumlah,
        pengecek: "web",
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
      <div className="w-64 bg-white shadow-lg p-5 hidden md:block">
        <h1 className="text-xl font-bold mb-6 text-indigo-600">Potong Panel</h1>

        <div className="space-y-3">
          {["menunggu", "proses", "kirim"].map((menu) => (
            <button
              key={menu}
              onClick={() => setActiveTab(menu as TabType)}
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
              <h3 className="text-lg font-bold">{countMenunggu}</h3>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3">
            <ClipboardList className="text-yellow-500" />
            <div>
              <p className="text-xs text-gray-500">Proses</p>
              <h3 className="text-lg font-bold">{countProses}</h3>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3">
            <Truck className="text-green-600" />
            <div>
              <p className="text-xs text-gray-500">Kirim</p>
              <h3 className="text-lg font-bold">{countKirim}</h3>
            </div>
          </div>
        </div>

        {/* LIST */}
        <div className="bg-white border border-gray-200 rounded-xl shadow p-4">
          <h3 className="font-semibold mb-4 capitalize">Data {activeTab}</h3>

          {isLoading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : (
            <div className="space-y-3">
              {getData().map((item: any, index: number) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">
                      {item.nama_produk} - {item.ukuran}
                    </p>

                    {item.is_urgent && (
                      <p className="text-xs text-red-500 font-bold">URGENT</p>
                    )}
                  </div>

                  <div>
                    {activeTab === "menunggu" && (
                      <button
                        onClick={() => handlePermintaan(item)}
                        className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Proses
                      </button>
                    )}

                    {activeTab === "proses" && (
                      <button
                        onClick={() => handleProses(item)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Selesai
                      </button>
                    )}

                    {activeTab === "kirim" && (
                      <button
                        onClick={() => handleKirim(item)}
                        className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
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
      </div>
    </div>
  );
}
