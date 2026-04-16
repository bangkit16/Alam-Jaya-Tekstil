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
    if (activeTab === "selesai") return dataSelesai || [];
    return [];
  };

  const isLoading =
    (activeTab === "menunggu" && loadingMenunggu) ||
    (activeTab === "proses" && loadingProses) ||
    (activeTab === "selesai" && loadingSelesai);

  const countMenunggu = dataMenunggu?.length || 0;
  const countProses = dataProses?.length || 0;
  const countSelesai = dataSelesai?.length || 0;

  // ================= UI =================
  return (
    <div className="flex min-h-screen bg-gray-100">
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
        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="mb-4 capitalize">Data {activeTab}</h3>

          {isLoading ? (
            <p>Loading...</p>
          ) : (
            getData().map((job: any) => (
              <div
                key={job.idProsesStokPotong}
                onClick={() =>
                  activeTab === "selesai" && setSelectedSelesai(job)
                }
                className="border border-gray-300 rounded-sm p-3 mb-3 cursor-pointer hover:bg-gray-50"
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
                      className="bg-orange-400 text-white px-2 py-1 text-xs rounded"
                    >
                      Ambil
                    </button>
                  </div>
                )}
              </div>
            ))
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

function Card({ title, count, icon }: any) {
  return (
    <div className="bg-white p-4 rounded-xl flex gap-2">
      {icon || <Truck />}
      <div>
        <p className="text-xs">{title}</p>
        <h3 className="font-bold">{count}</h3>
      </div>
    </div>
  );
}
