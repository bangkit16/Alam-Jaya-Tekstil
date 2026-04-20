"use client";

import { Truck } from "lucide-react";
import { useGetKurirProses } from "@/services/kurir/useGetKurirProses";

export default function Proses() {
  const { data, isLoading } = useGetKurirProses();

  const count = data?.length || 0;

  if (isLoading) return <p className="text-center py-4">Loading...</p>;

  return (
    <>
      {/* CARD UTAMA */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-base font-semibold text-gray-800">Data Proses</h2>

          <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600">
            {count} item
          </span>
        </div>

        {/* CONTENT */}
        {count === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <div className="bg-blue-100 text-blue-500 p-4 rounded-full mb-4">
              <Truck size={28} />
            </div>

            <p className="font-medium text-gray-500 mb-1">
              Belum ada data proses
            </p>

            <p className="text-xs text-gray-400">
              Data proses akan muncul di sini
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {(data || []).map((item: any) => (
              <div
                key={item.idProsesStokPotong}
                className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:bg-gray-50 transition"
              >
                {/* HEADER ITEM */}
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-semibold text-gray-800">
                    {item.namaBarang}
                  </p>

                  <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">
                    Proses
                  </span>
                </div>

                {/* DIVIDER */}
                <div className="h-px bg-gray-200 mb-2" />

                {/* DETAIL */}
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Jumlah : {item.jumlah}</p>

                  {item.namaKurir && <p>Kurir : {item.namaKurir}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
