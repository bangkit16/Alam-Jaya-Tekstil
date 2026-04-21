"use client";

import { useState } from "react";
import { Archive } from "lucide-react";

import { useGetQCMasukBox } from "@/services/qc/useGetQCBoxMasuk";
import { useGetPenanggungJawabBox } from "@/services/qc/useGetPenanggungJawabBox";
import { usePostPackingBox } from "@/services/qc/usePostPackingBox";
import Pagination from "@/components/Pagination";

export default function MasukBox() {
  const [page, setPage] = useState(1);
  const { data: dataMasukBox, isLoading } = useGetQCMasukBox(page);

  const data = dataMasukBox?.data || [];
  const meta = dataMasukBox?.meta;

  const { data: listPJ } = useGetPenanggungJawabBox();
  const { mutate, isPending } = usePostPackingBox();

  const [selected, setSelected] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const [namaBox, setNamaBox] = useState("");
  const [pj, setPj] = useState("");

  const toggle = (item: any) => {
    setSelected((prev) => {
      // Cek apakah item sudah ada di dalam list terpilih
      const isExist = prev.some((i) => i.idQC === item.idQC);

      if (isExist) {
        // Jika ada, hapus berdasarkan ID
        return prev.filter((i) => i.idQC !== item.idQC);
      } else {
        // Jika tidak ada, tambahkan objek item utuh
        return [...prev, item];
      }
    });
  };

  if (isLoading) return <p className="text-center py-4">Loading...</p>;

  return (
    <>
      {/* CARD */}
      <div className="bg-white rounded-2xl p-6 shadow">
        {data.length === 0 ? (
          <Empty />
        ) : (
          <div className="space-y-3">
            {/* BUTTON PACKING */}

            <div className="mt-4">
              <button
                disabled={selected.length == 0}
                onClick={() => setOpen(true)}
                className="min-w-full disabled:bg-orange-300 disabled:bg-none  py-2 rounded-xl bg-linear-to-r from-orange-500 to-amber-500 text-white font-semibold"
              >
                PACKING ({selected.length})
              </button>
            </div>

            {data.map((item: any) => {
              const active = selected.some((i) => i.idQC === item.idQC);

              return (
                <div
                  key={item.idQC}
                  onClick={() => toggle(item)}
                  className={`border rounded-xl p-4 cursor-pointer transition
                  ${active ? "border-orange-500 " : "hover:bg-gray-50"}`}
                >
                  {item.isUrgent && (
                    <span className="text-xs text-red-500 font-semibold">
                      URGENT
                    </span>
                  )}
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">
                        {item.namaBarang} - {item.ukuran}
                      </p>

                      <p className="text-xs text-gray-500">
                        {item.kodeStokPotongan}
                      </p>
                    </div>

                    <p className="font-bold text-lg">{item.jumlahLolos}</p>
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
      {open && (
        <Modal onClose={() => setOpen(false)}>
          <div className="">
            {/* HEADER */}
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-800 tracking-tight">
                Packing Box
              </h3>
              <p className="text-xs text-gray-400">
                Pastikan data penanggung jawab dan nama box benar.
              </p>
            </div>

            {/* FORM SECTION - Menggunakan border-t agar seragam dengan style detail */}
            <div className="space-y-4 border-t pt-4">
              {/* PILIH PJ */}
              <div>
                <label className="block mb-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  Penanggung Jawab
                </label>
                <select
                  value={pj}
                  onChange={(e) => setPj(e.target.value)}
                  className="w-full bg-gray-100 rounded-sm px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-orange-500 transition"
                >
                  <option value="">Pilih PJ</option>
                  {listPJ?.map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.nama}
                    </option>
                  ))}
                </select>
              </div>

              {/* NAMA BOX */}
              <div>
                <label className="block mb-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  Nama Box
                </label>
                <input
                  placeholder="Masukkan nama/nomor box"
                  value={namaBox}
                  onChange={(e) => setNamaBox(e.target.value)}
                  className="w-full bg-gray-100 rounded-sm px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-orange-500 transition border-none"
                />
              </div>
            </div>

            {/* PREVIEW ITEM - Style List Justify Between */}
            <div className="mt-6 mb-8">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">
                Item Terpilih ({selected.length})
              </p>
              <div className="border border-gray-100 rounded-sm bg-gray-50 p-3 max-h-40 overflow-auto divide-y divide-gray-200">
                {selected.map((i: any) => (
                  <div
                    key={i.idQC}
                    className="flex justify-between text-xs py-2 px-1"
                  >
                    <span className="text-gray-700 font-medium">
                      {i.namaBarang}
                    </span>
                    <span className="font-bold text-gray-900">
                      {i.jumlahLolos} pcs
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 bg-gray-200 text-gray-800 text-xs py-3 rounded-sm font-bold hover:scale-[1.02] active:scale-95 transition"
              >
                BATAL
              </button>

              <button
                disabled={!pj || !namaBox || isPending}
                onClick={() => {
                  mutate(
                    {
                      idPenanggungJawabBox: pj,
                      namaBox,
                      idQc: selected.map((i) => i.idQC),
                    },
                    {
                      onSuccess: () => {
                        setOpen(false);
                        setSelected([]);
                        setNamaBox("");
                        setPj("");
                      },
                    },
                  );
                }}
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs py-3 rounded-sm font-bold hover:scale-[1.02] active:scale-95 transition disabled:opacity-50 disabled:scale-100"
              >
                {isPending ? "MEMPROSES..." : "KONFIRMASI"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

function Empty() {
  return (
    <div className="flex flex-col items-center py-16 text-gray-400">
      <div className="bg-purple-100 text-purple-500 p-4 rounded-full mb-3">
        <Archive />
      </div>
      <p className="font-medium">Belum ada data masuk box</p>
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
        className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
