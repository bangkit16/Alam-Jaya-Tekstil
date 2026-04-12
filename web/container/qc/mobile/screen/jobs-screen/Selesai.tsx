"use client";

import { useState } from "react";

export default function Selesai({ orders = [], search = "" }: any) {
  const [selected, setSelected] = useState<any>(null);

  // ================= DUMMY (GROUP PER BOX) =================
  const dummy = [
    {
      id: "BOX-001",
      namaBox: "BOX - HOODIE GREEN BLACK",
      penanggungJawab: "Adit",
      tanggal: "2026-04-12",
      items: [
        {
          id: 1,
          nama: "Hoodie Green Navy - L",
          qty: 20,
        },
        {
          id: 2,
          nama: "Hoodie Black - M",
          qty: 15,
        },
      ],
      status: "selesai",
    },
  ];

  // ================= DATA =================
  const source = orders.length ? orders : dummy;

  const data = source.filter(
    (o: any) =>
      o.status === "selesai" &&
      o.namaBox?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      {/* ================= LIST ================= */}
      <div className="flex flex-col gap-3">
        {data.length === 0 ? (
          <p className="text-center text-gray-400 text-sm">Tidak ada data</p>
        ) : (
          data.map((box: any) => (
            <div
              key={box.id}
              onClick={() => setSelected(box)}
              className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm cursor-pointer"
            >
              {/* TITLE */}
              <p className="text-sm font-semibold mb-2">{box.namaBox}</p>

              {/* INFO */}
              <div className="text-[11px] text-gray-500 mb-2">
                <p>• Nama Penanggung jawab box</p>
              </div>

              {/* ITEMS */}
              <div className="space-y-2">
                {box.items.map((item: any) => (
                  <div key={item.id} className="border rounded-lg p-2">
                    <div className="flex justify-between">
                      <p className="text-xs">{item.nama}</p>
                      <p className="text-sm font-bold">{item.qty}</p>
                    </div>

                    <div className="text-[10px] text-gray-500">
                      <p>• kode Stok Potongan</p>
                      <p>• Tgl Masuk Stok</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* BARCODE */}
              <div className="mt-3 h-12 rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 flex items-center justify-center">
                <span className="text-[10px] text-gray-400 tracking-widest">
                  BARCODE
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= MODAL ================= */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-sm rounded-2xl p-4 shadow-xl">
            {/* TITLE */}
            <p className="text-sm font-semibold mb-2">{selected.namaBox}</p>

            {/* INFO */}
            <div className="text-xs text-gray-600 mb-2">
              <p>• Nama Penanggung jawab box</p>
              <p>• Tanggal masuk box</p>
            </div>

            {/* ITEMS */}
            <div className="space-y-2">
              {selected.items.map((item: any) => (
                <div key={item.id} className="bg-gray-100 rounded-lg p-2">
                  <div className="flex justify-between">
                    <p className="text-xs">{item.nama}</p>
                    <p className="text-sm font-bold">{item.qty}</p>
                  </div>

                  <div className="text-[10px] text-gray-500">
                    <p>• kode Stok Potongan</p>
                    <p>• Tgl Masuk Stok</p>
                  </div>
                </div>
              ))}
            </div>

            {/* BARCODE */}
            <div className="mt-4 h-16 rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 flex flex-col items-center justify-center gap-1">
              {/* fake barcode lines */}
              <div className="flex gap-[2px] h-6">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-[2px] ${
                      i % 3 === 0 ? "bg-gray-800" : "bg-gray-400"
                    }`}
                  />
                ))}
              </div>

              <span className="text-[10px] text-gray-400 tracking-widest">
                BARCODE
              </span>
            </div>

            {/* CLOSE */}
            <div className="flex justify-end mt-3">
              <button
                className="text-xs text-gray-500"
                onClick={() => setSelected(null)}
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
