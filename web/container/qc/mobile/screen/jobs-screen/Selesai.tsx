"use client";

import { useEffect, useRef, useState } from "react";
import {
  useGetQCSelesai,
  QCSelesaiBox,
  useGetQCSelesaiInfinite,
} from "@/services/qc/useGetQCSelesai";
import BarcodeGenerator from "@/components/BarcodeGenerator";
import { ChevronDown, Package, PackageSearch } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function Selesai({ search = "" }: { search: string }) {
  const [selected, setSelected] = useState<QCSelesaiBox | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  // ================= DATA FROM SERVICE =================
  // const { data: boxes = [], isLoading } = useGetQCSelesai();
  const {
    data: dataSelesai,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
  } = useGetQCSelesaiInfinite();
  const boxes = dataSelesai?.pages.flatMap((page) => page.data) ?? [];
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

  // ================= DATA FILTERING =================
  const data = boxes.filter(
    (box) =>
      box.namaBox?.toLowerCase().includes(search.toLowerCase()) ||
      box.kodeBox?.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      {/* ================= LIST ================= */}
      <div className="flex flex-col gap-3">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <div className="bg-orange-100 text-orange-500 p-4 rounded-full mb-4">
              <Package size={30} />
            </div>

            <p className="font-semibold text-gray-500 mb-1">Belum ada Box</p>

            <p className="text-xs text-gray-400">
              Data Box akan muncul di sini
            </p>
          </div>
        ) : (
          data.map((box) => (
            <div
              key={box.idBox}
              onClick={() => setSelected(box)}
              className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm cursor-pointer h-fit"
            >
              {/* TITLE */}
              <p className="text-sm font-semibold mb-2">{box.namaBox}</p>

              {/* INFO */}
              <div className="text-[11px] text-gray-500 mb-2">
                <p>
                  Nama Penanggung Jawab: <b>{box.namaPenanggungJawab}</b>
                </p>
              </div>

              {/* TOMBOL COLLAPSIBLE */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Mencegah setSelected terpanggil
                  setOpenId(openId === box.idBox ? null : box.idBox);
                }}
                className="w-full flex justify-between items-center bg-gray-50 border px-3 py-2 rounded-lg text-[11px] hover:bg-gray-100 transition mb-2"
              >
                <span className="flex items-center gap-2 text-gray-600 font-medium">
                  <PackageSearch size={16} />
                  Lihat Isi Box
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ${
                    openId === box.idBox ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* ITEMS DENGAN ANIMASI COLLAPSE */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  openId === box.idBox
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="space-y-2 pb-1">
                    {box.stokPotongan.map((item) => (
                      <div
                        key={item.idQC}
                        className="border rounded-lg p-2 bg-white"
                      >
                        <div className="flex justify-between">
                          <p className="text-xs">
                            {item.namaBarang} - {item.ukuran}
                          </p>
                          <p className="text-sm font-bold">{item.jumlah}</p>
                        </div>
                        <div className="text-[10px] text-gray-500">
                          <p>• {item.kodeStokPotongan}</p>
                          <p>
                            •{" "}
                            {new Date(item.tanggalSelesaiQC).toLocaleDateString(
                              "id-ID",
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* BARCODE */}
              <div className="mt-3 h-20 flex-col rounded-lg flex items-center justify-center">
                <BarcodeGenerator value={box.kodeBox} />
                <span className="text-[10px] text-gray-400 tracking-widest uppercase">
                  {box.kodeBox}
                </span>
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
          <div className="bg-white w-[90%] max-w-sm rounded-2xl p-4 shadow-xl">
            {/* TITLE */}
            <p className="text-xl font-semibold mb-2">{selected.namaBox}</p>

            {/* INFO */}
            <div className="text-xs text-gray-600 mb-4">
              <p>
                Nama Penanggung Jawab: <b>{selected.namaPenanggungJawab}</b>
              </p>
              <p>
                Tanggal Masuk Stok:{" "}
                <b>
                  {new Date(selected.tanggalMasukStok).toLocaleString("id-ID")}
                </b>
              </p>
            </div>

            {/* ITEMS */}
            <div className="space-y-4 max-h-[400px] overflow-auto">
              {selected.stokPotongan.map((item) => (
                <div key={item.idQC} className="bg-gray-100 rounded-lg p-2">
                  <div className="flex justify-between">
                    <p className="text-sm">
                      {item.namaBarang} - {item.ukuran}
                    </p>
                    <p className="text-md font-bold">{item.jumlah}</p>
                  </div>

                  <div className="text-xs text-gray-500">
                    <p>• Kode Stok Potongan: {item.kodeStokPotongan}</p>
                    <p>
                      • Selesai QC:{" "}
                      {new Date(item.tanggalSelesaiQC).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* BARCODE */}
            <div className="mt-4 h-20 rounded-lg flex flex-col items-center justify-center gap-1">
              <BarcodeGenerator value={selected.kodeBox} />
              <span className="text-[10px] text-gray-400 tracking-widest font-mono">
                {selected.kodeBox}
              </span>
            </div>

            {/* CLOSE */}
            <div className="flex justify-end mt-3">
              <button
                className="text-xs text-gray-500 hover:text-gray-800"
                onClick={() => setSelected(null)}
              >
                Tutup
              </button>
            </div>
          </div>

          {/* CLICK OUTSIDE */}
          <div
            className="absolute inset-0 -z-10"
            onClick={() => setSelected(null)}
          />
        </div>
      )}
    </>
  );
}
