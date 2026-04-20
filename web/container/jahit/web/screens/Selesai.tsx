"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { useGetPenjahitSelesai } from "@/services/jahit/useGetPenjahitSelesai";

export default function Selesai() {
  const { data = [] } = useGetPenjahitSelesai();
  const [selected, setSelected] = useState<any>(null);

  return (
    <>
      {/* LIST */}
      <div className="bg-white rounded-2xl p-6 shadow">
        {data.length === 0 ? (
          <Empty icon={<CheckCircle />} text="Belum ada data selesai" />
        ) : (
          <div className="space-y-3">
            {data.map((item: any) => (
              <div
                key={item.idProsesStokPotong}
                onClick={() => setSelected(item)}
                className="border border-gray-200 rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition"
              >
                {/* URGENT */}
                {item.isUrgent && (
                  <p className="text-xs font-bold text-red-500 mb-1">URGENT</p>
                )}

                {/* HEADER */}
                <div className="flex justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-800">
                    {item.namaBarang} - {item.ukuran}
                  </p>

                  <p className="text-lg font-bold">
                    {item.jumlahSelesai || item.jumlah}
                  </p>
                </div>

                {/* DETAIL */}
                <div className="text-xs text-gray-600 space-y-1">
                  <p>Kode Potongan : {item.kodeStokPotongan}</p>

                  <p>
                    Selesai pada :{" "}
                    {new Date(item.tanggalSelesai).toLocaleString("id-ID")}
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
          {/* URGENT */}
          {selected.isUrgent && (
            <p className="text-red-500 font-bold text-sm mb-2">URGENT</p>
          )}

          {/* HEADER */}
          <div className="flex justify-between items-center mb-3">
            <p className="font-semibold text-gray-800">
              {selected.namaBarang} - {selected.ukuran}
            </p>

            <p className="text-xl font-bold">
              {selected.jumlahSelesai || selected.jumlah}
            </p>
          </div>

          <div className="h-px bg-gray-200 mb-4" />

          {/* DETAIL */}
          <div className="text-sm text-gray-600 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Kode Potongan</span>
              <span className="font-medium">{selected.kodeStokPotongan}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Waktu Selesai</span>
              <span>
                {new Date(selected.tanggalSelesai).toLocaleString("id-ID")}
              </span>
            </div>

            <div>
              <p className="text-gray-400 mb-1">Catatan:</p>
              <div className="bg-gray-100 rounded-lg p-2 text-sm text-gray-600">
                {selected.catatan || "Tidak ada catatan."}
              </div>
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={() => setSelected(null)}
            className="mt-5 w-full bg-gray-800 text-white py-2.5 rounded-xl font-semibold"
          >
            TUTUP
          </button>
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
