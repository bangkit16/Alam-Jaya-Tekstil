"use client";

import { useGetPermintaan } from "@/services/potong/useGetPermintaan";
import { useGetPermintaanSelesai } from "@/services/potong/useGetPermintaanSelesai";

export default function Selesai() {
  const { data, isLoading } = useGetPermintaanSelesai(); // 🔥 filter status

  return (
    <div className="flex flex-col gap-3 overflow-y-auto">
      {isLoading ? (
        <p className="text-center py-4">Loading...</p>
      ) : data && data.length > 0 ? (
        data.map((item: any, index: number) => (
          <div
            key={`${item.id_permintaan}-${index}`}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            {/* HEADER */}
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm font-semibold text-gray-800 leading-snug">
                {item.nama_produk} - {item.ukuran}
              </p>

              <p className="text-lg font-bold text-gray-900">{item.jumlah}</p>
            </div>

            {/* DIVIDER */}
            <div className="h-px bg-gray-200 mb-3" />

            {/* DETAIL */}
            <div className="text-xs text-gray-600 space-y-1">
              <p>
                Nama Produk :
                <span className="text-gray-800 font-medium ml-1">
                  {item.nama_produk}
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
                  {item.kode_kain || "-"}
                </span>
              </p>

              <p>
                Nama Pemotong :
                <span className="text-gray-800 font-medium ml-1">
                  {item.pemotong || "-"}
                </span>
              </p>

              <p>
                Jumlah Diminta :
                <span className="text-gray-800 font-medium ml-1">
                  {item.jumlah}
                </span>
              </p>

              <p>
                Jumlah Hasil :
                <span className="text-gray-800 font-medium ml-1">
                  {item.jumlah_lolos || item.jumlah}
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
  );
}
