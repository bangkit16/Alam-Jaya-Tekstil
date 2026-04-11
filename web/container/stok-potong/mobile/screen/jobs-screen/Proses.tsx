"use client";

import { useState } from "react";

type permintaanType = {
  id_permintaan: string;
  nama_produk: string;
  jumlah: number;
  ukuran: "M" | "L" | "XL" | "XXL";
  user_id: string;
  is_urgent: boolean;
  status?: string;
};

// ================= DUMMY DATA =================
const DUMMY_DATA: permintaanType[] = [
  {
    id_permintaan: "1",
    nama_produk: "Hoodie Green Navy",
    jumlah: 35,
    ukuran: "L",
    user_id: "user-1",
    is_urgent: false,
    status: "proses",
  },
];

export default function Proses() {
  const [selectedPermintaan, setSelectedPermintaan] =
    useState<permintaanType | null>(null);

  const [form, setForm] = useState({
    pengecek: "",
    kode_potongan: "",
    jumlah_lolos: "",
    jumlah_reject: "",
    catatan: "",
  });

  const dataProses = DUMMY_DATA.filter((item) => item.status === "proses");

  const handleClose = () => {
    setSelectedPermintaan(null);
    setForm({
      pengecek: "",
      kode_potongan: "",
      jumlah_lolos: "",
      jumlah_reject: "",
      catatan: "",
    });
  };

  const handleSubmit = () => {
    console.log("DATA:", {
      ...form,
      id: selectedPermintaan?.id_permintaan,
    });

    handleClose();
  };

  return (
    <>
      {/* ================= LIST ================= */}
      <div className="flex flex-col flex-1 overflow-y-auto gap-3">
        {dataProses.length > 0 ? (
          dataProses.map((item, index) => (
            <div
              key={`${item.id_permintaan}-${index}`}
              onClick={() => setSelectedPermintaan(item)}
              className="border border-gray-300 rounded-2xl p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
            >
              <div>
                {item.is_urgent && (
                  <p className="text-red-500 text-xs font-bold uppercase">
                    Urgent
                  </p>
                )}

                <p className="text-sm font-semibold text-gray-800">
                  {item.nama_produk} - {item.ukuran}
                </p>
              </div>

              <p className="text-2xl font-bold text-gray-800">{item.jumlah}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-500 font-medium">Data Kosong</p>
          </div>
        )}
      </div>

      {/* ================= MODAL FORM ================= */}
      {selectedPermintaan && (
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
                {selectedPermintaan.nama_produk} - {selectedPermintaan.ukuran}
              </p>

              <p className="text-lg font-bold text-gray-900">
                {selectedPermintaan.jumlah}
              </p>
            </div>

            {/* FORM */}
            <div className="space-y-2">
              <input
                placeholder="Nama Pengecek"
                value={form.pengecek}
                onChange={(e) => setForm({ ...form, pengecek: e.target.value })}
                className="w-full bg-gray-100 px-3 py-2 text-xs outline-none"
              />

              <input
                placeholder="Kode Stok Potongan"
                value={form.kode_potongan}
                onChange={(e) =>
                  setForm({ ...form, kode_potongan: e.target.value })
                }
                className="w-full bg-gray-100 px-3 py-2 text-xs outline-none"
              />

              <input
                placeholder="Jumlah Potongan Yang Lolos (kirim 31)"
                value={form.jumlah_lolos}
                onChange={(e) =>
                  setForm({ ...form, jumlah_lolos: e.target.value })
                }
                className="w-full bg-gray-100 px-3 py-2 text-xs outline-none"
              />

              <input
                placeholder="Jumlah Potongan Reject ( Optional )"
                value={form.jumlah_reject}
                onChange={(e) =>
                  setForm({ ...form, jumlah_reject: e.target.value })
                }
                className="w-full bg-gray-100 px-3 py-2 text-xs outline-none"
              />

              <input
                placeholder="Catatan Potongan ( Optional )"
                value={form.catatan}
                onChange={(e) => setForm({ ...form, catatan: e.target.value })}
                className="w-full bg-gray-100 px-3 py-2 text-xs outline-none"
              />
            </div>

            {/* BUTTON */}
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSubmit}
                className="bg-gray-200 text-gray-700 text-xs px-4 py-1.5 rounded-sm hover:bg-gray-300 active:scale-95 transition"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
