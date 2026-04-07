"use client";

import { useGetStokKirim } from "@/services/potong/useGetStokKirim";
import { useState } from "react";

type StokKirimType = {
  id_stok_potong: string;
  id_permintaan: string;
  ukuran: string;
  is_urgent: boolean;
  nama_produk: string;
  jumlah_lolos: number;
  jumlah_permintaan: number;
  kode_potongan: string;
  kode_kain: string;
  pengecek: string;
  penjahit: string;
  admin: string;
  tanggal_kirim: string;
};

export default function Kirim() {
  const [selectedStokKirim, setSelectedStokKirim] =
    useState<StokKirimType | null>(null);
  const { data: dataStokKirim, isLoading: isLoadingStokKirim } =
    useGetStokKirim();

  return (
    <>
      {/* ================= LIST ================= */}
      <div className="flex flex-col gap-3 overflow-y-auto">
        {isLoadingStokKirim ? (
          <p className="text-center py-10">Loading...</p>
        ) : dataStokKirim && dataStokKirim.length > 0 ? (
          dataStokKirim.map((stokkirim: StokKirimType, index: number) => (
            <div
              key={`${stokkirim.id_permintaan ?? stokkirim.kode_kain}-${index}`}
              onClick={() => {
                setSelectedStokKirim(stokkirim);
              }}
              className="border border-gray-300 rounded-2xl p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex-row w-full justify-between align-middle items-center">
                {stokkirim.is_urgent && (
                  <p className="text-red-500 text-sm uppercase font-semibold">
                    Urgent
                  </p>
                )}
                <p className="text-sm font-semibold text-gray-800 my-1">
                  {stokkirim.nama_produk} - {stokkirim.ukuran}
                </p>
                <div className="space-y-0.5">
                  <p className="text-xs font-medium text-gray-400">
                    NAMA PENJAHIT :{" "}
                    <span className="font-bold text-gray-600">
                      {stokkirim.penjahit}
                    </span>
                  </p>
                  <p className="text-xs font-medium text-gray-400">
                    ADMIN :{" "}
                    <span className="font-bold text-gray-600">
                      {stokkirim.admin}
                    </span>
                  </p>
                  <p className="text-xs font-medium text-gray-400">
                    TANGGAL KIRIM :{" "}
                    <span className="font-bold text-gray-600">
                      {stokkirim.tanggal_kirim
                        ? new Date(stokkirim.tanggal_kirim).toLocaleDateString(
                            "id-ID",
                          )
                        : "-"}
                    </span>
                  </p>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-800">
                  {stokkirim.jumlah_permintaan}
                </p>
              </div>
            </div>
          ))
        ) : (
          /* TAMPILAN DATA KOSONG */
          <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-500 font-medium">Data Kosong</p>
          </div>
        )}
      </div>

      {/* ================= MODAL STOK KIRIM ================= */}
      {selectedStokKirim && (
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedStokKirim(null)}
        >
          <div
            className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-1">
                  Detail Produk
                </p>
                <p className="text-lg font-bold text-gray-800 leading-tight">
                  {selectedStokKirim.nama_produk}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-gray-900 leading-none">
                  {selectedStokKirim.jumlah_permintaan || 0}
                </p>
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter">
                  Unit
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {/* PROSES */}
              <section>
                <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest border-b border-gray-100 pb-1">
                  Proses Produksi
                </p>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <p className="text-gray-400">Kode Potong</p>
                  <p className="text-gray-700 font-medium text-right">
                    {selectedStokKirim.kode_potongan || "-"}
                  </p>

                  <p className="text-gray-400">Jumlah Lolos</p>
                  <p className="text-green-600 font-bold text-right">
                    {selectedStokKirim.jumlah_lolos || 0}
                  </p>

                  <p className="text-gray-400">Pengecek</p>
                  <p className="text-gray-700 font-medium text-right">
                    {selectedStokKirim.pengecek || "-"}
                  </p>
                </div>
              </section>

              {/* STOK */}
              <section className="bg-gray-50 p-3 rounded-lg">
                <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">
                  Stok Potong
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">Status Ready</p>
                  <p className="text-sm font-bold text-gray-800">
                    {selectedStokKirim.jumlah_lolos || 0} Pcs
                  </p>
                </div>
              </section>

              {/* KIRIM */}
              <section>
                <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest border-b border-gray-100 pb-1">
                  Logistik Penjahit
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <p className="text-gray-400">Penjahit</p>
                    <p className="text-gray-700 font-semibold">
                      {selectedStokKirim.penjahit || "-"}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-400">Admin</p>
                    <p className="text-gray-700">
                      {selectedStokKirim.admin || "-"}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-400">Tanggal</p>
                    <p className="text-gray-700 italic">
                      {selectedStokKirim.tanggal_kirim
                        ? new Date(
                            selectedStokKirim.tanggal_kirim,
                          ).toLocaleDateString("id-ID")
                        : "-"}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* CLOSE BUTTON (Optional for Mobile UX) */}
            <button
              className="w-full mt-6 py-3 bg-gray-900 text-white rounded-xl font-semibold text-sm active:scale-95 transition-transform"
              onClick={() => setSelectedStokKirim(null)}
            >
              Tutup Detail
            </button>
          </div>
        </div>
      )}
    </>
  );
}
