"use client";

import { useState } from "react";
import { useGetDatabox, DataBox as IDataBox } from "@/services/stok-gudang/useGetDataBox"; // Sesuaikan path
import BarcodeGenerator from "@/components/BarcodeGenerator";

export default function DataBox({ search = "" }: { search?: string }) {
  const [selected, setSelected] = useState<IDataBox | null>(null);

  // ================= API DATA =================
  const { data: databoxData, isLoading, isError } = useGetDatabox();

  // Filter data berdasarkan search pada namaBox atau kodeBox
  const filtered =
    databoxData?.filter(
      (d) =>
        d.namaBox.toLowerCase().includes(search.toLowerCase()) ||
        d.kodeBox.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  if (isLoading)
    return (
      <div className="p-10 text-center text-xs text-gray-500">
        Memuat data box...
      </div>
    );
  if (isError)
    return (
      <div className="p-10 text-center text-xs text-red-500">
        Gagal mengambil data box.
      </div>
    );

  return (
    <>
      {/* ================= LIST ================= */}
      <div className="flex flex-col gap-3">
        {filtered.map((box) => (
          <div
            key={box.idBox}
            onClick={() => setSelected(box)}
            className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm cursor-pointer hover:border-blue-300 transition-colors"
          >
            {/* TITLE */}
            <p className="text-sm font-semibold mb-2">{box.namaBox}</p>

            {/* INFO */}
            <div className="text-[11px] text-gray-500 mb-2">
              <p>• {box.namaPenerimaBox}</p>
              <p>
                •{" "}
                {new Date(box.tanggalMasukGudang).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* BARCODE REPRESENTATION */}
            <div className=" h-24 bg-gray-50 border-2 border-dashed rounded flex flex-col items-center justify-center text-[10px] text-gray-400">
              {/* Barcode Asli */}
              <BarcodeGenerator value={box.kodeBox} />

              {/* Label Teks Kamu */}
              <span className="font-mono text-black text-[10px] mt-1 leading-none">
                {box.kodeBox}
              </span>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-10 text-xs text-gray-400">
            Data box tidak ditemukan.
          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-auto">
            {/* TITLE */}
            <p className="text-sm font-semibold mb-2">{selected.namaBox}</p>

            {/* INFO */}
            <div className="text-xs text-gray-600 mb-3 space-y-1">
              <p>
                <span className="text-gray-400">Penerima:</span>{" "}
                {selected.namaPenerimaBox}
              </p>
              <p>
                <span className="text-gray-400">Masuk:</span>{" "}
                {new Date(selected.tanggalMasukGudang).toLocaleString("id-ID")}
              </p>
              <p>
                <span className="text-gray-400">Kode:</span>{" "}
                {selected.kodeBox}
              </p>
            </div>

            {/* ITEMS (Stok Potongan) */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Isi Box:
              </p>
              {selected.stokPotongan.length > 0 ? (
                selected.stokPotongan.map((item) => (
                  <div
                    key={item.idQC}
                    className="bg-gray-50 border border-gray-100 rounded-lg p-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-medium">{item.namaBarang}</p>
                        <p className="text-[10px] text-blue-600 font-bold">
                          Ukuran: {item.ukuran}
                        </p>
                      </div>
                      <p className="text-sm font-bold">{item.jumlah}</p>
                    </div>

                    <div className="text-[10px] text-gray-500 mt-2 pt-2 border-t border-gray-200">
                      {item.isUrgent && (
                        <p className="text-red-500 font-bold text-md">URGENT</p>
                      )}
                      <p>Kode: {item.kodeStokPotongan}</p>
                      <p>
                        QC Selesai:{" "}
                        {new Date(item.tanggalSelesaiQC).toLocaleDateString(
                          "id-ID",
                        )}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-4 text-xs text-gray-400 italic">
                  Box Kosong
                </p>
              )}
            </div>

            {/* BARCODE LARGE */}
            <div className="mt-4 h-24 bg-gray-50 border-2 border-dashed rounded flex flex-col items-center justify-center text-gray-400">
              <BarcodeGenerator value={selected.kodeBox} />

              {/* Label Teks Kamu */}
              <span className="font-mono text-black text-[10px] mt-1 leading-none">
                {selected.kodeBox}
              </span>
            </div>

            {/* CLOSE */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelected(null)}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors font-medium text-gray-600"
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
