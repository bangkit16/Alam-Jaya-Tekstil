"use client";

import { useState } from "react";
import { Package } from "lucide-react";
import { useGetPenjahitProses } from "@/services/jahit/useGetPenjahitProses";
import { usePutJeda } from "@/services/jahit/usePutJeda";
import { usePutDikerjakan } from "@/services/jahit/usePutDikerjakan";

export default function Proses() {
  const { data = [] } = useGetPenjahitProses();
  const mutationJeda = usePutJeda();
  const mutationDikerjakan = usePutDikerjakan();

  const [selected, setSelected] = useState<any>(null);

  return (
    <>
      {/* LIST */}
      <div className="bg-white rounded-2xl p-6 shadow">
        {data.length === 0 ? (
          <Empty icon={<Package />} text="Belum ada data proses" />
        ) : (
          <div className="space-y-3">
            {data.map((item: any) => (
              <div
                key={item.idProsesStokPotong}
                onClick={() => setSelected(item)}
                className="border border-gray-200 rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition"
              >
                {/* HEADER */}
                <div className="flex justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-800">
                    {item.namaBarang} - {item.ukuran}
                  </p>

                  <p className="text-lg font-bold">{item.jumlah}</p>
                </div>

                {/* DETAIL */}
                <div className="text-xs text-gray-600 space-y-1">
                  <p>Kode Stok Potongan: {item.kodeStokPotongan}</p>
                  <p>
                    Tanggal Mulai Jahit:{" "}
                    {new Date(item.tanggalMulaiJahit).toLocaleDateString(
                      "id-ID",
                    )}
                  </p>

                  <p>
                    Status:{" "}
                    <span
                      className={`font-bold ${
                        item.status === "JEDA"
                          ? "text-orange-500"
                          : "text-blue-500"
                      }`}
                    >
                      {item.status}
                    </span>
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
          <div className="flex justify-between items-center mb-3">
            <p className="font-semibold text-gray-800">
              {selected.namaBarang} - {selected.ukuran}
            </p>

            <p className="text-xl font-bold">{selected.jumlah}</p>
          </div>

          <div className="h-px bg-gray-200 mb-3" />

          {/* DETAIL */}
          <div className="text-sm text-gray-600 space-y-2 mb-4">
            <p>Kode: {selected.kodeStokPotongan}</p>

            <p>
              Tanggal Mulai:{" "}
              {new Date(selected.tanggalMulaiJahit).toLocaleString("id-ID")}
            </p>

            <p>
              Status:{" "}
              <span className="font-bold text-orange-500">
                {selected.status}
              </span>
            </p>
          </div>

          {/* BUTTON */}
          <div className="space-y-2">
            {selected.status === "DIKERJAKAN" ? (
              <button
                onClick={() => {
                  mutationJeda.mutate(selected.idProsesStokPotong);
                  setSelected(null);
                }}
                className="w-full bg-yellow-500 text-white py-2 rounded-xl font-semibold"
              >
                JEDA
              </button>
            ) : (
              <button
                onClick={() => {
                  mutationDikerjakan.mutate(selected.idProsesStokPotong);
                  setSelected(null);
                }}
                className="w-full bg-orange-500 text-white py-2 rounded-xl font-semibold"
              >
                LANJUT KERJAKAN
              </button>
            )}

            <button
              onClick={() => setSelected(null)}
              className="w-full bg-gray-200 text-gray-600 py-2 rounded-xl font-semibold"
            >
              KEMBALI
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

function Empty({ icon, text }: any) {
  return (
    <div className="flex flex-col items-center py-16 text-gray-400">
      <div className="bg-gray-100 p-4 rounded-full mb-3">{icon}</div>
      <p className="font-medium text-gray-500">{text}</p>
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
        className="bg-white p-5 rounded-2xl shadow-xl w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
