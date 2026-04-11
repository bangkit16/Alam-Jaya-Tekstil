"use client";

import { useState } from "react";

type prosesType = {
  id_permintaan: string;
  nama_produk: string;
  kode_kain: string;
  jumlah: number;
  ukuran: "M" | "L" | "XL" | "XXL";
  user_id: string;
  is_urgent: boolean;
  pengecek: string;
  pemotong: string;
};

// ================= DUMMY DATA =================
const DUMMY_PROSES: prosesType[] = [
  {
    id_permintaan: "1",
    nama_produk: "Hoodie Green",
    kode_kain: "HD-GREEN",
    jumlah: 20,
    ukuran: "L",
    user_id: "user1",
    is_urgent: false,
    pengecek: "-",
    pemotong: "-",
  },
];

export default function Proses() {
  const [selectedProses, setSelectedProses] = useState<prosesType | null>(null);

  // dummy form state
  const [form, setForm] = useState({
    kode_potongan: "",
    jumlah_lolos: "",
    pengecek: "",
  });

  const handleSelectProses = (proses: prosesType) => {
    setSelectedProses(proses);
    setForm({
      kode_potongan: proses.kode_kain,
      jumlah_lolos: "",
      pengecek: "",
    });
  };

  const handleCloseModal = () => {
    setSelectedProses(null);
    setForm({
      kode_potongan: "",
      jumlah_lolos: "",
      pengecek: "",
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    console.log("DATA SUBMIT:", {
      id: selectedProses?.id_permintaan,
      ...form,
    });

    handleCloseModal();
  };

  return (
    <>
      {/* ================= LIST ================= */}
      <div className="flex flex-col gap-3 overflow-y-auto">
        {DUMMY_PROSES.length > 0 ? (
          DUMMY_PROSES.map((proses, index) => (
            <div
              key={`${proses.id_permintaan}-${index}`}
              onClick={() => handleSelectProses(proses)}
              className="border border-gray-300 rounded-2xl p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50"
            >
              <div className="flex-row w-full justify-between align-middle items-center">
                {proses.is_urgent && (
                  <p className="text-red-500 text-sm uppercase font-semibold">
                    Urgent
                  </p>
                )}

                <p className="text-sm font-semibold text-gray-800 my-1">
                  {proses.nama_produk} - {proses.ukuran}
                </p>

                <div className="space-y-0.5">
                  <p className="text-xs font-medium text-gray-400 uppercase">
                    KODE PRODUK :{" "}
                    <span className="font-bold text-gray-600">
                      {proses.kode_kain}
                    </span>
                  </p>

                  <p className="text-xs font-medium text-gray-400 uppercase">
                    PEMOTONG :{" "}
                    <span className="font-bold text-gray-600">
                      {proses.pemotong}
                    </span>
                  </p>

                  <p className="text-xs font-medium text-gray-400 uppercase">
                    PENGECEK :{" "}
                    <span className="font-bold text-gray-600">
                      {proses.pengecek}
                    </span>
                  </p>
                </div>
              </div>

              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-800">
                  {proses.jumlah}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-500 font-medium">Data Kosong</p>
          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {selectedProses && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          onClick={handleCloseModal}
        >
          <form
            className="bg-white p-5 rounded-2xl w-full max-w-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
          >
            {/* HEADER */}
            <div className="flex justify-between items-start mb-3">
              <p className="text-sm font-semibold text-gray-800 leading-snug">
                {selectedProses.nama_produk} - {selectedProses.ukuran}
              </p>

              <p className="text-lg font-bold text-gray-900">
                {selectedProses.jumlah}
              </p>
            </div>

            {/* DIVIDER */}
            <div className="h-px bg-gray-200 mb-4" />

            {/* INPUT */}
            <div className="space-y-3">
              <input
                value={form.kode_potongan}
                onChange={(e) =>
                  setForm({ ...form, kode_potongan: e.target.value })
                }
                placeholder="Kode Kain"
                className="w-full bg-gray-100 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400"
              />

              <input
                value={form.pengecek}
                onChange={(e) => setForm({ ...form, pengecek: e.target.value })}
                placeholder="Pemotong / Pengecek"
                className="w-full bg-gray-100 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400"
              />

              <input
                value={form.jumlah_lolos}
                onChange={(e) =>
                  setForm({ ...form, jumlah_lolos: e.target.value })
                }
                placeholder="Jumlah hasil"
                className="w-full bg-gray-100 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* BUTTON */}
            <div className="flex justify-end mt-5">
              <button
                type="submit"
                className="bg-gradient-to-r from-orange-400 to-amber-500 text-white text-xs px-5 py-2 rounded-xl font-semibold shadow hover:opacity-90 active:scale-95 transition"
              >
                SELESAI
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
