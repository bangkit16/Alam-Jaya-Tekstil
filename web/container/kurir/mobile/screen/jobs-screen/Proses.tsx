"use client";

import { useState } from "react";

export default function Proses({ jobs = [], setJobs }: any) {
  const [selectedJob, setSelectedJob] = useState<any>(null);

  // 🔥 DUMMY FALLBACK
  const DUMMY = [
    {
      id: "dummy-1",
      nama: "Hoodie Green Navy - L",
      qty: 31,
      status: "proses",
    },
  ];

  // ambil data asli, kalau kosong pakai dummy
  const data =
    jobs.filter((j: any) => j.status === "proses").length > 0
      ? jobs.filter((j: any) => j.status === "proses")
      : DUMMY;

  const handleClose = () => {
    setSelectedJob(null);
  };

  return (
    <>
      {/* ================= LIST ================= */}
      <div className="flex flex-col gap-3">
        {data.map((job: any) => (
          <div
            key={job.id}
            onClick={() => setSelectedJob(job)}
            className="border border-gray-300 rounded-sm p-3 cursor-pointer hover:bg-gray-50"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium text-gray-800">{job.nama}</p>

              <p className="text-lg font-bold text-gray-900">{job.qty}</p>
            </div>

            {/* DETAIL */}
            <ul className="text-xs text-gray-700 space-y-1">
              <li>• Kode stok potongan</li>
              <li>• Nama penjahit tujuan</li>
              <li>• tanggal berangkat</li>
            </ul>
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {selectedJob && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          onClick={handleClose}
        >
          <div
            className="bg-white p-4 w-full max-w-sm shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-medium text-gray-800">
                {selectedJob.nama}
              </p>

              <p className="text-lg font-bold text-gray-900">
                {selectedJob.qty}
              </p>
            </div>

            {/* DETAIL */}
            <ul className="text-xs text-gray-700 space-y-1 mb-6">
              <li>• Kode stok potongan</li>
              <li>• Nama penjahit tujuan</li>
              <li>• Tanggal berangkat</li>
            </ul>

            {/* BUTTON */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setJobs?.((prev: any) =>
                    prev.map((j: any) =>
                      j.id === selectedJob.id ? { ...j, status: "selesai" } : j,
                    ),
                  );
                  handleClose();
                }}
                className="flex-1 bg-gray-800 text-white text-xs py-2 rounded-sm"
              >
                SELESAI
              </button>

              <button
                onClick={handleClose}
                className="flex-1 bg-gray-300 text-gray-800 text-xs py-2 rounded-sm"
              >
                TIDAK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
