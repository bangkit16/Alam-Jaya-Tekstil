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

import { useQueryClient } from "@tanstack/react-query";

type TabType = "menunggu" | "proses" | "selesai";

export default function PenjahitWeb({ handleLogout }: any) {
  //
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<TabType>("menunggu");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [jumlahSelesai, setJumlahSelesai] = useState("");
  const [catatan, setCatatan] = useState("");

  // 🔥 SEARCH + PAGINATION SELESAI
  const [searchSelesai, setSearchSelesai] = useState("");
  const [currentPageSelesai, setCurrentPageSelesai] = useState(1);
  const itemsPerPageSelesai = 5;

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
    if (activeTab === "selesai") return paginatedSelesai;
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

    // ✅ 1. UPDATE UI LANGSUNG (INI YANG KAMU TANYA TARUH DIMANA)
    queryClient.setQueryData(["penjahit", "proses"], (old: any) =>
      old?.map((item: any) =>
        item.idProsesStokPotong === selectedOrder.idProsesStokPotong
          ? { ...item, status: "JEDA" }
          : item,
      ),
    );

    // ✅ 2. HIT API
    await mutationJeda.mutateAsync(selectedOrder.idProsesStokPotong);

    // ✅ 3. SYNC DENGAN SERVER
    queryClient.invalidateQueries({
      queryKey: ["penjahit", "proses"],
    });

    setSelectedOrder(null);
  };
  const handleDikerjakan = async () => {
    if (!selectedOrder) return;

    // ✅ UPDATE UI LANGSUNG
    queryClient.setQueryData(["penjahit", "proses"], (old: any) =>
      old?.map((item: any) =>
        item.idProsesStokPotong === selectedOrder.idProsesStokPotong
          ? { ...item, status: "DIKERJAKAN" }
          : item,
      ),
    );

    await mutationDikerjakan.mutateAsync(selectedOrder.idProsesStokPotong);

    queryClient.invalidateQueries({
      queryKey: ["penjahit", "proses"],
    });

    setSelectedOrder(null);
  };

  const handleSelesai = async () => {
    if (!selectedOrder) return;

    await mutationSelesai.mutateAsync({
      id: selectedOrder.idProsesStokPotong,
      jumlahSelesaiJahit: Number(jumlahSelesai),
      catatan,
    });

    queryClient.invalidateQueries({
      queryKey: ["penjahit", "proses"],
    });

    queryClient.invalidateQueries({
      queryKey: ["penjahit", "selesai"],
    });
    setSelectedOrder(null);
    setJumlahSelesai("");
    setCatatan("");
  };

  // ================= COUNT =================
  const countMenunggu = dataMenunggu.length;
  const countProses = dataProses.length;
  const countSelesai = dataSelesai.length;

  // 🔥 FILTER SELESAI
  const filteredSelesai =
    activeTab === "selesai"
      ? dataSelesai.filter((item: any) =>
          `${item.namaBarang} ${item.kodeStokPotongan}`
            .toLowerCase()
            .includes(searchSelesai.toLowerCase()),
        )
      : dataSelesai;

  // 🔥 PAGINATION SELESAI
  const totalPagesSelesai = Math.ceil(
    filteredSelesai.length / itemsPerPageSelesai,
  );

  const paginatedSelesai = filteredSelesai.slice(
    (currentPageSelesai - 1) * itemsPerPageSelesai,
    currentPageSelesai * itemsPerPageSelesai,
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-orange-50">
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
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
            <h3 className="capitalize">Data {activeTab}</h3>

            {activeTab === "selesai" && (
              <input
                placeholder="Search nama / kode..."
                value={searchSelesai}
                onChange={(e) => {
                  setSearchSelesai(e.target.value);
                  setCurrentPageSelesai(1);
                }}
                className="w-full md:w-72 bg-white border border-gray-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            )}
          </div>

          <div className="space-y-3">
            {getData().map((job: any) => (
              <div
                key={`${job.idProsesStokPotong}-${currentPageSelesai}`}
                onClick={() => {
                  if (activeTab === "menunggu" || activeTab === "proses") {
                    setSelectedOrder(job);
                  }
                }}
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
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>• Kode: {job.kodeStokPotongan}</p>
                    <p>
                      • Dikirim:{" "}
                      {new Date(job.tanggalKirim).toLocaleDateString("id-ID")}
                    </p>
                  </div>
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

      {/* ================= MODAL MENUNGGU ================= */}
      {selectedOrder && activeTab === "menunggu" && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white/90 backdrop-blur-xl p-5 w-full max-w-sm rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            {selectedOrder.isUrgent && (
              <p className="text-red-500 font-bold text-xs mb-1">URGENT</p>
            )}

            <div className="flex justify-between items-center mb-3">
              <p className="font-semibold text-gray-800">
                {selectedOrder.namaBarang} - {selectedOrder.ukuran}
              </p>

              <p className="text-xl font-bold">{selectedOrder.jumlah}</p>
            </div>

            <div className="h-px bg-gray-200 mb-3" />

            {/* DETAIL */}
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Kode Stok</span>
                <span className="font-medium">
                  {selectedOrder.kodeStokPotongan}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Tanggal Kirim</span>
                <span>
                  {new Date(selectedOrder.tanggalKirim).toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            {/* BUTTON */}
            <div className="flex gap-3 mt-5">
              <button
                onClick={handleProsesAPI}
                className="flex-1 bg-orange-500 text-white py-2 rounded-xl font-semibold"
              >
                PROSES
              </button>

              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 bg-gray-200 text-gray-600 py-2 rounded-xl font-semibold"
              >
                TIDAK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL PROSES ================= */}
      {selectedOrder && activeTab === "proses" && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white/90 backdrop-blur-xl p-5 w-full max-w-sm rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            {selectedOrder.isUrgent && (
              <p className="text-red-500 font-bold text-xs mb-1">URGENT</p>
            )}

            <div className="flex justify-between items-center mb-3">
              <p className="font-semibold text-gray-800">
                {selectedOrder.namaBarang} - {selectedOrder.ukuran}
              </p>

              <p className="text-xl font-bold">
                {selectedOrder.jumlahLolos || selectedOrder.jumlah}
              </p>
            </div>

            <div className="h-px bg-gray-200 mb-3" />

            {/* DETAIL */}
            <div className="text-sm text-gray-600 space-y-2 mb-4">
              <p>Kode Stok: {selectedOrder.kodeStokPotongan}</p>
              <p>
                Tanggal Mulai Jahit:{" "}
                {new Date(selectedOrder.tanggalMulaiJahit).toLocaleString(
                  "id-ID",
                )}
              </p>

              <p>
                Status:{" "}
                <span className="text-blue-600 font-bold">
                  {selectedOrder.status}
                </span>
              </p>
            </div>

            {/* INPUT */}
            <div className="space-y-3">
              <input
                placeholder="Jumlah selesai"
                value={jumlahSelesai}
                onChange={(e) => setJumlahSelesai(e.target.value)}
                className="w-full bg-gray-100 px-3 py-2 rounded-xl text-sm"
              />

              <input
                placeholder="Catatan (optional)"
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                className="w-full bg-gray-100 px-3 py-2 rounded-xl text-sm"
              />
            </div>

            {/* BUTTON */}
            <div className="space-y-2 mt-5">
              <button
                onClick={handleSelesai}
                className="w-full bg-orange-500 text-white py-2 rounded-xl font-semibold"
              >
                KONFIRMASI SELESAI
              </button>

              <div className="flex gap-2">
                {selectedOrder.status === "DIKERJAKAN" ? (
                  <button
                    onClick={handleJeda}
                    className="flex-1 bg-yellow-500 text-white py-2 rounded-xl text-sm font-semibold"
                  >
                    JEDA
                  </button>
                ) : (
                  <button
                    onClick={handleDikerjakan}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-xl text-sm font-semibold"
                  >
                    LANJUTKAN
                  </button>
                )}

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 bg-gray-200 text-gray-600 py-2 rounded-xl text-sm font-semibold"
                >
                  BATAL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

function Stat({ title, value }: any) {
  const color =
    title === "Menunggu"
      ? "text-yellow-500"
      : title === "Proses"
        ? "text-blue-500"
        : "text-green-500";

  return (
    <div className="bg-white/70 p-4 rounded-2xl shadow text-center">
      <p className="text-xs text-gray-500">{title}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
