"use client";

import { useEffect, useRef, useState } from "react";
import {
  useGetQCMenunggu,
  useGetQCMenungguInfinite,
} from "@/services/qc/useGetQCMenunggu";
import { usePutMulaiQC } from "@/services/qc/usePutMulaiQC";
import { toast } from "sonner";
import { Package } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function Menunggu({ search = "" }: any) {
  const [selected, setSelected] = useState<any>(null);

  // ================= API =================

  const { mutate: prosesQC, isPending } = usePutMulaiQC();

  const {
    data: dataMenunggu,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
  } = useGetQCMenungguInfinite();
  const jobs = dataMenunggu?.pages.flatMap((page) => page.data) ?? [];
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
      },
    );
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // ================= FILTER =================
  const data = jobs.filter((o: any) =>
    `${o.namaBarang} ${o.ukuran}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      {/* ================= LIST ================= */}
      <div className="flex flex-col gap-3">
        {isLoading ? (
          <LoadingSpinner />
        ) : isError ? (
          <p className="text-center text-red-400 text-sm">
            Gagal mengambil data
          </p>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <div className="bg-orange-100 text-orange-500 p-4 rounded-full mb-4">
              <Package size={30} />
            </div>

            <p className="font-semibold text-gray-500 mb-1">Belum ada data</p>

            <p className="text-xs text-gray-400">Data akan muncul di sini</p>
          </div>
        ) : (
          data.map((o: any) => (
            <div
              key={o.idQC}
              onClick={() => setSelected(o)}
              className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm cursor-pointer"
            >
              {o.isUrgent && (
                <p className="text-red-500 font-bold text-sm">URGENT</p>
              )}
              <div className="flex justify-between">
                <p className="text-sm font-medium">
                  {o.namaBarang} - {o.ukuran}
                </p>

                <p className="text-lg font-bold">{o.jumlahSelesaiJahit}</p>
              </div>

              <div className="text-[11px] space-y-1 text-gray-600">
                <p>
                  <b> Kode Potongan:</b> {o.kodeStokPotongan}
                </p>
                <p>
                  <b> Nama Penjahit:</b> {o.namaPenjahit}
                </p>
                <p>
                  <b>Tanggal Selesai Jahit: </b>
                  {new Date(o.tanggalSelesaiJahit).toLocaleString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: false,
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        <div
          ref={loadMoreRef}
          className="h-10 flex items-center justify-center"
        >
          {isFetchingNextPage && (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="w-4 h-4 border-2 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
              Memuat data...
            </div>
          )}
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          {/* BOX */}
          <div className="bg-white w-[90%] max-w-sm rounded-2xl p-4 shadow-xl relative z-10">
            {selected.isUrgent && (
              <p className="text-red-500 font-bold">URGENT</p>
            )}
            {/* TITLE */}
            <div className="flex justify-between mb-2">
              <p className="font-medium text-sm">
                {selected.namaBarang} - {selected.ukuran}
              </p>

              <p className="font-bold text-lg">{selected.jumlahSelesaiJahit}</p>
            </div>

            {/* DETAIL */}
            <div className="text-xs text-gray-600 space-y-1 mt-2">
              <p>• Kode Potongan: {selected.kodeStokPotongan}</p>
              <p>• Penjahit: {selected.namaPenjahit}</p>
              <p>
                • Tanggal:{" "}
                {new Date(selected.tanggalSelesaiJahit).toLocaleDateString(
                  "id-ID",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: false,
                  },
                )}
              </p>
            </div>

            {/* BUTTON */}
            <div className="flex justify-end mt-4 gap-2">
              <button
                className="bg-gray-100 px-3 py-1 text-xs rounded shadow"
                onClick={() => setSelected(null)}
              >
                Tutup
              </button>

              <button
                disabled={isPending}
                className="bg-orange-500 text-white px-3 py-1 text-xs rounded shadow disabled:opacity-50"
                onClick={() => {
                  prosesQC(selected.idQC, {
                    onSuccess: (data) => {
                      toast.success(data.message);
                      setSelected(null);
                    },
                  });
                }}
              >
                {isPending ? "Memproses..." : "Proses"}
              </button>
            </div>
          </div>

          {/* CLICK OUTSIDE */}
          <div className="absolute inset-0" onClick={() => setSelected(null)} />
        </div>
      )}
    </>
  );
}
