"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";

import { useGetQCSelesai } from "@/services/qc/useGetQCSelesai";
import { ChevronDown, PackageSearch } from "lucide-react";
import BarcodeGenerator from "@/components/BarcodeGenerator";
import Pagination from "@/components/Pagination";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function Selesai() {
  const [page, setPage] = useState(1);
  const { data: dataSelesai, isLoading } = useGetQCSelesai(page);

  const data = dataSelesai?.data || [];
  const meta = dataSelesai?.meta;

  const [selected, setSelected] = useState<any>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <>
      {/* ================= CARD ================= */}
      <div className="bg-white rounded-2xl p-6 shadow">
        {isLoading ? (
          <LoadingSpinner />
        ) : data.length === 0 ? (
          <Empty />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {data.map((item: any) => {
              const isOpen = openId === item.idBox;

              return (
                <div
                  key={item.idBox}
                  onClick={() => setSelected(item)}
                  className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm h-fit"
                >
                  {/* HEADER */}
                  <p className="font-semibold text-gray-800">{item.namaBox}</p>

                  <div className="text-xs text-gray-500 mt-1 mb-3">
                    <p>
                      Nama Penanggung Jawab:{" "}
                      <span className="font-medium">
                        {item.namaPenanggungJawab}
                      </span>
                    </p>
                  </div>

                  {/* BUTTON COLLAPSIBLE */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Agar tidak mentrigger setSelected(item)
                      setOpenId(isOpen ? null : item.idBox);
                    }}
                    className="w-full flex justify-between items-center bg-gray-50 border px-3 py-2 rounded-xl text-sm hover:bg-gray-100 transition"
                  >
                    <span className="flex items-center gap-2 text-gray-600">
                      <PackageSearch size={16} />
                      Lihat Isi Box
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* LIST ISI BOX (Collapsible Content) */}
                  {isOpen && (
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100 mt-3"
                          : "grid-rows-[0fr] opacity-0 mt-0"
                      }`}
                    >
                      {/* 2. INNER DIV: Wajib pakai overflow-hidden */}
                      <div className="overflow-hidden">
                        <div className="space-y-2">
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
                                  {new Date(
                                    stok.tanggalSelesaiQC,
                                  ).toLocaleDateString("id-ID")}
                                </p>
                              </div>
                              <p className="font-semibold">{stok.jumlah}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* BARCODE */}
                  <div className="mt-4 flex flex-col items-center">
                    <BarcodeGenerator value={item.kodeBox} />
                    <p className="text-[10px] text-gray-400 tracking-widest mt-1">
                      {item.kodeBox}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {meta && meta.totalPages > 1 && (
          <Pagination meta={meta} onPageChange={setPage} />
        )}
      </div>

      {/* ================= MODAL ================= */}
      {selected && (
        <Modal onClose={() => setSelected(null)}>
          <div className="">
            {/* HEADER */}
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-800 tracking-tight">
                {selected.namaBox}
              </h3>
              <p className="text-sm font-mono text-orange-600 font-bold tracking-widest">
                {selected.kodeBox}
              </p>
            </div>

            {/* DETAIL BOX INFO */}
            <ul className="text-sm text-gray-700 space-y-2 mb-6 border-t pt-3">
              <li className="flex justify-between">
                <span className="text-gray-400">Penanggung Jawab</span>
                <span className="font-bold">
                  {selected.namaPenanggungJawab}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Masuk Stok</span>
                <span>
                  {new Date(selected.tanggalMasukStok).toLocaleString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </li>
            </ul>

            {/* LIST ITEM - Style Card Terpilih */}
            <div className="mb-6">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-3 tracking-wider">
                Isi Dalam Box
              </p>
              <div className="space-y-3 max-h-60 overflow-auto pr-1">
                {selected.stokPotongan?.map((stok: any) => (
                  <div
                    key={stok.idQC}
                    className="bg-gray-50 border-2 border-gray-200 rounded-sm p-3 flex justify-between items-start"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-gray-800">
                        {stok.namaBarang} - {stok.ukuran}
                      </p>
                      <div className="text-[10px] text-gray-500 space-y-0.5">
                        <p>
                          Kode:{" "}
                          <span className="font-mono font-bold text-gray-700">
                            {stok.kodeStokPotongan}
                          </span>
                        </p>
                        <p>
                          QC:{" "}
                          {new Date(stok.tanggalSelesaiQC).toLocaleDateString(
                            "id-ID",
                          )}
                        </p>
                      </div>
                    </div>
                    <p className="text-lg font-black text-gray-900">
                      {stok.jumlah}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* BARCODE SECTION */}
            <div className="flex flex-col items-center p-4 bg-white border border-dashed border-gray-200 rounded-sm mb-6">
              <BarcodeGenerator value={selected.kodeBox} />
              <p className="text-[10px] text-gray-400 tracking-[0.3em] mt-2 font-mono">
                {selected.kodeBox}
              </p>
            </div>

            {/* BUTTON */}
            <button
              onClick={() => setSelected(null)}
              className="w-full bg-gray-200 text-gray-800 text-xs py-3 rounded-sm font-bold hover:scale-[1.02] active:scale-95 transition"
            >
              TUTUP
            </button>
          </div>
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
