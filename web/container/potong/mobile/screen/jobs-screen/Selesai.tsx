"use client";

import { useState } from "react";
import { useGetPermintaanSelesai } from "@/services/potong/useGetPermintaanSelesai";

export default function Selesai() {
  const { data, isLoading } = useGetPermintaanSelesai();
  console.log("DATA SELESAI:", data);

  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  return (
    <>
      <div className="flex flex-col gap-3 overflow-y-auto">
        {isLoading ? (
          <p className="text-center py-4">Loading...</p>
        ) : data && data.length > 0 ? (
          data.map((item: any, index: number) => (
            <div
              key={`${item.idPermintaan}-${index}`}
              onClick={() => setSelectedItem(item)} // ✅ klik buka modal
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50"
            >
              {/* HEADER */}
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-semibold text-gray-800 leading-snug">
                  {item.namaBarang} - {item.ukuran}
                </p>

                <p className="text-lg font-bold text-gray-900">
                  {item.jumlahMinta}
                </p>
              </div>

              {/* DIVIDER */}
              <div className="h-px bg-gray-200 mb-3" />

              {/* DETAIL */}
              <div className="text-xs text-gray-600 space-y-1">
                <p>
                  Nama Produk :
                  <span className="text-gray-800 font-medium ml-1">
                    {item.namaBarang}
                  </span>
                </p>

                <p>
                  Ukuran :
                  <span className="text-gray-800 font-medium ml-1">
                    {item.ukuran}
                  </span>
                </p>

                <p>
                  Kode Kain :
                  <span className="text-gray-800 font-medium ml-1">
                    {item.kodeKain || "-"}
                  </span>
                </p>

                <p>
                  Nama Pemotong :
                  <span className="text-gray-800 font-medium ml-1">
                    {Array.isArray(item.pemotong)
                      ? item.pemotong.join(", ")
                      : item.pemotong || "-"}
                  </span>
                </p>

                <p>
                  Jumlah Diminta :
                  <span className="text-gray-800 font-medium ml-1">
                    {item.jumlahMinta}
                  </span>
                </p>

                <p>
                  Jumlah Hasil :
                  <span className="text-gray-800 font-medium ml-1">
                    {item.jumlahHasil}
                  </span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-500 font-medium">Data Selesai Kosong</p>
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
            className="bg-white p-5 rounded-2xl w-full max-w-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex justify-between items-start mb-3">
              <p className="text-sm font-semibold text-gray-800 leading-snug">
                {selectedItem.namaBarang} - {selectedItem.ukuran}
              </p>

              <p className="text-lg font-bold text-gray-900">
                {selectedItem.jumlahMinta}
              </p>
            </div>

            {/* DIVIDER */}
            <div className="h-px bg-gray-200 mb-4" />

            {/* DETAIL (INI YANG TADI KOSONG → SUDAH DIISI) */}
            <div className="text-xs text-gray-600 space-y-2">
              <p>
                Nama Produk :
                <span className="font-medium text-gray-800 ml-1">
                  {selectedItem.namaBarang}
                </span>
              </p>

              <p>
                Ukuran :
                <span className="font-medium text-gray-800 ml-1">
                  {selectedItem.ukuran}
                </span>
              </p>

              <p>
                Kode Kain :
                <span className="font-medium text-gray-800 ml-1">
                  {selectedItem.kodeKain || "-"}
                </span>
              </p>

              <p>
                Nama Pemotong :
                <span className="font-medium text-gray-800 ml-1">
                  {Array.isArray(selectedItem.pemotong)
                    ? selectedItem.pemotong.join(", ")
                    : selectedItem.pemotong || "-"}
                </span>
              </p>

              <p>
                Jumlah Diminta :
                <span className="font-medium text-gray-800 ml-1">
                  {selectedItem.jumlahMinta}
                </span>
              </p>

              <p>
                Jumlah Hasil :
                <span className="font-medium text-gray-800 ml-1">
                  {selectedItem.jumlahHasil}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
