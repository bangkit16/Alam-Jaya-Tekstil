"use client";

import { useState } from "react";
import { ChevronDown, PackageSearch } from "lucide-react";
import { useGetBoxMasuk } from "@/services/stok-gudang/useGetBoxMasuk";
import { useGetPenanggungJawabBox } from "@/services/stok-gudang/useGetPenanggungJawabBox";
import BarcodeGenerator from "@/components/BarcodeGenerator";
import Pagination from "@/components/Pagination";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function BoxMasuk() {
  const [page, setPage] = useState(1);

  const { data: dataBoxMasuk, isLoading } = useGetBoxMasuk(page);
  const { data: listPJ = [] } = useGetPenanggungJawabBox();

  const [open, setOpen] = useState<string | null>(null);
  const [selectedBox, setSelectedBox] = useState<any>(null);

  const data = dataBoxMasuk?.data || [];
  const meta = dataBoxMasuk?.meta;

  // 🔥 state untuk select
  const [selectedPJ, setSelectedPJ] = useState("");

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <div className="grid md:grid-cols-2 gap-4 justify-center">
        {data.map((box: any) => {
          const isOpen = open === box.idBox;

          return (
            <div
              key={box.idBox}
              onClick={() => setSelectedBox(box)}
              className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm cursor-pointer"
            >
              {/* HEADER */}
              <p className="font-semibold text-gray-800 mb-2">{box.namaBox}</p>

              {/* BUTTON */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(isOpen ? null : box.idBox);
                }}
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

              {/* DROPDOWN */}
              {isOpen && (
                <div
                  className="mt-3 space-y-3"
                  onClick={(e) => e.stopPropagation()}
                >
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
              <div
                className="mt-4 flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <BarcodeGenerator value={box.kodeBox} />

                <p className="text-[10px] text-gray-400 tracking-widest mt-1">
                  {box.kodeBox}
                </p>
              </div>
            </div>
          );
        })}
      </div>
        {meta && meta.totalPages > 1 && (
          <Pagination meta={meta} onPageChange={setPage} />
        )}

      {/* ================= MODAL ================= */}
      {selectedBox && (
        <Modal
          onClose={() => {
            setSelectedBox(null);
            setSelectedPJ("");
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
                <span className="text-gray-400">Penanggung Jawab</span>
                <span className="font-bold">
                  {selectedBox.namaPenanggungJawab}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Tanggal Masuk</span>
                <span className="font-bold">
                  {new Date(selectedBox.tanggalMasukStok).toLocaleString(
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

            {/* INPUT PENERIMA */}
            <div className="mb-6">
              <label className="block mb-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Input Penerima
              </label>
              <select
                value={selectedPJ}
                onChange={(e) => setSelectedPJ(e.target.value)}
                className="w-full bg-gray-100 rounded-sm px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-orange-500 transition"
              >
                <option value="">Pilih Nama Penerima</option>
                {listPJ.map((pj: any) => (
                  <option key={pj.id} value={pj.id}>
                    {pj.nama}
                  </option>
                ))}
              </select>
            </div>

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
                disabled={!selectedPJ}
                onClick={() => {
                  setSelectedBox(null);
                  setSelectedPJ("");
                }}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-sm font-bold text-xs hover:scale-[1.02] active:scale-95 transition disabled:opacity-50 disabled:scale-100"
              >
                ACC BOX
              </button>
              <button
                onClick={() => {
                  setSelectedBox(null);
                  setSelectedPJ("");
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

/* ================= MODAL ================= */
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
