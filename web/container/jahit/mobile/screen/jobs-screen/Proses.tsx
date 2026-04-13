"use client";

import { useState } from "react";

type Props = {
  jobs: any[];
  setJobs: React.Dispatch<React.SetStateAction<any[]>>;
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
};

export default function Proses({ jobs, setJobs, form, setForm }: Props) {
  const [selected, setSelected] = useState<any>(null);

  const [localForm, setLocalForm] = useState({
    selesai: "",
    catatan: "",
  });

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
    setLocalForm({ selesai: "", catatan: "" });
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
              <li>• tanggal kirim</li>
              <li>• tanggal mulai jahit</li>
              <li>• status (dikerjakan, delay)</li>
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

            {/* INPUT */}
            <div className="space-y-2 mb-4">
              <input
                placeholder="Jumlah selesai jahit {selesai 25}"
                value={localForm.selesai}
                onChange={(e) =>
                  setLocalForm({
                    ...localForm,
                    selesai: e.target.value,
                  })
                }
                className="w-full bg-gray-100 px-3 py-2 text-xs outline-none"
              />

              <input
                placeholder="Catatan (optional)"
                value={localForm.catatan}
                onChange={(e) =>
                  setLocalForm({
                    ...localForm,
                    catatan: e.target.value,
                  })
                }
                className="w-full bg-gray-100 px-3 py-2 text-xs outline-none"
              />
            </div>

            {/* BUTTON TOP */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={handleClose}
                className="flex-1 bg-gray-400 text-white text-xs py-2 rounded-sm"
              >
                JEDA
              </button>

              <button
                onClick={handleClose}
                className="flex-1 bg-gray-600 text-white text-xs py-2 rounded-sm"
              >
                PROSES
              </button>
            </div>

            {/* BUTTON BOTTOM */}
            <div className="flex gap-2">
              <button
                onClick={handleClose}
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
