"use client";

import { useState } from "react";

export default function Menunggu({ orders = [], search = "" }: any) {
  const [selected, setSelected] = useState<any>(null);

  // ================= DUMMY =================
  const dummy = [
    {
      id: 999,
      nama: "Hoodie Green Navy - L",
      qty: 25,
      kodeBarang: "HD-GN-L",
      penjahit: "Adit",
      tanggalSelesai: "-",
      status: "menunggu",
    },
  ];

  // ================= DATA =================
  const source = orders.length ? orders : dummy;

  const data = source.filter(
    (o: any) =>
      o.status === "menunggu" &&
      o.nama?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      {/* ================= LIST ================= */}
      <div className="flex flex-col gap-3">
        {data.length === 0 ? (
          <p className="text-center text-gray-400 text-sm">Tidak ada data</p>
        ) : (
          data.map((o: any) => (
            <div
              key={o.id}
              onClick={() => setSelected(o)}
              className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm cursor-pointer"
            >
              <div className="flex justify-between">
                <p className="text-sm font-medium">{o.nama}</p>
                <p className="text-lg font-bold">{o.qty}</p>
              </div>

              <div className="text-[11px] mt-2 space-y-1">
                <p>• Kode Stok Potongan</p>
                <p>• Nama Penjahit</p>
                <p>• Tanggal Selesai Jahit</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= MODAL ================= */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          {/* BOX */}
          <div className="bg-white w-[90%] max-w-sm rounded-2xl p-4 shadow-xl relative">
            {/* TITLE */}
            <div className="flex justify-between mb-2">
              <p className="font-medium text-sm">{selected.nama}</p>
              <p className="font-bold text-lg">{selected.qty}</p>
            </div>

            {/* DETAIL */}
            <div className="text-xs text-gray-600 space-y-1 mt-2">
              <p>• Kode Potongan</p>
              <p>• Nama Penjahit</p>
              <p>• Tanggal Selesai Jahit</p>
            </div>

            {/* BUTTON */}
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-100 px-3 py-1 text-xs rounded shadow"
                onClick={() => {
                  console.log("Proses", selected.id);
                  setSelected(null);
                }}
              >
                Proses
              </button>
            </div>

            {/* CLOSE AREA */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-3 text-gray-400 text-sm"
            >
              ✕
            </button>
          </div>

          {/* CLICK OUTSIDE CLOSE */}
          <div
            className="absolute inset-0 -z-10"
            onClick={() => setSelected(null)}
          />
        </div>
      )}
    </>
  );
}
