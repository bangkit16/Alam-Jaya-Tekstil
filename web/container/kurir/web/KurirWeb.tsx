"use client";

import { Truck, CheckCircle } from "lucide-react";
import { useGetStokKirim } from "@/services/potong/useGetStokKirim";
import { usePutStokPotong } from "@/services/potong/usePutStokPotong";

export default function KurirWeb({ handleLogout }: any) {
  const { data, isLoading } = useGetStokKirim();
  const { mutate } = usePutStokPotong();

  const handleSelesai = (item: any) => {
    mutate({
      id: item.id_stok_potong,
      data: {
        penjahit: item.penjahit || "kurir",
        admin: item.admin || "kurir",
        tanggal_kirim: new Date().toISOString(),
      },
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <div className="w-64 bg-white shadow-lg p-5 hidden md:block">
        <h1 className="text-xl font-bold mb-6 text-indigo-600">Kurir Panel</h1>

        <button onClick={handleLogout} className="text-sm text-red-500">
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-6">Pengiriman Barang 🚚</h2>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-3">
            {data?.map((item: any, index: number) => (
              <div
                key={index}
                className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{item.nama_produk}</p>
                  <p className="text-xs text-gray-500">
                    {item.jumlah_lolos} pcs
                  </p>
                </div>

                <button
                  onClick={() => handleSelesai(item)}
                  className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
                >
                  Selesai
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
