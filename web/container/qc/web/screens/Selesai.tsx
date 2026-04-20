"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";

import { useGetQCSelesai } from "@/services/qc/useGetQCSelesai";
import BarcodeGenerator from "@/components/BarcodeGenerator";

export default function Selesai() {
  const { data = [], isLoading } = useGetQCSelesai();
  const [selected, setSelected] = useState<any>(null);

  if (isLoading) return <p className="text-center py-4">Loading...</p>;

  return (
    <>
      {/* ================= CARD ================= */}
      <div className="bg-white rounded-2xl p-6 shadow">
        {data.length === 0 ? (
          <Empty />
        ) : (
          <div className="space-y-4">
            {data.map((item: any) => (
              <div
                key={item.idBox}
                onClick={() => setSelected(item)}
                className="border rounded-2xl p-4 cursor-pointer hover:bg-gray-50 transition"
              >
                {/* HEADER */}
                <p className="font-semibold text-gray-800 mb-1">
                  {item.namaBox}
                </p>

                <p className="text-xs text-gray-500 mb-3">
                  Nama Penanggung Jawab:{" "}
                  <span className="font-medium">
                    {item.namaPenanggungJawab}
                  </span>
                </p>

                {/* LIST ISI BOX */}
                <div className="space-y-2 mb-4">
                  {item.stokPotongan?.map((stok: any) => (
                    <div
                      key={stok.idQC}
                      className="bg-gray-50 border rounded-xl p-3 flex justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {stok.namaBarang} - {stok.ukuran}
                        </p>

                        <p className="text-xs text-gray-400">
                          • {stok.kodeStokPotongan}
                        </p>

                        <p className="text-xs text-gray-400">
                          •{" "}
                          {new Date(stok.tanggalSelesaiQC).toLocaleDateString(
                            "id-ID",
                          )}
                        </p>
                      </div>

                      <p className="font-semibold">{stok.jumlah}</p>
                    </div>
                  ))}
                </div>

                {/* BARCODE */}
                <div className="flex flex-col items-center">
                  <BarcodeGenerator value={item.kodeBox} />

                  <p className="text-[10px] text-gray-400 tracking-widest mt-1">
                    {item.kodeBox}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {selected && (
        <Modal onClose={() => setSelected(null)}>
          {/* HEADER */}
          <div className="mb-4">
            <p className="text-lg font-semibold">{selected.namaBox}</p>

            <p className="text-xs text-gray-500">
              Nama Penanggung Jawab:{" "}
              <span className="font-medium">
                {selected.namaPenanggungJawab}
              </span>
            </p>

            <p className="text-xs text-gray-400">
              Tanggal Masuk Stok:{" "}
              {new Date(selected.tanggalMasukStok).toLocaleString("id-ID")}
            </p>
          </div>

          {/* LIST */}
          <div className="space-y-3 mb-5">
            {selected.stokPotongan?.map((stok: any) => (
              <div
                key={stok.idQC}
                className="bg-gray-100 rounded-xl p-3 flex justify-between"
              >
                <div>
                  <p className="text-sm font-medium">
                    {stok.namaBarang} - {stok.ukuran}
                  </p>

                  <p className="text-xs text-gray-500">
                    • Kode Stok Potongan: {stok.kodeStokPotongan}
                  </p>

                  <p className="text-xs text-gray-500">
                    • Selesai QC:{" "}
                    {new Date(stok.tanggalSelesaiQC).toLocaleString("id-ID")}
                  </p>
                </div>

                <p className="font-semibold">{stok.jumlah}</p>
              </div>
            ))}
          </div>

          {/* BARCODE */}
          <div className="flex flex-col items-center mb-5">
            <BarcodeGenerator value={selected.kodeBox} />

            <p className="text-[10px] text-gray-400 tracking-widest mt-1">
              {selected.kodeBox}
            </p>
          </div>

          {/* BUTTON */}
          <button
            onClick={() => setSelected(null)}
            className="w-full bg-gray-200 py-2 rounded-xl text-sm"
          >
            Tutup
          </button>
        </Modal>
      )}
    </>
  );
}

function Empty() {
  return (
    <div className="flex flex-col items-center py-16 text-gray-400">
      <div className="bg-green-100 text-green-500 p-4 rounded-full mb-3">
        <CheckCircle />
      </div>
      <p className="font-medium">Belum ada data selesai</p>
    </div>
  );
}

function Modal({ children, onClose }: any) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
