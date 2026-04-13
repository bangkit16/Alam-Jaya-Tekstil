"use client";

import { useState } from "react";

type Props = {
  jobs: any[];
  setJobs: React.Dispatch<React.SetStateAction<any[]>>;
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
};

export default function Menunggu({ jobs, setJobs, form, setForm }: Props) {
  const [selected, setSelected] = useState<any>(null);

  // 🔥 DUMMY DATA (TETAP PUNYA KAMU)
  const data = [
    {
      id: "1",
      nama: "Hoodie Green Navy - L",
      qty: 31,
    },
  ];

  const handleClose = () => {
    setSelected(null);
  };

  return (
    <>
      {/* ================= LIST ================= */}
      <div className="flex flex-col gap-3">
        {data.map((job) => (
          <div
            key={job.id}
            onClick={() => setSelected(job)}
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
              <li>• Tanggal kirim</li>
            </ul>
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {selected && (
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
                {selected.nama}
              </p>

              <p className="text-lg font-bold text-gray-900">{selected.qty}</p>
            </div>

            {/* DETAIL */}
            <ul className="text-xs text-gray-700 space-y-1 mb-6">
              <li>•</li>
              <li>• Kode stok potongan</li>
              <li>• tanggal kirim</li>
            </ul>

            {/* BUTTON */}
            <div className="flex gap-2">
              <button
                onClick={handleClose}
                className="flex-1 bg-gray-800 text-white text-xs py-2 rounded-sm"
              >
                PROSES
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
