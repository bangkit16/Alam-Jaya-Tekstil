"use client";

import { useState, useEffect, useRef } from "react"; // Tambahkan useEffect & useRef
import { useGetStockInfinite } from "@/services/stok-potong/useGetStock"; // Gunakan Infinite Hook
import { useGetPenjahit } from "@/services/stok-potong/useGetPenjahit";
import { usePutStock } from "@/services/stok-potong/usePutStock";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Package } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function Stock() {
  const queryClient = useQueryClient();

  // 1. Gunakan useGetStockInfinite
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetStockInfinite();

  const { data: penjahitList } = useGetPenjahit();
  const { mutate, isPending } = usePutStock();

  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [namaPenjahit, setNamaPenjahit] = useState("");

  // 2. Ref untuk sensor scroll di bawah list
  const observerTarget = useRef<HTMLDivElement>(null);

  // 3. Gabungkan semua data dari berbagai halaman menjadi satu array flat
  const allData = data?.pages.flatMap((page) => page.data) || [];

  // 4. Setup Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleClose = () => {
    setSelectedStock(null);
    setNamaPenjahit("");
  };

  const handleSubmit = () => {
    if (!selectedStock) return;
    if (!namaPenjahit) return;

    const id = selectedStock?.idStokPotong;
    if (!id) return;

    mutate(
      { id, penjahitId: namaPenjahit },
      {
        onSuccess: () => {
          toast.success("Berhasil dikirim menunggu kurir");
          // Invalidate key sesuai dengan yang ada di service (infinite)
          queryClient.invalidateQueries({
            queryKey: ["stokpotong", "stok"],
          });
          handleClose();
        },
      },
    );
  };

  return (
    <>
      {/* ================= LIST ================= */}
      <div className="flex flex-col gap-3 overflow-y-auto">
        {isLoading ? (
          <LoadingSpinner />
        ) : allData.length > 0 ? (
          <>
            {allData.map((item) => {
              const isLocked = item.status !== "SELESAI";

              return (
                <div
                  key={item.idStokPotong}
                  onClick={() => {
                    if (!isLocked) setSelectedStock(item);
                  }}
                  className={`border rounded-sm p-3
                    ${
                      isLocked
                        ? "bg-gray-200 cursor-not-allowed opacity-60"
                        : "border-gray-300 cursor-pointer hover:bg-gray-50"
                    }
                  `}
                >
                  {/* HEADER */}
                  {item.isUrgent && (
                    <p className="text-xs text-red-500 font-semibold mb-2">
                      URGENT
                    </p>
                  )}
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {item.namaBarang} - {item.ukuran}
                      </p>
                    </div>

                    <p className="text-lg font-bold text-gray-900">
                      {item.jumlahLolos}
                    </p>
                  </div>

                  {/* STATUS */}
                  <p
                    className={`text-[10px] font-semibold
                      ${
                        item.status === "STOK"
                          ? "text-blue-600"
                          : item.status === "MENUNGGU_KURIR"
                            ? "text-yellow-600"
                            : "text-green-600"
                      }
                    `}
                  >
                    {item.status}
                  </p>

                  {isLocked && (
                    <p className="text-[10px] text-red-500">
                      Potongan sudah dikirim
                    </p>
                  )}

                  {/* DETAIL */}
                  <ul className="text-xs text-gray-700 space-y-1 mt-1">
                    <li>• Kode: {item.kodeStokPotongan}</li>
                    <li>
                      • Masuk:{" "}
                      {new Date(item.tanggalMasukPotong).toLocaleDateString(
                        "id-ID",
                      )}
                    </li>
                  </ul>
                </div>
              );
            })}

            {/* 5. Target Sensor Scroll (Hidden Trigger) */}
            <div
              ref={observerTarget}
              className="h-10 flex items-center justify-center"
            >
              {isFetchingNextPage && <LoadingSpinner />}
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
      {selectedStock && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          onClick={handleClose}
        >
          <div
            className="bg-white p-4 w-full max-w-sm shadow-xl rounded-md"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const isLocked = selectedStock?.status !== "SELESAI";

              return (
                <>
                  {selectedStock.isUrgent && (
                    <p className="text-xs text-red-500 font-semibold mb-2">
                      URGENT
                    </p>
                  )}
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-medium text-gray-800">
                      {selectedStock?.namaBarang} - {selectedStock?.ukuran}
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {selectedStock?.jumlahLolos}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">
                    Status: {selectedStock?.status}
                  </p>
                  <div className="text-xs text-gray-700 space-y-2 mb-4">
                    <p>Kode: {selectedStock?.kodeStokPotongan}</p>
                    <p>
                      Masuk:{" "}
                      {selectedStock?.tanggalMasukPotong &&
                        new Date(
                          selectedStock.tanggalMasukPotong,
                        ).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <div className="mb-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">
                      Pilih Penjahit
                    </label>
                    <select
                      value={namaPenjahit}
                      onChange={(e) => setNamaPenjahit(e.target.value)}
                      className="w-full bg-gray-100 px-3 py-2 rounded text-xs outline-none mt-1 appearance-none"
                    >
                      <option value="" disabled>
                        Pilih Nama Penerima
                      </option>
                      {penjahitList?.map((item: any) => (
                        <option key={item.id} value={item.id}>
                          {item.nama}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handleSubmit}
                      disabled={!namaPenjahit || isPending || isLocked}
                      className={`text-xs px-4 py-1.5 rounded-sm transition text-white
                        ${
                          !namaPenjahit || isLocked
                            ? "bg-orange-300 text-orange-500 cursor-not-allowed"
                            : "bg-orange-500 hover:bg-orange-700 active:scale-95"
                        }
                      `}
                    >
                      {!namaPenjahit || isLocked
                        ? "Tidak bisa kirim"
                        : isPending
                          ? "Mengirim..."
                          : "Kirim"}
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </>
  );
}
