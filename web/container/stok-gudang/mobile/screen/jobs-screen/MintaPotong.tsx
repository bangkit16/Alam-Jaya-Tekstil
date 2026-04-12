"use client";

import { useState } from "react";

export default function MintaPotong({ search = "" }: any) {
  const [open, setOpen] = useState(false); // modal form
  const [selected, setSelected] = useState<any>(null); // modal detail

  const [form, setForm] = useState({
    nama: "",
    jumlah: "",
    ukuran: "",
    kategori: "",
    isUrgent: false,
  });

  // ================= DUMMY =================
  const data = [
    {
      id: 1,
      nama: "Hoodie Green Navy - L",
      qty: 20,
      kategori: "Hoodie",
      urgent: true,
    },
  ];

  const filtered = data.filter((d) =>
    d.nama.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      {/* ================= HEADER BUTTON ================= */}
      <div className="mb-3 flex justify-center">
        <button
          onClick={() => setOpen(true)}
          className="bg-gray-300 text-xs px-3 py-1 rounded shadow"
        >
          MINTA POTONG
        </button>
      </div>

      {/* ================= LIST ================= */}
      <div className="flex flex-col gap-2">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelected(item)} // ✅ klik buka modal detail
            className="bg-white border rounded-xl p-3 shadow-sm cursor-pointer"
          >
            {item.urgent && (
              <p className="text-[10px] text-red-500 font-bold mb-1">URGENT</p>
            )}

            <div className="flex justify-between">
              <p className="text-sm font-medium">{item.nama}</p>
              <p className="text-lg font-bold">{item.qty}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MODAL FORM ================= */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-sm rounded-2xl p-4 shadow-xl">
            <p className="text-sm font-semibold mb-3">Permintaan</p>

            <div className="space-y-2">
              <input
                placeholder="Nama produk"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                className="w-full bg-gray-100 px-3 py-2 rounded text-xs outline-none"
              />

              <input
                placeholder="Jumlah"
                value={form.jumlah}
                onChange={(e) => setForm({ ...form, jumlah: e.target.value })}
                className="w-full bg-gray-100 px-3 py-2 rounded text-xs outline-none"
              />

              <input
                placeholder="Ukuran"
                value={form.ukuran}
                onChange={(e) => setForm({ ...form, ukuran: e.target.value })}
                className="w-full bg-gray-100 px-3 py-2 rounded text-xs outline-none"
              />

              <input
                placeholder="Kategori"
                value={form.kategori}
                onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                className="w-full bg-gray-100 px-3 py-2 rounded text-xs outline-none"
              />

              <button
                onClick={() => setForm({ ...form, isUrgent: !form.isUrgent })}
                className={`text-xs px-3 py-1 rounded ${
                  form.isUrgent ? "bg-red-500 text-white" : "bg-gray-200"
                }`}
              >
                IsUrgent
              </button>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  console.log("MINTA POTONG:", form);

                  setOpen(false);
                  setForm({
                    nama: "",
                    jumlah: "",
                    ukuran: "",
                    kategori: "",
                    isUrgent: false,
                  });
                }}
                className="bg-gray-200 text-xs px-3 py-1 rounded shadow"
              >
                Kirim
              </button>
            </div>
          </div>

          <div
            className="absolute inset-0 -z-10"
            onClick={() => setOpen(false)}
          />
        </div>
      )}

      {/* ================= MODAL DETAIL (BARU 🔥) ================= */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-sm rounded-2xl p-4 shadow-xl">
            {/* TITLE */}
            <p className="text-sm font-semibold mb-2">Detail Produk</p>

            {/* CONTENT */}
            <div className="bg-gray-100 rounded-xl p-3 mb-3">
              {selected.urgent && (
                <p className="text-[10px] text-red-500 font-bold mb-1">
                  URGENT
                </p>
              )}

              <div className="flex justify-between">
                <p className="text-sm">{selected.nama}</p>
                <p className="font-bold">{selected.qty}</p>
              </div>

              <div className="text-xs text-gray-500 mt-2">
                <p>Kategori: {selected.kategori}</p>
              </div>
            </div>

            {/* BUTTON */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelected(null)}
                className="text-xs text-gray-500"
              >
                Tutup
              </button>

              <button
                onClick={() => {
                  console.log("KIRIM DARI DETAIL:", selected);
                  setSelected(null);
                }}
                className="bg-gray-200 text-xs px-3 py-1 rounded"
              >
                Kirim
              </button>
            </div>
          </div>

          {/* CLICK OUTSIDE */}
          <div
            className="absolute inset-0 -z-10"
            onClick={() => setSelected(null)}
          />
        </div>
      )}
    </>
  );
}
