"use client";

import { useState } from "react";

export default function Menunggu({ jobs, setJobs, form, setForm }: any) {
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const data = jobs.filter((j: any) => j.status === "menunggu");

  const handleClose = () => {
    setSelectedJob(null);
    setForm({ ...form, kurir: "" });
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
            <ul className="text-xs text-gray-700 space-y-1 mb-4">
              <li>• Kode stok potongan</li>
              <li>• Nama penjahit tujuan</li>
            </ul>

            {/* INPUT */}
            <input
              placeholder="Nama Kurir"
              value={form.kurir}
              onChange={(e) => setForm({ ...form, kurir: e.target.value })}
              className="w-full bg-gray-100 px-3 py-2 text-xs outline-none mb-4"
            />

            {/* BUTTON */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setJobs((prev: any) =>
                    prev.map((j: any) =>
                      j.id === selectedJob.id
                        ? {
                            ...j,
                            status: "proses",
                            kurir: form.kurir,
                          }
                        : j,
                    ),
                  );
                  handleClose();
                }}
                className="flex-1 bg-gray-800 text-white text-xs py-2 rounded-sm active:scale-95"
              >
                AMBIL JOB
              </button>

              <button
                onClick={handleClose}
                className="flex-1 bg-gray-300 text-gray-800 text-xs py-2 rounded-sm active:scale-95"
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
