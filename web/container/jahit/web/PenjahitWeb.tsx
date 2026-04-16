"use client";

import { useState } from "react";
import { Package, ClipboardList, CheckCircle } from "lucide-react";

// 🔥 API
import { useGetPenjahitMenunggu } from "@/services/jahit/useGetPenjahitMenunggu";
import { useGetPenjahitProses } from "@/services/jahit/useGetPenjahitProses";
import { useGetPenjahitSelesai } from "@/services/jahit/useGetPenjahitSelesai";

import { usePutMulaiJahit } from "@/services/jahit/usePutMulaiJahit";
import { usePutDikerjakan } from "@/services/jahit/usePutDikerjakan";
import { usePutJeda } from "@/services/jahit/usePutJeda";
import { usePutSelesaiJahit } from "@/services/jahit/usePutSelesaiJahit";

type TabType = "menunggu" | "proses" | "selesai";

export default function PenjahitWeb({ handleLogout }: any) {
  const [activeTab, setActiveTab] = useState<TabType>("menunggu");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [jumlahSelesai, setJumlahSelesai] = useState("");
  const [catatan, setCatatan] = useState("");

  // ================= API =================
  const { data: dataMenunggu = [] } = useGetPenjahitMenunggu();
  const { data: dataProses = [] } = useGetPenjahitProses();
  const { data: dataSelesai = [] } = useGetPenjahitSelesai();

  const mutationMulai = usePutMulaiJahit();
  const mutationJeda = usePutJeda();
  const mutationDikerjakan = usePutDikerjakan();
  const mutationSelesai = usePutSelesaiJahit();

  // ================= DATA =================
  const getData = () => {
    if (activeTab === "menunggu") return dataMenunggu;
    if (activeTab === "proses") return dataProses;
    if (activeTab === "selesai") return dataSelesai;
    return [];
  };

  // ================= ACTION =================
  const handleProsesAPI = async () => {
    if (!selectedOrder) return;
    await mutationMulai.mutateAsync(selectedOrder.idProsesStokPotong);
    setSelectedOrder(null);
  };

  const handleJeda = async () => {
    if (!selectedOrder) return;
    await mutationJeda.mutateAsync(selectedOrder.idProsesStokPotong);
    setSelectedOrder(null);
  };

  const handleDikerjakan = async () => {
    if (!selectedOrder) return;
    await mutationDikerjakan.mutateAsync(selectedOrder.idProsesStokPotong);
    setSelectedOrder(null);
  };

  const handleSelesai = async () => {
    if (!selectedOrder) return;

    await mutationSelesai.mutateAsync({
      id: selectedOrder.idProsesStokPotong,
      jumlahSelesaiJahit: Number(jumlahSelesai),
      catatan,
    });

    setSelectedOrder(null);
    setJumlahSelesai("");
    setCatatan("");
  };

  // ================= COUNT =================
  const countMenunggu = dataMenunggu.length;
  const countProses = dataProses.length;
  const countSelesai = dataSelesai.length;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r p-5 hidden md:flex flex-col">
        <h1 className="text-lg font-semibold mb-6">Penjahit Panel</h1>

        {["menunggu", "proses", "selesai"].map((menu) => (
          <button
            key={menu}
            onClick={() => setActiveTab(menu as TabType)}
            className={`mb-2 px-4 py-2 rounded-xl text-left capitalize ${
              activeTab === menu
                ? "bg-orange-400 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {menu}
          </button>
        ))}

        <button
          onClick={handleLogout}
          className="mt-auto bg-red-50 text-red-500 py-2 rounded-xl"
        >
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6">
        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Stat icon={<Package />} title="Menunggu" value={countMenunggu} />
          <Stat icon={<ClipboardList />} title="Proses" value={countProses} />
          <Stat icon={<CheckCircle />} title="Selesai" value={countSelesai} />
        </div>

        {/* LIST */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="mb-4 capitalize">Data {activeTab}</h3>

          <div className="space-y-3">
            {getData().map((job: any) => (
              <div
                key={job.idProsesStokPotong}
                onClick={() => setSelectedOrder(job)}
                className={`border p-3 cursor-pointer ${
                  job.isUrgent
                    ? "border-red-300 bg-red-50/30"
                    : "border-gray-300"
                }`}
              >
                {job.isUrgent && (
                  <p className="text-xs text-red-600 font-bold mb-1">URGENT</p>
                )}

                <div className="flex justify-between mb-2">
                  <p className="text-sm font-medium">
                    {job.namaBarang} - {job.ukuran}
                  </p>
                  <p className="text-lg font-bold">
                    {job.jumlah || job.jumlahLolos || job.jumlahSelesai}
                  </p>
                </div>

                {/* ================= MENUNGGU ================= */}
                {activeTab === "menunggu" && (
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Kode: {job.kodeStokPotongan}</li>
                    <li>
                      • Dikirim:{" "}
                      {new Date(job.tanggalKirim).toLocaleString("id-ID")}
                    </li>
                  </ul>
                )}

                {/* ================= PROSES ================= */}
                {activeTab === "proses" && (
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Kode: {job.kodeStokPotongan}</li>
                    <li>
                      • Tanggal Mulai Jahit:{" "}
                      {new Date(job.tanggalMulaiJahit).toLocaleDateString(
                        "id-ID",
                      )}
                    </li>
                    <li>
                      • Status:{" "}
                      <span className="text-blue-600 font-bold">
                        {job.status}
                      </span>
                    </li>
                  </ul>
                )}

                {/* ================= SELESAI ================= */}
                {activeTab === "selesai" && (
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>
                      • Selesai pada:{" "}
                      {new Date(job.tanggalSelesai).toLocaleDateString("id-ID")}
                    </li>
                    {job.catatan && <li>• Catatan: {job.catatan}</li>}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {selectedOrder && activeTab === "selesai" && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white p-5 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold mb-3">Detail Pekerjaan</h3>

            {selectedOrder.isUrgent && (
              <p className="text-red-600 font-bold mb-2">URGENT</p>
            )}

            <div className="flex justify-between mb-4">
              <p>
                {selectedOrder.namaBarang} - {selectedOrder.ukuran}
              </p>
              <p className="font-bold">{selectedOrder.jumlahSelesai}</p>
            </div>

            <ul className="text-sm space-y-2 mb-4">
              <li>Kode: {selectedOrder.kodeStokPotongan}</li>
              <li>
                Waktu:{" "}
                {new Date(selectedOrder.tanggalSelesai).toLocaleString("id-ID")}
              </li>
              <li>Catatan: {selectedOrder.catatan || "-"}</li>
            </ul>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full bg-gray-800 text-white py-2"
            >
              TUTUP
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ icon, title, value }: any) {
  return (
    <div className="bg-white p-4 rounded-xl flex gap-2">
      {icon}
      <div>
        <p className="text-xs">{title}</p>
        <h3 className="font-bold">{value}</h3>
      </div>
    </div>
  );
}
