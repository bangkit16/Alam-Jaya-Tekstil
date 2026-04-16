"use client";

import { useState } from "react";
import { useGetQCSelesai, QCSelesaiBox } from "@/services/qc/useGetQCSelesai";
import BarcodeGenerator from "@/components/BarcodeGenerator";

export default function Selesai({ search = "" }: { search: string }) {
  const [selected, setSelected] = useState<QCSelesaiBox | null>(null);

  // ================= DATA FROM SERVICE =================
  const { data: boxes = [], isLoading } = useGetQCSelesai();

  // ================= DATA FILTERING =================
  const data = boxes.filter(
    (box) =>
      box.namaBox?.toLowerCase().includes(search.toLowerCase()) ||
      box.kodeBox?.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading)
    return <p className="text-center text-gray-400 text-sm p-5">Loading...</p>;

  return (
    <>
      {/* ================= LIST ================= */}
      <div className="flex flex-col gap-3">
        {data.length === 0 ? (
          <p className="text-center text-gray-400 text-sm">Tidak ada data</p>
        ) : (
          data.map((box) => (
            <div
              key={box.idBox}
              onClick={() => setSelected(box)}
              className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm cursor-pointer"
            >
              {/* TITLE */}
              <p className="text-sm font-semibold mb-2">{box.namaBox}</p>

              {/* INFO */}
              <div className="text-[11px] text-gray-500 mb-2">
                <p>
                  Nama Penanggung Jawab: <b>{box.namaPenanggungJawab}</b>
                </p>
              </div>

              {/* ITEMS (Preview items dari array stokPotongan) */}
              <div className="space-y-2">
                {box.stokPotongan.map((item) => (
                  <div key={item.idQC} className="border rounded-lg p-2">
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
