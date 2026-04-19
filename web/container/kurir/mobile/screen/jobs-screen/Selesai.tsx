"use client";

import { useState, useEffect, useRef } from "react";
import {
  KurirSelesaiResponse,
  SelesaiResponse,
  useGetKurirSelesaiInfinite,
} from "@/services/kurir/useGetKurirSelesai";
import { Package } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function Selesai({search} : {search: string}) {
  const [selectedJob, setSelectedJob] = useState<SelesaiResponse | null>(
    null,
  );
  // const [search, setSearch] = useState("");

  // Ref untuk elemen sensor di bawah list
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetKurirSelesaiInfinite(search);

  // Flatting data
  const allJobs = data?.pages.flatMap((page) => page.data) ?? [];

  // Implementasi Intersection Observer sesuai contoh Anda
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

  const handleClose = () => setSelectedJob(null);

  if (isLoading) {
    return (
      <LoadingSpinner />
    );
  }

  return (
    <>
      {/* ================= LIST ================= */}
      <div className="flex flex-col gap-3">
        {allJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <div className="bg-orange-100 text-orange-500 p-4 rounded-full mb-4">
              <Package size={30} />
            </div>

            <p className="font-semibold text-gray-500 mb-1">Belum ada Order</p>

            <p className="text-xs text-gray-400">Order akan muncul di sini</p>
          </div>
        ) : (
          allJobs.map((job) => (
            <div
              key={job.idProsesStokPotong}
              onClick={() => setSelectedJob(job)}
              className="border border-gray-300 rounded-sm p-3 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              {job.isUrgent && (
                <p className="text-xs text-red-500 font-semibold mb-2">
                  URGENT
                </p>
              )}
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-medium text-gray-800 leading-tight">
                    {job.namaBarang}
                  </p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                    {job.status.replaceAll("_", " ")}
                  </p>
                </div>
                <p className="text-lg font-bold text-gray-900">{job.jumlah}</p>
              </div>
              <ul className="text-xs text-gray-600 space-y-1 border-t pt-2 mt-2">
                <li className="flex justify-between">
                  <span>Dari:</span>{" "}
                  <span className="font-medium">{job.dikirimDari}</span>
                </li>
                <li className="flex justify-between">
                  <span>Tujuan:</span>{" "}
                  <span className="font-medium">{job.dikirimKe}</span>
                </li>
              </ul>
            </div>
          ))
        )}

        {/* ================= SENSOR / LOAD MORE REF ================= */}
        <div ref={loadMoreRef} className="py-6 flex justify-center">
          {isFetchingNextPage ? (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="w-4 h-4 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
              Memuat data...
            </div>
          ) : hasNextPage ? (
            <span className="text-[10px] text-gray-300 italic">
              Scroll ke bawah untuk memuat lagi
            </span>
          ) : allJobs.length > 0 ? (
            <span className="text-[10px] text-gray-300">
              Semua riwayat telah ditampilkan
            </span>
          ) : null}
        </div>
      </div>

      {/* ================= MODAL DETAIL ================= */}
      {selectedJob && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 backdrop-blur-sm"
          onClick={handleClose}
        >
          <div
            className="bg-white p-5 w-full max-w-sm shadow-2xl rounded-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h3 className="font-bold text-gray-800">Detail Pengiriman</h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-black"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-gray-400 uppercase font-bold">
                  Produk
                </label>
                <p className="text-sm font-semibold">
                  {selectedJob.namaBarang}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-gray-400 uppercase font-bold">
                    Jumlah
                  </label>
                  <p className="text-sm font-semibold">
                    {selectedJob.jumlah} Pcs
                  </p>
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 uppercase font-bold">
                    Kurir
                  </label>
                  <p className="text-sm font-semibold">
                    {selectedJob.namaKurir}
                  </p>
                </div>
              </div>
              <hr />
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Waktu Sampai:</span>
                <span className="font-medium">
                  {new Date(selectedJob.tanggalSampai).toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
