"use client";

import { useState } from "react";
import { ChevronDown, PackageSearch } from "lucide-react";
import { useGetBoxMasuk } from "@/services/stok-gudang/useGetBoxMasuk";
import BarcodeGenerator from "@/components/BarcodeGenerator";

export default function BoxMasuk() {
  const { data = [] } = useGetBoxMasuk();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {data.map((box: any) => {
        const isOpen = open === box.idBox;

        return (
          <div
            key={box.idBox}
            className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm"
          >
            {/* HEADER */}
            <p className="font-semibold text-gray-800 mb-2">{box.namaBox}</p>

            {/* COLLAPSE BUTTON */}
            <button
              onClick={() => setOpen(isOpen ? null : box.idBox)}
              className="w-full flex justify-between items-center bg-gray-50 border px-3 py-2 rounded-xl text-sm hover:bg-gray-100 transition"
            >
              <span className="flex items-center gap-2 text-gray-600">
                <PackageSearch size={16} />
                Lihat Isi Box
              </span>

              <ChevronDown
                size={16}
                className={`transition ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* CONTENT (SETELAH DI KLIK) */}
            {isOpen && (
              <div className="mt-3 space-y-3">
                {box.stokPotongan?.map((item: any) => (
                  <div
                    key={item.idQC}
                    className="bg-gray-50 border rounded-xl p-3"
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {item.namaBarang} - {item.ukuran}
                        </p>

                        <p className="text-xs text-gray-500">
                          Kode Stok Potongan: {item.kodeStokPotongan}
                        </p>

                        <p className="text-xs text-gray-400">
                          Tgl Selesai QC:{" "}
                          {new Date(item.tanggalSelesaiQC).toLocaleDateString(
                            "id-ID",
                          )}
                        </p>
                      </div>

                      <p className="font-bold text-gray-800">{item.jumlah}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* BARCODE */}
            <div className="mt-4 flex flex-col items-center">
              <BarcodeGenerator value={box.kodeBox} />

              <p className="text-[10px] text-gray-400 tracking-widest mt-1">
                {box.kodeBox}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
