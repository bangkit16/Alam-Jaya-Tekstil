"use client";

import { useState } from "react";
import { useGetBoxMasuk } from "@/services/stok-resi/useGetBoxMasuk";
import { LoadingSpinner } from "@/components/LoadingSpinner";

type StokPotongan = {
  idQC: string;
  namaBarang: string;
  ukuran: string;
  jumlah: number;
  tanggalSelesaiQC: string;
  kodeStokPotongan: string;
  isUrgent: boolean;
};

type BoxMasukType = {
  idBox: string;
  namaBox: string;
  namaPenanggungJawab: string;
  kodeBox: string;
  tanggalMasukStok: string;
  stokPotongan: StokPotongan[];
};

export default function BoxMasuk() {
  const { data = [], isLoading } = useGetBoxMasuk() as {
    data: BoxMasukType[];
    isLoading: boolean;
  };

  const [selected, setSelected] = useState<BoxMasukType | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <LoadingSpinner />
      </div>
    );
  }

  // ================= MODAL =================
  if (selected) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-4 text-xs">
          {/* HEADER */}
          <p className="font-semibold mb-2">BOX - {selected.namaBox}</p>

          <ul className="text-[10px] text-gray-600 mb-2 list-disc ml-3">
            <li>Nama Penanggung jawab box</li>
            <li>Tanggal masuk box</li>
          </ul>

          {/* INPUT PENERIMA */}
          <input
            placeholder="Nama Penerima box (ORANG STOK RESI)"
            className="w-full px-2 py-2 border rounded mb-3"
          />

          {/* LIST ITEM */}
          <div className="space-y-2 max-h-52 overflow-auto">
            {selected.stokPotongan.map((item) => (
              <div key={item.idQC} className="border bg-gray-50 p-2 rounded">
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

          {/* BARCODE */}
          <div className="mt-3 h-10 bg-[repeating-linear-gradient(90deg,black,black_2px,white_2px,white_4px)]"></div>

          {/* ACTION */}
          <button className="mt-3 w-full bg-gray-200 py-2 rounded text-xs font-medium">
            ACC
          </button>

          {/* BACK */}
          <button
            onClick={() => setSelected(null)}
            className="mt-2 w-full text-gray-500 text-xs"
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
      {data.map((box) => (
        <div
          key={box.idBox}
          onClick={() => setSelected(box)}
          className="border p-3 rounded-lg bg-gray-50 cursor-pointer active:scale-[0.98] transition"
        >
          <p className="text-xs font-semibold mb-2">BOX - {box.namaBox}</p>

          {box.stokPotongan.map((item) => (
            <div key={item.idQC} className="border bg-white p-2 mb-2 rounded">
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

          {/* BARCODE */}
          <div className="mt-3 h-10 bg-[repeating-linear-gradient(90deg,black,black_2px,white_2px,white_4px)]"></div>
        </div>
      ))}
    </div>
  );
}
