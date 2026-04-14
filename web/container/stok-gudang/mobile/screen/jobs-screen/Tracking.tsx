"use client";

import { useState } from "react";

export default function Tracking({ search = "" }: any) {
  const [selected, setSelected] = useState<any>(null);

  // ================= DUMMY =================
  const data = [
    {
      id: 1,
      nama: "Hoodie Green Navy - L",
      qty: 20,
      status: "Sampai Kurir",
      urgent: true,
    },
  ];

  const filtered = data.filter((d) =>
    d.nama.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      {/* ================= LIST ================= */}
      <div className="flex flex-col gap-2">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white border rounded-xl p-3 shadow-sm"
          >
            {/* URGENT */}
            {item.urgent && (
              <p className="text-[10px] text-red-500 font-bold mb-1">URGENT</p>
            )}

            {/* TITLE */}
            <div className="flex justify-between">
              <p className="text-sm font-medium">{item.nama}</p>
              <p className="text-lg font-bold">{item.qty}</p>
            </div>

            {/* STATUS + BUTTON */}
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-600">
                STATUS : {item.status.toUpperCase()}
              </p>

              <button
                onClick={() => setSelected(item)}
                className="bg-gray-300 text-[10px] px-2 py-1 rounded"
              >
                TRACK
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MODAL TRACK ================= */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-sm rounded-2xl p-4 shadow-xl">
            {/* TITLE */}
            <p className="text-sm font-semibold mb-3">Tracking Detail</p>

            {/* INFO */}
            <div className="bg-gray-100 rounded-xl p-3 text-xs space-y-1">
              <p>
                <b>Produk:</b> {selected.nama}
              </p>
              <p>
                <b>Qty:</b> {selected.qty}
              </p>
              <p>
                <b>Status:</b> {selected.status}
              </p>
            </div>

            {/* TIMELINE (dummy) */}
            <div className="mt-3 text-xs space-y-2">
              <div className="bg-white border rounded p-2">
                📦 Barang dikirim dari gudang
              </div>
              <div className="bg-white border rounded p-2">
                🚚 Sampai ke kurir
              </div>
              <div className="bg-white border rounded p-2 text-gray-400">
                ⏳ Dalam perjalanan
              </div>
            </div>

            {/* CLOSE */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelected(null)}
                className="text-xs text-gray-500"
              >
                Tutup
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
