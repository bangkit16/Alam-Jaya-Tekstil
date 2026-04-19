"use client";

import { useState, useEffect, useRef } from "react";
import { useGetSelesaiInfinite } from "@/services/potong/useGetPermintaanSelesai";

export default function Selesai() {
  const [searchTerm, setSearchTerm] = useState("");
  // 1. Panggil hook dengan search term
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetSelesaiInfinite(searchTerm);

  // 2. ELEMENT REF untuk trigger scroll
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // 3. FLAT DATA: Menggabungkan semua page menjadi satu list
  const allItems = data?.pages.flatMap((page) => page.data) ?? [];

  const [selectedItem, setSelectedItem] = useState<any>(null);

  // 4. LOGIC SCROLL (Intersection Observer)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleCloseModal = () => setSelectedItem(null);

  return (
    <>
      <div className="flex flex-col gap-3 overflow-y-auto px-2">
        {isLoading ? (
          <p className="text-center py-4">Loading...</p>
        ) : allItems.length > 0 ? (
          // 5. MAPPING menggunakan allItems
          allItems.map((item: any, index: number) => (
            <div
              key={`${item.idPermintaan}-${index}`}
              onClick={() => setSelectedItem(item)}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50"
            >
              {item.isUrgent && (
                <p className="text-xs text-red-500 font-semibold mb-2">
                  URGENT
                </p>
              )}
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-semibold text-gray-800 leading-snug">
                  {item.namaBarang} - {item.ukuran}
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {item.jumlahMinta}
                </p>
              </div>
              <div className="h-px bg-gray-200 mb-3" />
              <div className="text-xs text-gray-600 space-y-1">
                <p>
                  Kode Kain:{" "}
                  <span className="text-gray-800 font-medium ml-1">
                    {item.kodeKain || "-"}
                  </span>
                </p>
                <p>
                  Pemotong:{" "}
                  <span className="text-gray-800 font-medium ml-1">
                    {Array.isArray(item.pemotong)
                      ? item.pemotong.join(", ")
                      : item.pemotong || "-"}
                  </span>
                </p>
                <p>
                  Hasil / Minta:{" "}
                  <span className="text-gray-800 font-medium ml-1">
                    {item.jumlahHasil} / {item.jumlahMinta}
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

        {/* 6. SENTINEL / TARGET SCROLL */}
        <div
          ref={loadMoreRef}
          className="py-4 text-center text-xs text-gray-400"
        >
          {isFetchingNextPage
            ? "Memuat lebih banyak..."
            : hasNextPage
              ? "Scroll untuk lihat lainnya"
              : ""
              }
        </div>
      </div>

      {/* MODAL (Tetap sama) */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white p-5 rounded-2xl w-full max-w-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm font-bold mb-4">Detail Permintaan</p>
            <div className="text-xs space-y-2">
              <p>Barang: {selectedItem.namaBarang}</p>
              <p>Pemotong: {selectedItem.pemotong?.join(", ")}</p>
            </div>
            <button
              onClick={handleCloseModal}
              className="mt-6 w-full py-2 bg-gray-100 rounded-xl font-semibold text-sm"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
}
