"use client";

import { useState } from "react";
import { ChevronDown, PackageSearch } from "lucide-react";
import { useGetDatabox } from "@/services/stok-gudang/useGetDataBox";
import BarcodeGenerator from "@/components/BarcodeGenerator";

export default function DataBox() {
  const { data = [] } = useGetDatabox();
  const [open, setOpen] = useState<string | null>(null);
  const [selectedBox, setSelectedBox] = useState<any>(null);

  return (
    <>
      <div className="grid md:grid-cols-2 gap-4">
        {data.map((box: any) => {
          const isOpen = open === box.idBox;

          return (
            <div
              key={box.idBox}
              className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm"
            >
              {/* HEADER */}
              <p
                className="font-semibold text-gray-800  hover:cursor-pointer"
                onClick={() => setSelectedBox(box)}
              >
                {box.namaBox}
              </p>

              <div className="text-xs text-gray-500 mt-1 mb-3">
                <p>Penerima: {box.namaPenerimaBox}</p>
                <p>
                  Tanggal Masuk:{" "}
                  {new Date(box.tanggalMasukGudang).toLocaleDateString("id-ID")}
                </p>
              </div>

              {/* BUTTON */}
              <button
                onClick={() => setOpen(isOpen ? null : box.idBox)}
                className="w-full flex justify-between items-center bg-gray-50 border px-3 py-2 rounded-xl text-sm hover:bg-gray-100 transition"
              >
                <span className="flex items-center gap-2 text-gray-600 hover:cursor-pointer">
                  <PackageSearch size={16} />
                  Lihat Isi Box
                </span>

                <ChevronDown
                  size={16}
                  className={`transition ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* CONTENT */}
              {isOpen && (
                <div className="mt-3 space-y-3">
                  {box.stokPotongan?.map((item: any) => (
                    <div
                      key={item.idQC}
                      className="bg-gray-50 border rounded-xl p-3"
                    >
                      {/* HEADER ITEM */}
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {item.namaBarang}
                          </p>

                          <p className="text-xs text-blue-600 font-semibold">
                            Ukuran: {item.ukuran}
                          </p>
                        </div>

                        <p className="font-bold text-gray-800">{item.jumlah}</p>
                      </div>

                      {/* DETAIL */}
                      <div className="mt-2 text-xs text-gray-500 border-t pt-2">
                        {item.isUrgent && (
                          <p className="text-red-500 font-bold mb-1">URGENT</p>
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

      {selectedBox && (
        <Modal
          onClose={() => {
            setSelectedBox(null);
          }}
        >
          <div className="">
            {/* HEADER */}
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-800 tracking-tight">
                {selectedBox.namaBox}
              </h3>
              <p className="text-sm font-mono text-orange-600 font-bold tracking-widest">
                {selectedBox.kodeBox}
              </p>
            </div>

            {/* INFO - Style Detail List Justify Between */}
            <ul className="text-sm text-gray-700 space-y-2 mb-6 border-t pt-3">
              <li className="flex justify-between">
                <span className="text-gray-400">Penerima Box</span>
                <span className="font-bold">
                  {selectedBox.namaPenerimaBox}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Tanggal Masuk Gudang</span>
                <span className="font-bold">
                  {new Date(selectedBox.tanggalMasukGudang).toLocaleString(
                    "id-ID",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    },
                  )}
                </span>
              </li>
            </ul>

            {/* DETAIL ISI BOX */}
            <div className="mb-6">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-3 tracking-wider">
                Detail Isi Box
              </p>
              <div className="space-y-3 max-h-48 overflow-auto pr-1">
                {selectedBox.stokPotongan?.map((item: any) => (
                  <div
                    key={item.idQC}
                    className="bg-gray-50 border border-gray-100 rounded-sm p-3 flex justify-between items-start"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-gray-800">
                        {item.namaBarang} - {item.ukuran}
                      </p>
                      <p className="text-[10px] text-gray-500 font-mono">
                        KODE: {item.kodeStokPotongan}
                      </p>
                    </div>
                    <p className="text-lg font-black text-gray-900">
                      {item.jumlah}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* BARCODE SECTION */}
            <div className="flex flex-col items-center p-4 bg-white border border-dashed border-gray-200 rounded-sm mb-6">
              <BarcodeGenerator value={selectedBox.kodeBox} />
              <p className="text-[10px] text-gray-400 tracking-[0.3em] mt-2 font-mono uppercase">
                {selectedBox.kodeBox}
              </p>
            </div>

            {/* ACTION BUTTON */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setSelectedBox(null);
                }}
                className="w-full bg-gray-200 text-gray-800 py-2.5 rounded-sm font-bold text-xs transition"
              >
                BATAL
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

function Modal({ children, onClose }: any) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-5 rounded-2xl shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
