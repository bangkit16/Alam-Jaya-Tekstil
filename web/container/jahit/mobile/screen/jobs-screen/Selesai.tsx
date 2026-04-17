"use client";

import { useState } from "react";
import {
  useGetPenjahitSelesai,
  PenjahitSelesai,
} from "@/services/jahit/useGetPenjahitSelesai";

export default function Selesai() {
  const [selected, setSelected] = useState<PenjahitSelesai | null>(null);

  // 🔥 Integrasi Service
  const { data: apiData = [], isLoading } = useGetPenjahitSelesai();

  const handleClose = () => {
    setSelected(null);
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center text-xs text-gray-500 italic">
        Memuat riwayat...
      </div>
    );
  }

  return (
    <>
      {/* ================= LIST ================= */}
      <div className="flex flex-col gap-3">
        {apiData.length === 0 ? (
          <div className="p-8 text-center border border-dashed text-gray-400 text-xs">
            Belum ada riwayat pekerjaan selesai.
          </div>
        ) : (
          apiData.map((job) => (
            <div
              key={job.idProsesStokPotong}
              onClick={() => setSelected(job)}
              className={` border border-gray-300 rounded-sm p-3 cursor-pointer hover:bg-gray-50 transition-colors`}
            >
              {job.isUrgent && (
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-bold text-red-600">URGENT</p>
                </div>
              )}
              {/* HEADER */}
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-800">
                  {job.namaBarang} - {job.ukuran}
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {job.jumlahSelesai}
                </p>
              </div>

              {/* DETAIL RINGKAS */}
              <ul className="text-xs text-gray-700 space-y-1">
                <li>
                  Kode Potongan : {job.kodeStokPotongan}
                </li>
                <li>
                  Selesai pada :{" "}
                  {new Date(job.tanggalSelesai).toLocaleString("id-ID")}
                </li>
                {job.catatan && (
                  <li className="text-gray-500 italic">
                    • Catatan: {job.catatan}{" "}
                  </li>
                )}
              </ul>
            </div>
          ))
        )}
      </div>

      {/* ================= MODAL DETAIL ================= */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          onClick={handleClose}
        >
          <div
            className="bg-white p-5 w-full max-w-sm shadow-xl rounded-sm"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            {/* <div className="flex justify-between items-center mb-4 border-b pb-2">
              <p className="text-sm font-bold text-gray-800 uppercase tracking-tight">
                Detail Pekerjaan
              </p>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-black"
              >
                ✕
              </button>
            </div> */}
            {selected.isUrgent && (
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-bold text-red-600">URGENT</p>
              </div>
            )}

            <div className="flex justify-between items-center mb-4">
              <p className="text-sm font-medium text-gray-800">
                {selected.namaBarang} - {selected.ukuran}
              </p>
              <p className="text-xl font-black text-gray-900">
                {selected.jumlahSelesai}
              </p>
            </div>

            {/* DETAIL DATA */}
            <ul className="text-xs text-gray-700 space-y-3 mb-6">
              <li className="flex justify-between border-b border-gray-50 pb-1">
                <span className="text-gray-400 font-medium">Kode Potongan</span>
                <span className="font-mono font-bold">
                  {selected.kodeStokPotongan}
                </span>
              </li>
              <li className="flex justify-between border-b border-gray-50 pb-1">
                <span className="text-gray-400 font-medium">Waktu Selesai</span>
                <span>
                  {new Date(selected.tanggalSelesai).toLocaleString("id-ID")}
                </span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-gray-400 font-medium font-bold">
                  Catatan:
                </span>
                <p className="p-2 bg-gray-50 rounded-sm italic text-gray-600 border-l-2 border-gray-300">
                  {selected.catatan || "Tidak ada catatan."}
                </p>
              </li>
            </ul>

            <button
              onClick={handleClose}
              className="w-full bg-gray-800 text-white text-xs py-2.5 rounded-sm font-bold active:scale-95 transition-all"
            >
              TUTUP
            </button>
          </div>
        </div>
      )}
    </>
  );
}
