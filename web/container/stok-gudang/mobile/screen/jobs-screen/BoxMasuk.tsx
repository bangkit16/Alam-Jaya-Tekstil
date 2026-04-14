"use client";

import { useState } from "react";

export default function BoxMasuk({ search = "" }: any) {
  const [selected, setSelected] = useState<any>(null);
  const [namaPenerima, setNamaPenerima] = useState("");

  // ================= DUMMY =================
  const data = [
    {
      id: 1,
      namaBox: "BOX - HOODIE GREEN BLACK",
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
    },
  ];

  const filtered = data.filter((d) =>
    d.namaBox.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      {/* ================= LIST ================= */}
      <div className="flex flex-col gap-3">
        {filtered.map((box) => (
          <div
            key={box.id}
            onClick={() => setSelected(box)}
            className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm cursor-pointer"
          >
            {/* TITLE */}
            <p className="text-sm font-semibold mb-2">{box.namaBox}</p>

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
            <div className="mt-3 h-12 bg-gray-100 border-2 border-dashed rounded flex items-center justify-center text-[10px] text-gray-400">
              BARCODE
            </div>
          </div>
        ))}
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

            {/* INPUT */}
            <input
              placeholder="Nama Penerima box"
              value={namaPenerima}
              onChange={(e) => setNamaPenerima(e.target.value)}
              className="w-full bg-gray-100 px-3 py-2 rounded text-xs outline-none mb-3"
            />

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
            <div className="mt-4 h-16 bg-gray-100 border-2 border-dashed rounded flex items-center justify-center text-[10px] text-gray-400">
              BARCODE
            </div>

            {/* BUTTON */}
            <div className="flex justify-end mt-3">
              <button
                onClick={() => {
                  console.log("ACC BOX:", {
                    selected,
                    namaPenerima,
                  });

                  setSelected(null);
                  setNamaPenerima("");
                }}
                className="bg-gray-200 px-3 py-1 text-xs rounded shadow"
              >
                ACC
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
