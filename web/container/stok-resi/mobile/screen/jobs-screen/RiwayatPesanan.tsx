"use client";

import { useGetRiwayatPesanan } from "@/services/stok-resi/useGetRiwayatPesanan";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function RiwayatPesanan({ setScreen }: any) {
  const { data = [], isLoading } = useGetRiwayatPesanan();

  return (
    <div className="space-y-3">
      {/* LIST */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-10 gap-2">
          <LoadingSpinner />
          <p className="text-[10px] text-gray-400">Memuat riwayat pesanan...</p>
        </div>
      ) : data.length === 0 ? (
        <p className="text-xs text-center text-gray-400">
          Tidak ada riwayat pesanan
        </p>
      ) : (
        data.map((item: any) => (
          <div
            key={item.idPesanan}
            className="border p-3 rounded-xl bg-gray-50"
          >
            {/* URGENT */}
            {item.isUrgent && (
              <p className="text-[10px] text-red-500 font-semibold mb-1">
                URGENT
              </p>
            )}

            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-xs font-medium">{item.kodeResi}</p>

                <ul className="text-[10px] text-gray-600 mt-1">
                  <li>
                    total design{" "}
                    <span className="font-bold ml-1">{item.totalDesign}</span>
                  </li>
                  <li>Nama toko {item.namaToko}</li>
                </ul>
              </div>

              {/* IMAGE */}
              <div className="w-14 h-14 bg-gray-200 rounded flex items-center justify-center text-[9px] text-gray-400">
                IMG
              </div>
            </div>

            {/* STATUS */}
            <p className="text-[10px] text-gray-600 mt-2">
              STATUS: {item.status}
            </p>
          </div>
        ))
      )}

      {/* NOTE */}
      <div className="text-[10px] text-gray-600 mt-3">
        <p className="font-semibold mb-1">note</p>
        <ul className="list-disc ml-3">
          <li>
            gambar design bisa beda beda tergantung pesanan resi (bisa lebih
            dari satu)
          </li>
        </ul>
      </div>
    </div>
  );
}
