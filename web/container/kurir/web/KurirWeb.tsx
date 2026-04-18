"use client";

import { useState, useEffect } from "react";
import { Truck, CheckCircle } from "lucide-react";

import {
  useGetKurirMenunggu,
  KurirMenunggu,
} from "@/services/kurir/useGetKurirMenunggu";

import { useGetKurirProses } from "@/services/kurir/useGetKurirProses";
import {
  useGetKurirSelesai,
  KurirSelesaiResponse,
} from "@/services/kurir/useGetKurirSelesai";

import { useGetListKurir } from "@/services/kurir/useGetListKurir";
import { usePutAmbilJob } from "@/services/kurir/usePutAmbilJob";

type TabType = "menunggu" | "proses" | "selesai";

export default function KurirWeb({ handleLogout }: any) {
  const [activeTab, setActiveTab] = useState<TabType>("menunggu");

  // 🔥 SEARCH + PAGINATION SELESAI
  const [searchSelesai, setSearchSelesai] = useState("");
  const [currentPageSelesai, setCurrentPageSelesai] = useState(1);
  const itemsPerPageSelesai = 5;

  // ================= API =================
  const {
    data: dataMenunggu,
    isLoading: loadingMenunggu,
    refetch: refetchMenunggu,
  } = useGetKurirMenunggu();

  const { data: dataProses, isLoading: loadingProses } = useGetKurirProses();
  const { data: dataSelesai, isLoading: loadingSelesai } = useGetKurirSelesai();

  const { data: listKurir } = useGetListKurir();

  const mutation = usePutAmbilJob();

  useEffect(() => {
    refetchMenunggu();
  }, []);

  // ================= STATE =================
  const [selectedJob, setSelectedJob] = useState<KurirMenunggu | null>(null);
  const [selectedKurirId, setSelectedKurirId] = useState("");

  // 🔥 DETAIL SELESAI
  const [selectedSelesai, setSelectedSelesai] =
    useState<KurirSelesaiResponse | null>(null);

  const handleClose = () => {
    setSelectedJob(null);
    setSelectedKurirId("");
    setSelectedSelesai(null);
  };

  const handleConfirmAmbil = () => {
    if (!selectedJob || !selectedKurirId) return;

    mutation.mutate(
      {
        idProsesStokPotong: selectedJob.idProsesStokPotong,
        idKurir: selectedKurirId,
      },
      {
        onSuccess: () => handleClose(),
      },
    );
  };

  // ================= DATA =================
  const getData = () => {
    if (activeTab === "menunggu") return dataMenunggu || [];
    if (activeTab === "proses") return dataProses || [];
    if (activeTab === "selesai") return paginatedSelesai;
    return [];
  };

  const isLoading =
    (activeTab === "menunggu" && loadingMenunggu) ||
    (activeTab === "proses" && loadingProses) ||
    (activeTab === "selesai" && loadingSelesai);

  const countMenunggu = dataMenunggu?.length || 0;
  const countProses = dataProses?.length || 0;
  const countSelesai = dataSelesai?.length || 0;

  // 🔥 FILTER SELESAI
  const filteredSelesai =
    activeTab === "selesai"
      ? (dataSelesai || []).filter((item: any) =>
          `${item.namaBarang} ${item.dikirimKe} ${item.dikirimDari}`
            .toLowerCase()
            .includes(searchSelesai.toLowerCase()),
        )
      : dataSelesai || [];

  // 🔥 PAGINATION SELESAI
  const totalPagesSelesai = Math.ceil(
    filteredSelesai.length / itemsPerPageSelesai,
  );

  const paginatedSelesai = filteredSelesai.slice(
    (currentPageSelesai - 1) * itemsPerPageSelesai,
    currentPageSelesai * itemsPerPageSelesai,
  );

  // ================= UI =================
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-orange-50">
      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r p-5 hidden md:flex flex-col">
        <h1 className="text-lg font-semibold mb-6">Kurir Panel</h1>

        <div className="space-y-2">
          {["menunggu", "proses", "selesai"].map((menu) => (
            <button
              key={menu}
              onClick={() => setActiveTab(menu as TabType)}
              className={`w-full text-left px-4 py-2 rounded-xl capitalize ${
                activeTab === menu
                  ? "bg-orange-400 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {menu}
            </button>
          ))}
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
        {/* CARDS */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card title="Menunggu" count={countMenunggu} />
          <Card title="Proses" count={countProses} />
          <Card title="Selesai" count={countSelesai} icon={<CheckCircle />} />
        </div>

        {/* LIST */}
        <div
          key={activeTab === "selesai" ? currentPageSelesai : activeTab}
          className="bg-gray-50 p-4 rounded-xl"
        >
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
            {activeTab === "selesai" && (
              <input
                placeholder="Search nama / tujuan / asal..."
                value={searchSelesai}
                onChange={(e) => {
                  setSearchSelesai(e.target.value);
                  setCurrentPageSelesai(1);
                }}
                className="w-full md:w-72 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            )}
            <h3 className="font-semibold capitalize text-lg">
              Data {activeTab}
            </h3>

            <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
              {activeTab === "selesai"
                ? filteredSelesai.length
                : getData().length}{" "}
              item
            </span>
          </div>

          {isLoading ? (
            <p>Loading...</p>
          ) : (
            getData().map((job: any) => (
              <div
                key={`${job.idProsesStokPotong}-${currentPageSelesai}`}
                onClick={() =>
                  activeTab === "selesai" && setSelectedSelesai(job)
                }
                className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-4 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                {/* HEADER */}
                <div className="flex justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {job.namaBarang}
                    </p>

                    {activeTab === "selesai" && (
                      <p className="text-[10px] text-gray-400 uppercase">
                        {job.status?.replaceAll("_", " ")}
                      </p>
                    )}
                  </div>

                  <p className="text-lg font-bold">
                    {job.jumlah || job.jumlahLolos}
                  </p>
                </div>

                {/* DETAIL KHUSUS SELESAI */}
                {activeTab === "selesai" && (
                  <div className="text-xs text-gray-600 border-t pt-2 mt-2 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Dari:</span>
                      <span className="font-medium">{job.dikirimDari}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-400">Tujuan:</span>
                      <span className="font-medium">{job.dikirimKe}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-400">Selesai:</span>
                      <span>
                        {new Date(job.tanggalSampai).toLocaleDateString(
                          "id-ID",
                        )}
                      </span>
                    </div>
                  </div>
                )}

                {/* BUTTON MENUNGGU */}
                {activeTab === "menunggu" && (
                  <div className="text-right mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedJob(job);
                      }}
                      className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 py-1.5 text-xs rounded-lg font-semibold hover:scale-105 active:scale-95 transition"
                    >
                      Ambil
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
          {activeTab === "selesai" && totalPagesSelesai > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() =>
                  setCurrentPageSelesai((prev) => Math.max(prev - 1, 1))
                }
                className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm"
              >
                Prev
              </button>

              {Array.from({ length: totalPagesSelesai }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPageSelesai(i + 1)}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    currentPageSelesai === i + 1
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPageSelesai((prev) =>
                    Math.min(prev + 1, totalPagesSelesai),
                  )
                }
                className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODAL DETAIL SELESAI */}
      {selectedSelesai && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={handleClose}
        >
          <div
            className="bg-white p-5 rounded-sm w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold mb-4">Detail Pengiriman</h3>

            <p className="font-semibold mb-2">{selectedSelesai.namaBarang}</p>

            <div className="text-sm space-y-2">
              <p>Jumlah: {selectedSelesai.jumlah} pcs</p>
              <p>Kurir: {selectedSelesai.namaKurir}</p>

              <hr />

              <p>Dari: {selectedSelesai.dikirimDari}</p>
              <p>Ke: {selectedSelesai.dikirimKe}</p>
              <p>
                Waktu:
                {new Date(selectedSelesai.tanggalSampai).toLocaleString(
                  "id-ID",
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ title, count }: any) {
  const color =
    title === "Menunggu"
      ? "text-yellow-500"
      : title === "Proses"
        ? "text-blue-500"
        : "text-green-500";

  return (
    <div className="bg-white/70 p-4 rounded-2xl shadow text-center">
      <p className="text-xs text-gray-500">{title}</p>
      <p className={`text-2xl font-bold ${color}`}>{count}</p>
    </div>
  );
}
