"use client";

import { useState } from "react";
import { useGetQCProses, QCProses } from "@/services/qc/useGetQCProses"; // Sesuaikan path ini

export default function Proses({ search = "" }: { search: string }) {
  const [selected, setSelected] = useState<QCProses | null>(null);

  // ================= DATA FROM SERVICE =================
  const { data: orders = [], isLoading, isError } = useGetQCProses();

  // ================= FILTER LOGIC =================
  const filteredData = orders.filter((o) =>
    o.namaBarang.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center p-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-red-500 text-sm p-5">
        Gagal memuat data proses QC.
      </p>
    );
  }

  return (
    <>
      {/* ================= LIST ================= */}
      <div className="flex flex-col gap-2">
        {filteredData.length === 0 ? (
          <p className="text-center text-gray-400 text-sm">Tidak ada data</p>
        ) : (
          filteredData.map((o) => (
            <div
              key={o.idQC}
              onClick={() => setSelected(o)}
              className="bg-white border-2 border-gray-200 rounded-xl p-3 cursor-pointer hover:border-blue-300 transition-colors"
            >
              {o.isUrgent && (
                <span className="mb-2 inline-block bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  URGENT
                </span>
              )}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium">{o.namaBarang} - {o.ukuran}</p>
                  <p className="text-[10px] text-gray-400 mt-1"><b> Kode Potongan:</b> {o.kodeStokPotongan}</p>
                  <p className="text-[10px] text-gray-400 mt-1"><b> Tanggal Selesai Jahit: </b> {new Date(o.tanggalSelesaiJahit).toLocaleDateString("id-ID")}</p>
                  <p className="text-[10px] text-gray-400 mt-1"><b> Tanggal Mulau QC: </b> {new Date(o.tanggalMulaiQC).toLocaleDateString("id-ID")}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{o.jumlahSelesaiJahit}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= MODAL ================= */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white w-[90%] max-w-sm rounded-2xl p-4 shadow-xl relative">
            {/* HEADER */}
            <div className="flex justify-between mb-2">
              <div>
                <p className="font-medium text-sm">{selected.namaBarang}</p>
                <p className="text-[10px] text-gray-500">Ukuran: {selected.ukuran}</p>
              </div>
              <p className="font-bold text-xl text-blue-600">{selected.jumlahSelesaiJahit}</p>
            </div>

            {/* INFO */}
            <div className="text-xs text-gray-600 space-y-1 mt-4 border-t pt-3">
              <p>
                <span className="text-gray-400">Kode Potongan:</span> {selected.kodeStokPotongan}
              </p>
              <p>
                <span className="text-gray-400">Penjahit:</span> {selected.namaPenjahit}
              </p>
              <p>
                <span className="text-gray-400">Tgl Selesai Jahit:</span>{" "}
                {new Date(selected.tanggalSelesaiJahit).toLocaleDateString("id-ID")}
              </p>
            </div>

            {/* QC BOX (Note: Data klasifikasi tidak ada di GET /qc/proses, ini placeholder UI) */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 mt-4 text-xs space-y-2">
              <p className="font-semibold text-gray-700">STATUS QC</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                 <div className="bg-white p-2 rounded border border-gray-100">
                    <p className="text-gray-400 text-[10px]">Mulai QC</p>
                    <p className="font-medium">{new Date(selected.tanggalMulaiQC).toLocaleTimeString("id-ID")}</p>
                 </div>
                 <div className="bg-white p-2 rounded border border-gray-100">
                    <p className="text-gray-400 text-[10px]">Prioritas</p>
                    <p className={`font-medium ${selected.isUrgent ? 'text-red-500' : 'text-green-500'}`}>
                      {selected.isUrgent ? 'Tinggi' : 'Normal'}
                    </p>
                 </div>
              </div>
            </div>

            {/* BUTTON */}
            <div className="flex gap-2 mt-5">
              <button
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 text-xs rounded-xl transition-colors"
                onClick={() => setSelected(null)}
              >
                Tutup
              </button>
              <button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 text-xs rounded-xl shadow-md transition-colors"
                onClick={() => {
                  console.log("Submit data untuk ID:", selected.idQC);
                  setSelected(null);
                }}
              >
                Selesaikan QC
              </button>
            </div>

            {/* CLOSE ICON */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
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