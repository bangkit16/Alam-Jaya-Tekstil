"use client";

import { useState } from "react";
import {
  useGetKurirSelesai,
  KurirSelesaiResponse,
} from "@/services/kurir/useGetKurirSelesai"; // Sesuaikan path

export default function Selesai() {
  const [selectedJob, setSelectedJob] = useState<KurirSelesaiResponse | null>(
    null,
  );

  // Menggunakan Hook TanStack Query
  const { data: jobs = [], isLoading, isError, refetch } = useGetKurirSelesai();

  const handleClose = () => {
    setSelectedJob(null);
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center text-sm text-gray-500">
        Memuat data pengiriman...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-red-500 mb-2">Gagal memuat data.</p>
        <button
          onClick={() => refetch()}
          className="text-xs bg-gray-100 px-3 py-1 rounded-sm border"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <>
      {/* ================= LIST ================= */}
      <div className="flex flex-col gap-3">
        {jobs.length === 0 ? (
          <div className="text-center py-10 border border-dashed text-gray-400 text-sm">
            Tidak ada riwayat pengiriman selesai.
          </div>
        ) : (
          jobs.map((job) => (
            <div
              key={job.idProsesStokPotong}
              onClick={() => setSelectedJob(job)}
              className="border border-gray-300 rounded-sm p-3 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              {/* HEADER */}
              <div className="flex justify-between items-start mb-2">
                {/* {job.isUrgent && (
                  
                )} */}
                <div>
                  <p className="text-sm font-medium text-gray-800 leading-tight">
                    {job.namaBarang}
                  </p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                    {job.status.replaceAll("_", " ")}
                  </p>
                </div>
                <p className="text-lg font-bold text-gray-900">{job.jumlah}</p>
              </div>

              {/* DETAIL RINGKAS */}
              <ul className="text-xs text-gray-600 space-y-1 border-t pt-2 mt-2">
                <li className="flex justify-between">
                  <span className="text-gray-400">Dari:</span>
                  <span className="font-medium">{job.dikirimDari}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-400">Tujuan:</span>
                  <span className="font-medium">{job.dikirimKe}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-400">Selesai:</span>
                  <span>
                    {new Date(job.tanggalSampai).toLocaleDateString("id-ID")}
                  </span>
                </li>
              </ul>
            </div>
          ))
        )}
      </div>

      {/* ================= MODAL DETAIL ================= */}
      {selectedJob && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 backdrop-blur-sm"
          onClick={handleClose}
        >
          <div
            className="bg-white p-5 w-full max-w-sm shadow-2xl rounded-sm"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h3 className="font-bold text-gray-800">Detail Pengiriman</h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-black"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-gray-400 uppercase font-bold">
                  Produk
                </label>
                <p className="text-sm font-semibold">
                  {selectedJob.namaBarang} 
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-gray-400 uppercase font-bold">
                    Jumlah
                  </label>
                  <p className="text-sm font-semibold">
                    {selectedJob.jumlah} Pcs
                  </p>
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 uppercase font-bold">
                    Kurir
                  </label>
                  <p className="text-sm font-semibold">
                    {selectedJob.namaKurir}
                  </p>
                </div>
              </div>

              <hr />

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Dari:</span>
                  <span className="font-medium text-right">
                    {selectedJob.dikirimDari}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Ke:</span>
                  <span className="font-medium text-right">
                    {selectedJob.dikirimKe}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Waktu Sampai:</span>
                  <span className="font-medium text-right">
                    {new Date(selectedJob.tanggalSampai).toLocaleString(
                      "id-ID",
                      {
                        dateStyle: "medium",
                        timeStyle: "short",
                      },
                    )}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="bg-gray-50 p-2 text-[10px] font-mono text-gray-400 break-all">
                  ID: {selectedJob.idProsesStokPotong}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
