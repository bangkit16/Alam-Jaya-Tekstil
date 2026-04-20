"use client";

import { useState } from "react";
import { Package } from "lucide-react";
import { useGetQCMenunggu } from "@/services/qc/useGetQCMenunggu";
import { usePutMulaiQC } from "@/services/qc/usePutMulaiQC";

export default function Menunggu() {
  const { data = [], isLoading } = useGetQCMenunggu();
  const { mutate, isPending } = usePutMulaiQC();

  const [selected, setSelected] = useState<any>(null);

  if (isLoading) return <p className="text-center">Loading...</p>;

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow">
        {data.length === 0 ? (
          <Empty />
        ) : (
          <div className="space-y-3">
            {data.map((item: any) => (
              <div
                key={item.idQC}
                onClick={() => setSelected(item)}
                className="border rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition"
              >
                {/* 🔥 URGENT */}
                {item.isUrgent && (
                  <p className="text-red-500 text-xs font-bold mb-1">URGENT</p>
                )}

                {/* HEADER */}
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-gray-800">
                    {item.namaBarang} - {item.ukuran}
                  </p>

                  <p className="text-lg font-bold">{item.jumlahSelesaiJahit}</p>
                </div>

                {/* DETAIL */}
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Kode Potongan: {item.kodeStokPotongan}</p>
                  <p>Nama Penjahit: {item.namaPenjahit}</p>
                  <p>
                    Tanggal Selesai Jahit:{" "}
                    {new Date(item.tanggalSelesaiJahit).toLocaleDateString(
                      "id-ID",
                    )}
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
          {/* 🔥 URGENT */}
          {selected.isUrgent && (
            <p className="text-red-500 font-bold mb-1">URGENT</p>
          )}

          {/* HEADER */}
          <div className="flex justify-between items-center mb-3">
            <p className="font-semibold text-gray-800">
              {selected.namaBarang} - {selected.ukuran}
            </p>

            <p className="text-lg font-bold">{selected.jumlahSelesaiJahit}</p>
          </div>

          {/* DETAIL */}
          <ul className="text-sm text-gray-600 space-y-2 mb-5">
            <li>• Kode Potongan: {selected.kodeStokPotongan}</li>
            <li>• Penjahit: {selected.namaPenjahit}</li>
            <li>
              • Tanggal:{" "}
              {new Date(selected.tanggalSelesaiJahit).toLocaleDateString(
                "id-ID",
              )}
            </li>
          </ul>

          {/* BUTTON */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelected(null)}
              className="flex-1 bg-gray-200 py-2 rounded-xl text-sm"
            >
              Tutup
            </button>

            <button
              onClick={() => {
                mutate(selected.idQC, {
                  onSuccess: () => {
                    setSelected(null);
                  },
                });
              }}
              disabled={isPending}
              className="flex-1 bg-orange-500 text-white py-2 rounded-xl text-sm"
            >
              {isPending ? "Loading..." : "Proses"}
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
      <div className="bg-yellow-100 text-yellow-500 p-4 rounded-full mb-3">
        <Package />
      </div>
      <p className="font-medium">Belum ada data menunggu</p>
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
        className="bg-white p-5 rounded-2xl w-full max-w-sm shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
