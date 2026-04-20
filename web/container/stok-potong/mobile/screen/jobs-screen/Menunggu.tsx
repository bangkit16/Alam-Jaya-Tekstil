"use client";

import { useState, useEffect, useRef } from "react"; // Tambahkan useEffect & useRef
import { useGetPermintaanStokPotongInfinite } from "@/services/stok-potong/useGetPermintaan";
import { usePutMenunggu } from "@/services/stok-potong/usePutMenunggu";
import { toast } from "sonner";
import { Package } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

type stockType = {
  idPermintaan: string;
  idStokBarang: string;
  idStokPotong: string;
  namaBarang: string;
  ukuran: "M" | "L" | "XL" | "XXL";
  isUrgent: boolean;
  kodeKain: string;
  pemotong: string[];
  jumlahHasil: number;
  tanggalSelesaiPotong: string;
};

export default function MenungguStock() {
  const {
    data,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetPermintaanStokPotongInfinite();

  const { mutate, isPending } = usePutMenunggu();
  const [selectedItem, setSelectedItem] = useState<stockType | null>(null);

  // 1. Ref untuk sensor di bawah list
  const observerTarget = useRef<HTMLDivElement>(null);

  const allData = data?.pages.flatMap((page) => page.data) || [];

  // 2. Logic Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Jika sensor terlihat di layar DAN ada halaman berikutnya DAN tidak sedang memuat
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }, // Memicu ketika 10% sensor terlihat
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID");
  };

  return (
    <>
      {/* ================= LIST ================= */}
      <div className="flex flex-col gap-3 overflow-y-auto">
        {isLoading ? (
          <LoadingSpinner />
        ) : allData.length > 0 ? (
          <>
            {allData.map((item: stockType) => (
              <div
                key={item.idPermintaan}
                onClick={() => setSelectedItem(item)}
                className="bg-white border border-gray-100 rounded-xl px-3 py-3 shadow-sm cursor-pointer hover:bg-gray-50 active:scale-[0.98] transition"
              >
                {/* HEADER */}
                {item.isUrgent && (
                  <p className="text-xs text-red-500 font-semibold mb-2">
                    URGENT
                  </p>
                )}
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs font-semibold text-gray-800">
                    {item.namaBarang} - {item.ukuran}
                  </p>

                  <p className="text-lg font-bold text-gray-900">
                    {item.jumlahHasil}
                  </p>
                </div>

                {/* DETAIL */}
                <div className="text-[11px] text-gray-600 space-y-0.5">
                  <p>• Kode: {item.kodeKain}</p>
                  <p>• Pemotong: {item.pemotong.join(", ")}</p>
                  <p>• Selesai: {formatDate(item.tanggalSelesaiPotong)}</p>
                </div>
              </div>
            ))}

            {/* 3. Sensor Element & Loading Indicator */}
            <div ref={observerTarget} className="py-4 flex justify-center">
              {isFetchingNextPage && (
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  Memuat data...
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <div className="bg-orange-100 text-orange-500 p-4 rounded-full mb-4">
              <Package size={30} />
            </div>
            <p className="font-semibold text-gray-500 mb-1">Belum ada data</p>
            <p className="text-xs text-gray-400">Data akan muncul di sini</p>
          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 "
          onClick={handleCloseModal}
        >
          <div
            className="bg-white p-4 w-full max-w-sm shadow-xl border border-gray-300 rounded-md"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedItem.isUrgent && (
              <p className="text-xs text-red-500 font-semibold mb-2">URGENT</p>
            )}
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-medium text-gray-800">
                {selectedItem.namaBarang} - {selectedItem.ukuran}
              </p>
              <p className="text-lg font-bold text-gray-900">
                {selectedItem.jumlahHasil}
              </p>
            </div>
            <div className="h-px bg-gray-300 mb-3" />
            <ul className="text-xs text-gray-700 space-y-1 mb-6">
              <li>• Kode: {selectedItem.kodeKain}</li>
              <li>• Pemotong: {selectedItem.pemotong.join(", ")}</li>
              <li>
                • Selesai: {formatDate(selectedItem.tanggalSelesaiPotong)}
              </li>
            </ul>
            <div className="flex justify-end">
              <button
                disabled={isPending}
                onClick={() => {
                  if (!selectedItem.idStokPotong) return;
                  mutate(selectedItem.idStokPotong, {
                    onSuccess: (data) => {
                      handleCloseModal();
                      toast.success(data.message);
                      refetch();
                    },
                  });
                }}
                className="bg-orange-500 text-white text-xs px-4 py-1.5 rounded-sm hover:bg-orange-700 active:scale-95 transition disabled:opacity-50"
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
