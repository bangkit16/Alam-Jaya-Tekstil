"use client";

import { useEffect, useRef, useState } from "react";
import {
  PenjahitMenunggu,
  useGetPenjahitMenungguInfinite,
} from "@/services/jahit/useGetPenjahitMenunggu"; // Sesuaikan path hook
import { usePutMulaiJahit } from "@/services/jahit/usePutMulaiJahit";
import { toast } from "sonner";
import { Package } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function Menunggu() {
  const [selected, setSelected] = useState<PenjahitMenunggu | null>(null);

  // 🔥 Integrasi Hook TanStack Query
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    refetch,
  } = useGetPenjahitMenungguInfinite();
  const apiData = data?.pages.flatMap((page) => page.data) ?? [];
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

  const mutation = usePutMulaiJahit();

  const handleClose = () => {
    setSelected(null);
  };

  const handleProses = async (job: PenjahitMenunggu) => {
    try {
      // Eksekusi API PUT ke server
      await mutation.mutate(job.idProsesStokPotong, {
        onSuccess: (data) => {
          toast.success(data.message);
          handleClose();
        },
      });

      // Jika sukses, tutup modal (Invalidasi data diurus otomatis oleh hook)
    } catch (error) {
      // Error sudah dihandle oleh alert di dalam hook
      console.error("Mutation failed", error);
    }
  };

  if (isError) {
    return (
      <div className="p-4 text-center border border-red-200 bg-red-50 rounded-sm">
        <p className="text-xs text-red-600 mb-2">Gagal memuat data</p>
        <button
          onClick={() => refetch()}
          className="text-[10px] bg-white border px-2 py-1 uppercase font-bold"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <>
      {/* ================= LIST ================= */}
      <div className="flex flex-col gap-3">
        {isLoading ? (
          <LoadingSpinner />
        ) : apiData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <div className="bg-orange-100 text-orange-500 p-4 rounded-full mb-4">
              <Package size={30} />
            </div>
            <p className="font-semibold text-gray-500 mb-1">
              Belum ada Jahitan
            </p>
            <p className="text-xs text-gray-400">Jahitan akan muncul di sini</p>
          </div>
        ) : (
          apiData.map((job) => (
            <div
              key={job.idProsesStokPotong}
              onClick={() => setSelected(job)}
              className="border rounded-sm p-3 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-2">
                <div>
                  {job.isUrgent && (
                    <span className="text-sm font-bold text-red-600 uppercase">
                      Urgent
                    </span>
                  )}
                  <p className="text-sm font-medium text-gray-800">
                    {job.namaBarang} - {job.ukuran}
                  </p>
                </div>
                <p className="text-lg font-bold text-gray-900">{job.jumlah}</p>
              </div>

              {/* DETAIL */}
              <ul className="text-xs text-gray-700 space-y-1">
                <li>
                  • Kode:{" "}
                  <span className="font-mono">{job.kodeStokPotongan}</span>
                </li>
                <li>
                  • Dikirim:{" "}
                  {new Date(job.tanggalKirim).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </li>
              </ul>
            </div>
          ))
        )}
        <div ref={loadMoreRef} className="py-4 flex justify-center">
          {isFetchingNextPage && (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              Memuat data...
            </div>
          )}
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          onClick={handleClose}
        >
          <div
            className="bg-white p-4 w-full max-w-sm shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-3">
              <div>
                {selected.isUrgent && (
                  <span className="text-sm font-bold text-red-600 uppercase">
                    Urgent
                  </span>
                )}
                <p className="text-sm font-medium text-gray-800">
                  {selected.namaBarang} - {selected.ukuran}
                </p>
              </div>

              <p className="text-xl font-bold text-gray-900">
                {selected.jumlah}
              </p>
            </div>

            {/* DETAIL */}
            <ul className="text-xs text-gray-700 space-y-2 mb-6 border-t pt-3">
              <li className="flex justify-between">
                <span className="text-gray-400">Kode Stok</span>
                <span className="font-bold">{selected.kodeStokPotongan}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Tanggal Kirim</span>
                <span>
                  {new Date(selected.tanggalKirim).toLocaleString("id-ID")}
                </span>
              </li>
            </ul>

            {/* BUTTON */}
            <div className="flex gap-2">
              <button
                onClick={() => handleProses(selected)}
                disabled={mutation.isPending} // Disable saat loading
                className="flex-1 bg-orange-500 text-white text-xs py-2.5 rounded-sm font-bold disabled:bg-orange-300"
              >
                {mutation.isPending ? "MEMPROSES..." : "PROSES"}
              </button>

              <button
                onClick={handleClose}
                className="flex-1 bg-gray-200 text-gray-800 text-xs py-2.5 rounded-sm font-bold active:bg-gray-300"
              >
                TIDAK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
