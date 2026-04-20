"use client";

import { useState } from "react";
import { Package } from "lucide-react";

import { useGetPermintaanStokPotong } from "@/services/stok-potong/useGetPermintaan";
import { usePutMenunggu } from "@/services/stok-potong/usePutMenunggu";

//

import { useGetProses } from "@/services/stok-potong/useGetProses";
import { useGetStock } from "@/services/stok-potong/useGetStock";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import Pagination from "@/components/Pagination";

export default function Menunggu() {
  const [page, setPage] = useState(1);
  const {
    data: menungguData,
    isLoading,
    refetch,
  } = useGetPermintaanStokPotong(page);
  const { mutate, isPending } = usePutMenunggu();

  const [selectedItem, setSelectedItem] = useState<any>(null);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("id-ID");

  const count = menungguData?.data.length || 0;

  const data = menungguData?.data || [];
  const meta = menungguData?.meta;

  //

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow p-5">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-gray-800">Data Menunggu</h2>

          <span className="text-xs bg-gray-200 px-3 py-1 rounded-full text-gray-600">
            {count} item
          </span>
        </div>

        {/* CONTENT */}
        {count === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <div className="bg-orange-100 text-orange-500 p-4 rounded-full mb-4">
              <Package size={28} />
            </div>

            <p className="font-medium text-gray-500 mb-1">
              Belum ada data menunggu
            </p>

            <p className="text-xs text-gray-400">Data akan muncul di sini</p>
          </div>
        ) : (
          <div className="space-y-3">
            {(data || []).map((item: any) => (
              <div
                key={item.idPermintaan}
                onClick={() => setSelectedItem(item)}
                className="bg-white border border-gray-100 rounded-xl p-4 flex justify-between items-center shadow-sm cursor-pointer hover:bg-gray-50 transition"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {item.namaBarang} - {item.ukuran}
                  </p>

                  <div className="text-xs text-gray-500 mt-1">
                    • Kode: {item.kodeKain} <br />• Pemotong:{" "}
                    {item.pemotong.join(", ")} <br />• Selesai:{" "}
                    {formatDate(item.tanggalSelesaiPotong)}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    {item.jumlahHasil}
                  </p>
                  <span className="text-gray-400 text-xs font-semibold">
                    Menunggu
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* PAGINATION */}
        {meta && meta.totalPages > 1 && (
          <Pagination meta={meta} onPageChange={setPage} />
        )}
      </div>

      {/* MODAL TETAP (TIDAK DIUBAH) */}

      {/* ================= MODAL ================= */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white p-4 w-full max-w-sm shadow-xl border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-medium text-gray-800">
                {selectedItem.namaBarang} - {selectedItem.ukuran}
              </p>

              <p className="text-lg font-bold text-gray-900">
                {selectedItem.jumlahHasil}
              </p>
            </div>

            <div className="h-px bg-gray-300 mb-3" />

            {/* DETAIL */}
            <ul className="text-xs text-gray-700 space-y-1 mb-6">
              <li>• Kode: {selectedItem.kodeKain}</li>
              <li>• Pemotong: {selectedItem.pemotong.join(", ")}</li>
              <li>
                • Selesai: {formatDate(selectedItem.tanggalSelesaiPotong)}
              </li>
            </ul>

            {/* BUTTON */}
            <div className="flex justify-end">
              <button
                disabled={isPending}
                onClick={() => {
                  mutate(selectedItem.idStokPotong, {
                    onSuccess: () => {
                      setSelectedItem(null);
                      refetch();
                    },
                  });
                }}
                className="bg-gray-200 text-gray-700 text-xs px-4 py-1.5 rounded-sm hover:bg-gray-300 transition disabled:opacity-50"
              >
                {isPending ? "Loading..." : "Cek"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
