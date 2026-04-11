"use client";

import { useState } from "react";
import { useGetPermintaanStokPotong } from "@/services/stok-potong/useGetPermintaan";

type stockType = {
  id: string;
  nama_produk: string;
  jumlah: number;
  ukuran: "M" | "L" | "XL" | "XXL";
};

export default function MenungguStock() {
  const { data, isLoading } = useGetPermintaanStokPotong();

  const [selectedItem, setSelectedItem] = useState<stockType | null>(null);

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  return (
    <>
      {/* ================= LIST ================= */}
      <div className="flex flex-col gap-3 overflow-y-auto">
        {isLoading ? (
          <p className="text-center py-4">Loading...</p>
        ) : data && data.length > 0 ? (
          data.map((item: stockType, index: number) => (
            <div
              key={`${item.id}-${index}`}
              onClick={() => setSelectedItem(item)}
              className="bg-white border border-gray-100 rounded-xl px-3 py-3 shadow-sm cursor-pointer hover:bg-gray-50 transition"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-semibold text-gray-800">
                  {item.nama_produk} - {item.ukuran}
                </p>

                <p className="text-lg font-bold text-gray-900">{item.jumlah}</p>
              </div>

              {/* DETAIL */}
              <div className="text-[11px] text-gray-600 space-y-0.5">
                <p>• Kode Kain</p>
                <p>• Nama Pemotong</p>
                <p>• Tanggal Selesai Potong</p>
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
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white p-4 w-full max-w-sm shadow-xl border border-gray-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-medium text-gray-800">
                {selectedItem.nama_produk} - {selectedItem.ukuran}
              </p>

              <p className="text-lg font-bold text-gray-900">
                {selectedItem.jumlah}
              </p>
            </div>

            {/* DIVIDER */}
            <div className="h-px bg-gray-300 mb-3" />

            {/* DETAIL */}
            <ul className="text-xs text-gray-700 space-y-1 mb-6">
              <li>• Kode kain</li>
              <li>• Nama Potongan</li>
              <li>• Tanggal Selesai Potong</li>
            </ul>

            {/* BUTTON */}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  console.log("Cek item:", selectedItem);
                  handleCloseModal();
                }}
                className="bg-gray-200 text-gray-700 text-xs px-4 py-1.5 rounded-sm hover:bg-gray-300 active:scale-95 transition"
              >
                Cek
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
