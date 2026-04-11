"use client";

import { useState } from "react";

type stockType = {
  id: string;
  nama_produk: string;
  jumlah: number;
  ukuran: "M" | "L" | "XL" | "XXL";
};

// ================= DUMMY DATA =================
const DUMMY_STOCK: stockType[] = [
  {
    id: "1",
    nama_produk: "Hoodie Green Navy",
    jumlah: 31,
    ukuran: "L",
  },
];

export default function Stock() {
  const [selectedStock, setSelectedStock] = useState<stockType | null>(null);

  const [namaPenjahit, setNamaPenjahit] = useState("");

  const handleClose = () => {
    setSelectedStock(null);
    setNamaPenjahit("");
  };

  const handleSubmit = () => {
    console.log("Kirim ke penjahit:", {
      ...selectedStock,
      namaPenjahit,
    });

    handleClose();
  };

  return (
    <>
      {/* ================= LIST ================= */}
      <div className="flex flex-col gap-3 overflow-y-auto">
        {DUMMY_STOCK.length > 0 ? (
          DUMMY_STOCK.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              onClick={() => setSelectedStock(item)}
              className="border border-gray-300 rounded-sm p-3 cursor-pointer hover:bg-gray-50"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-800">
                  {item.nama_produk} - {item.ukuran}
                </p>

                <p className="text-lg font-bold text-gray-900">{item.jumlah}</p>
              </div>

              {/* DETAIL */}
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• kode Stok Potongan</li>
                <li>• Tgl Masuk Stok (otomatis selesai)</li>
              </ul>
            </div>
          ))
        ) : (
          <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-500 font-medium">Data Kosong</p>
          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {selectedStock && (
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
                {selectedStock.nama_produk} - {selectedStock.ukuran}
              </p>

              <p className="text-lg font-bold text-gray-900">
                {selectedStock.jumlah}
              </p>
            </div>

            {/* INFO */}
            <div className="text-xs text-gray-700 space-y-2 mb-4">
              <p>Kode Stok Potongan</p>
              <p>Tanggal masuk stok</p>
            </div>

            {/* INPUT */}
            <input
              placeholder="Nama Penjahit Tujuan"
              value={namaPenjahit}
              onChange={(e) => setNamaPenjahit(e.target.value)}
              className="w-full bg-gray-100 px-3 py-2 text-xs outline-none mb-4"
            />

            {/* BUTTON */}
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                className="bg-gray-200 text-gray-700 text-xs px-4 py-1.5 rounded-sm hover:bg-gray-300 active:scale-95 transition"
              >
                Kirim
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
