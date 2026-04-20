"use client";

import { useState } from "react";
import { Archive } from "lucide-react";

import { useGetQCMasukBox } from "@/services/qc/useGetQCBoxMasuk";
import { useGetPenanggungJawabBox } from "@/services/qc/useGetPenanggungJawabBox";
import { usePostPackingBox } from "@/services/qc/usePostPackingBox";

export default function MasukBox() {
  const { data = [], isLoading } = useGetQCMasukBox();
  const { data: listPJ } = useGetPenanggungJawabBox();
  const { mutate, isPending } = usePostPackingBox();

  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const [namaBox, setNamaBox] = useState("");
  const [pj, setPj] = useState("");

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
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
            {data.map((item: any) => {
              const active = selected.includes(item.idQC);

              return (
                <div
                  key={item.idQC}
                  onClick={() => toggle(item.idQC)}
                  className={`border rounded-xl p-4 cursor-pointer transition
                  ${
                    active
                      ? "border-orange-500 bg-orange-50"
                      : "hover:bg-gray-50"
                  }`}
                >
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

                  {item.isUrgent && (
                    <span className="text-xs text-red-500 font-semibold">
                      URGENT
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* BUTTON PACKING */}
      {selected.length > 0 && (
        <div className="mt-4">
          <button
            onClick={() => setOpen(true)}
            className="w-full py-3 rounded-xl bg-orange-500 text-white font-semibold"
          >
            PACKING ({selected.length})
          </button>
        </div>
      )}

      {/* ================= MODAL ================= */}
      {open && (
        <Modal onClose={() => setOpen(false)}>
          <h3 className="font-bold mb-4">Packing Box</h3>

          {/* PILIH PJ */}
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-1">Penanggung Jawab</p>

            <select
              value={pj}
              onChange={(e) => setPj(e.target.value)}
              className="w-full border rounded-xl p-2"
            >
              <option value="">Pilih</option>

              {listPJ?.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.nama}
                </option>
              ))}
            </select>
          </div>

          {/* NAMA BOX */}
          <input
            placeholder="Nama Box"
            value={namaBox}
            onChange={(e) => setNamaBox(e.target.value)}
            className="w-full border rounded-xl p-2 mb-4"
          />

          {/* PREVIEW ITEM */}
          <div className="border rounded-xl p-3 max-h-40 overflow-auto">
            {data
              .filter((i: any) => selected.includes(i.idQC))
              .map((i: any) => (
                <div key={i.idQC} className="flex justify-between text-sm py-1">
                  <span>{i.namaBarang}</span>
                  <span>{i.jumlahLolos}</span>
                </div>
              ))}
          </div>

          {/* BUTTON */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setOpen(false)}
              className="flex-1 bg-gray-200 py-2 rounded-xl"
            >
              Batal
            </button>

            <button
              disabled={!pj || !namaBox}
              onClick={() => {
                mutate(
                  {
                    idPenanggungJawabBox: pj,
                    namaBox,
                    idQc: selected,
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
              className="flex-1 bg-orange-500 text-white py-2 rounded-xl disabled:opacity-50"
            >
              {isPending ? "Loading..." : "Konfirmasi"}
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
