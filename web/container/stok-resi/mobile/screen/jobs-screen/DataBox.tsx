"use client";

import { useState } from "react";
import { useGetDataBox } from "@/services/stok-resi/useGetDataBox";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import BarcodeGenerator from "@/components/BarcodeGenerator"; // ✅ TAMBAHAN

export default function DataBox() {
  const { data = [], isLoading } = useGetDataBox();

  const [selected, setSelected] = useState<any>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-2">
        <LoadingSpinner />
        <p className="text-[10px] text-gray-400">Memuat data box...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <p className="text-xs text-center text-gray-400 py-10">
        Tidak ada data box
      </p>
    );
  }

  // ================= MODAL =================
  if (selected) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-4 text-xs">
          {/* HEADER */}
          <p className="font-semibold mb-2">BOX - {selected.namaBox}</p>

          <ul className="text-[10px] text-gray-600 mb-3 list-disc ml-3">
            <li>Nama Penanggung jawab box</li>
            <li>Tanggal masuk box</li>
            <li>Nama penerima box</li>
          </ul>

          {/* LIST ITEM */}
          <div className="space-y-2 max-h-52 overflow-auto">
            {selected.stokPotongan?.map((item: any) => (
              <div key={item.idQC} className="bg-gray-50 border rounded p-2">
                <div className="flex justify-between">
                  <p className="text-xs font-medium">
                    {item.namaBarang} - {item.ukuran}
                  </p>
                  <p className="text-sm font-bold">{item.jumlah}</p>
                </div>

                <ul className="text-[10px] text-gray-500 mt-1 list-disc ml-3">
                  <li>{item.kodeStokPotongan}</li>
                  <li>{item.tanggalSelesaiQC}</li>
                </ul>
              </div>
            ))}
          </div>

          {/* ✅ BARCODE FIX */}
          <div className="mt-3 flex justify-center">
            <BarcodeGenerator value={selected.kodeBox || selected.namaBox} />
          </div>

          {/* BACK */}
          <button
            onClick={() => setSelected(null)}
            className="mt-3 w-full text-gray-500 text-xs"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // ================= LIST =================
  return (
    <div className="space-y-3">
      {data.map((box: any) => (
        <div
          key={box.idBox}
          onClick={() => setSelected(box)}
          className="border p-3 rounded-xl bg-gray-50 shadow-sm cursor-pointer active:scale-[0.98] transition"
        >
          {/* HEADER */}
          <p className="text-xs font-semibold mb-1">BOX - {box.namaBox}</p>

          <ul className="text-[10px] text-gray-500 mb-2 list-disc ml-3">
            <li>Nama penerima Box</li>
            <li>Tgl Masuk Resi</li>
          </ul>

          {/* ✅ BARCODE FIX */}
          <div className="flex justify-center mt-2">
            <BarcodeGenerator value={box.kodeBox || box.namaBox} />
          </div>
        </div>
      ))}
    </div>
  );
}
