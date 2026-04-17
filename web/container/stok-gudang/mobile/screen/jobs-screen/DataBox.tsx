"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, PackageSearch } from "lucide-react";

import {
  useGetDatabox,
  DataBox as IDataBox,
} from "@/services/stok-gudang/useGetDataBox";

import BarcodeGenerator from "@/components/BarcodeGenerator";

export default function DataBox({ search = "" }: { search?: string }) {
  const [selected, setSelected] = useState<IDataBox | null>(null);
  const [openCollapse, setOpenCollapse] = useState<string | null>(null);

  const { data: databoxData, isLoading, isError } = useGetDatabox();

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
        {filtered.map((box) => {
          const isOpen = openCollapse === box.idBox;

          return (
            <div
              key={box.idBox}
              className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm transition-all"
            >
              {/* HEADER CLICK = MODAL */}
              <div
                onClick={() => setSelected(box)}
                className="cursor-pointer hover:border-blue-300"
              >
                <p className="text-sm font-semibold mb-2">{box.namaBox}</p>

                <div className="text-[11px] text-gray-500 mb-2">
                  <p>Penerima: {box.namaPenerimaBox}</p>

                  <p>
                    Tanggal Masuk:{" "}
                    {new Date(box.tanggalMasukGudang).toLocaleDateString(
                      "id-ID",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  </p>
                </div>
              </div>

              {/* COLLAPSE BUTTON ONLY */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();

                  setOpenCollapse(isOpen ? null : box.idBox);
                }}
                className="w-full mt-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 flex items-center justify-between transition-all"
              >
                <span className="text-xs font-medium text-gray-700 flex items-center gap-2">
                  <PackageSearch size={15} />
                  Lihat Isi Box
                </span>

                <span
                  className={`transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  <ChevronDown size={16} />
                </span>
              </button>

              {/* COLLAPSE CONTENT */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? "max-h-[500px] opacity-100 mt-3"
                    : "max-h-0 opacity-0"
                }`}
              >
                {box.stokPotongan.length > 0 ? (
                  <div className="space-y-2">
                    {box.stokPotongan.map((item) => (
                      <div
                        key={item.idQC}
                        className="bg-gray-50 border border-gray-100 rounded-lg p-2"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs font-medium">
                              {item.namaBarang}
                            </p>

                            <p className="text-[10px] text-blue-600 font-bold">
                              Ukuran: {item.ukuran}
                            </p>
                          </div>

                          <p className="text-sm font-bold">{item.jumlah}</p>
                        </div>

                        <div className="text-[10px] text-gray-500 mt-2 pt-2 border-t border-gray-200">
                          {item.isUrgent && (
                            <p className="text-red-500 font-bold">URGENT</p>
                          )}

                          <p>Kode: {item.kodeStokPotongan}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-3 text-xs text-gray-400 italic">
                    Box Kosong
                  </p>
                )}
              </div>

              {/* BARCODE */}
              <div className="h-24 flex flex-col items-center justify-center text-[10px] text-gray-400 mt-3">
                <BarcodeGenerator value={box.kodeBox} />

                <span className="font-mono text-black text-[10px] mt-1 leading-none">
                  {box.kodeBox}
                </span>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-10 text-xs text-gray-400">
            Data box tidak ditemukan.
          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-auto animate-in fade-in zoom-in-95 duration-200">
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
                <span className="text-gray-400">Kode:</span> {selected.kodeBox}
              </p>
            </div>

            {/* DATA STOK POTONGAN DI ATAS BARCODE */}
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
                        <p className="text-red-500 font-bold">URGENT</p>
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

            {/* BARCODE */}
            <div className="mt-4 h-24 flex flex-col items-center justify-center text-gray-400">
              <BarcodeGenerator value={selected.kodeBox} />

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

          {/* OUTSIDE */}
          <div
            className="absolute inset-0 -z-10"
            onClick={() => setSelected(null)}
          />
        </div>
      )}
    </>
  );
}
