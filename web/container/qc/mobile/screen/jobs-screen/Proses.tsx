"use client";

import { useState } from "react";

export default function Proses({ orders = [], search = "" }: any) {
  const [selected, setSelected] = useState<any>(null);

  // ================= DUMMY =================
  const dummy = [
    {
      id: 1,
      nama: "Hoodie Green Navy - L",
      qty: 25,
      kodeBarang: "HD-GN-L",
      penjahit: "Adit",
      qc: "Rafi",
      klasifikasi: {
        lolos: 20,
        perbaikan: 3,
        reject: 2,
        turunSize: 0,
        kotor: 0,
      },
      status: "proses",
    },
  ];

  // ================= DATA =================
  const source = orders.length ? orders : dummy;

  const data = source.filter(
    (o: any) =>
      o.status === "proses" &&
      o.nama?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      {/* ================= LIST ================= */}
      <div className="flex flex-col gap-2">
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
            </div>
          ))
        )}
      </div>

      {/* ================= MODAL ================= */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-sm rounded-2xl p-4 shadow-xl relative">
            {/* HEADER */}
            <div className="flex justify-between mb-2">
              <p className="font-medium text-sm">{selected.nama}</p>
              <p className="font-bold text-lg">{selected.qty}</p>
            </div>

            {/* INFO */}
            <div className="text-xs text-gray-600 space-y-1 mt-2">
              <p>• Kode Potongan</p>
              <p>• Nama Penjahit</p>
            </div>

            {/* QC BOX */}
            <div className="bg-gray-100 rounded-xl p-3 mt-3 text-xs space-y-2">
              <p className="font-medium">Nama Pengecek ( QC )</p>

              <div className="mt-2 space-y-1">
                <p className="font-medium">KLASIFIKASI</p>
                <p>LOLOS : {selected.klasifikasi?.lolos}</p>
                <p>PERMAK : {selected.klasifikasi?.perbaikan}</p>
                <p>REJECT : {selected.klasifikasi?.reject}</p>
                <p>TURUN SIZE : {selected.klasifikasi?.turunSize}</p>
                <p>KOTOR : {selected.klasifikasi?.kotor}</p>
              </div>
            </div>

            {/* BUTTON */}
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-100 px-3 py-1 text-xs rounded shadow"
                onClick={() => {
                  console.log("Selesai", selected.id);
                  setSelected(null);
                }}
              >
                Selesai
              </button>
            </div>

            {/* CLOSE */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-3 text-gray-400 text-sm"
            >
              ✕
            </button>
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
