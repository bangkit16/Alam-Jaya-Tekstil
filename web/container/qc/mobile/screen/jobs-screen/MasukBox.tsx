"use client";

import { useState } from "react";

export default function MasukBox({ orders = [], search = "" }: any) {
  const [open, setOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [namaBox, setNamaBox] = useState("");
  const [penanggungJawab, setPenanggungJawab] = useState("");

  // ================= DUMMY =================
  const dummy = [
    {
      id: 1,
      nama: "Hoodie Green Navy - L",
      qty: 20,
      kodeBarang: "HD-GN-L",
      penjahit: "Adit",
      status: "masuk_box",
    },
    {
      id: 2,
      nama: "Hoodie Black - M",
      qty: 15,
      kodeBarang: "HD-BLK-M",
      penjahit: "Budi",
      status: "masuk_box",
    },
  ];

  // ================= DATA =================
  const source = orders.length ? orders : dummy;

  const data = source.filter(
    (o: any) =>
      o.status === "masuk_box" &&
      o.nama?.toLowerCase().includes(search.toLowerCase()),
  );

  // ================= HANDLE SELECT =================
  const toggleItem = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  return (
    <>
      {/* ================= LIST ================= */}
      <div className="flex flex-col gap-3 h-full">
        <div className="text-xs font-semibold text-gray-600">PACKING</div>

        {/* LIST ITEM */}
        <div className="flex flex-col gap-2 flex-1 overflow-auto">
          {data.map((o: any) => (
            <div
              key={o.id}
              className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm"
            >
              <div className="flex justify-between">
                <p className="text-sm font-medium">{o.nama}</p>
                <p className="text-lg font-bold">{o.qty}</p>
              </div>

              <div className="text-[11px] mt-2 space-y-1 text-gray-500">
                <p>• kode Stok Potongan</p>
                <p>• Nama penjahit</p>
                <p>• Tgl Masuk Stok</p>
              </div>
            </div>
          ))}
        </div>

        {/* BUTTON PACKING */}
        <div className="mt-2">
          <button
            onClick={() => setOpen(true)}
            className="w-full bg-gray-200 py-2 text-xs rounded-xl font-medium shadow"
          >
            PACKING
          </button>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-sm rounded-2xl p-4 shadow-xl">
            {/* TITLE */}
            <p className="font-semibold text-sm mb-3">PACKING STOK</p>

            {/* INPUT */}
            <div className="space-y-2 mb-3">
              <input
                placeholder="Nama Penanggung jawab box"
                value={penanggungJawab}
                onChange={(e) => setPenanggungJawab(e.target.value)}
                className="w-full bg-gray-100 px-3 py-2 rounded text-xs outline-none"
              />

              <input
                placeholder="NAMA BOX"
                value={namaBox}
                onChange={(e) => setNamaBox(e.target.value)}
                className="w-full bg-gray-100 px-3 py-2 rounded text-xs outline-none"
              />
            </div>

            {/* LIST CHECKBOX */}
            <div className="bg-gray-100 rounded-xl p-2 max-h-[200px] overflow-auto space-y-2">
              {data.map((o: any) => (
                <div
                  key={o.id}
                  className="bg-white border rounded-lg p-2 flex gap-2 items-start"
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(o.id)}
                    onChange={() => toggleItem(o.id)}
                  />

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="text-xs font-medium">{o.nama}</p>
                      <p className="text-sm font-bold">{o.qty}</p>
                    </div>

                    <div className="text-[10px] text-gray-500">
                      <p>• kode Stok Potongan</p>
                      <p>• Tgl Masuk Stok</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* BUTTON */}
            <div className="flex justify-end mt-3">
              <button
                className="bg-gray-200 px-3 py-1 text-xs rounded shadow"
                onClick={() => {
                  console.log({
                    selectedItems,
                    namaBox,
                    penanggungJawab,
                  });

                  setOpen(false);
                  setSelectedItems([]);
                  setNamaBox("");
                  setPenanggungJawab("");
                }}
              >
                PACKING
              </button>
            </div>
          </div>

          {/* CLICK OUTSIDE */}
          <div
            className="absolute inset-0 -z-10"
            onClick={() => setOpen(false)}
          />
        </div>
      )}
    </>
  );
}
