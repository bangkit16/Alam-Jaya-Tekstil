"use client";

import { useState } from "react";
import { ClipboardList } from "lucide-react";

import { useGetQCProses } from "@/services/qc/useGetQCProses";
import { usePutQCProses } from "@/services/qc/usePutQCProses";

export default function Proses() {
  const { data = [], isLoading } = useGetQCProses();
  const { mutate, isPending } = usePutQCProses();

  const [selected, setSelected] = useState<any>(null);

  const [form, setForm] = useState({
    idPengecek: [] as string[], // ✅ WAJIB
    jumlahLolos: 0,
    jumlahPermak: 0,
    jumlahReject: 0,
    jumlahTurunSize: 0,
    jumlahKotor: 0,
  });

  if (isLoading) return <p className="text-center py-4">Loading...</p>;

  return (
    <>
      {/* CARD */}
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
                {/* HEADER */}
                <div className="flex justify-between mb-2">
                  <div>
                    <p className="font-semibold">
                      {item.namaBarang} - {item.ukuran}
                    </p>

                    <p className="text-xs text-gray-500">
                      {item.namaPenjahit} • {item.kodeStokPotongan}
                    </p>
                  </div>

                  <p className="font-bold text-lg text-orange-500">
                    {item.jumlahSelesaiJahit}
                  </p>
                </div>

                {/* EXTRA */}
                <div className="text-xs text-gray-500">
                  <p>
                    Mulai QC:{" "}
                    {new Date(item.tanggalMulaiQC).toLocaleDateString("id-ID")}
                  </p>

                  {item.isUrgent && (
                    <span className="text-red-500 font-semibold">URGENT</span>
                  )}
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
          {selected.isUrgent && (
            <p className="text-red-500 font-bold mb-1">URGENT</p>
          )}

          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="font-semibold">
                {selected.namaBarang} - {selected.ukuran}
              </p>

              <p className="text-xs text-gray-500">
                {selected.kodeStokPotongan}
              </p>
            </div>

            <p className="text-xl font-bold text-orange-500">
              {selected.jumlahSelesaiJahit}
            </p>
          </div>

          <div className="h-px bg-gray-200 mb-4" />

          {/* INFO */}
          <div className="text-sm text-gray-600 mb-4 space-y-1">
            <p>Penjahit: {selected.namaPenjahit}</p>
            <p>
              Selesai Jahit:{" "}
              {new Date(selected.tanggalSelesaiJahit).toLocaleString("id-ID")}
            </p>
          </div>

          {/* FORM QC */}
          <div className="grid grid-cols-2 gap-3">
            {[
              ["jumlahLolos", "Lolos"],
              ["jumlahPermak", "Permak"],
              ["jumlahReject", "Reject"],
              ["jumlahTurunSize", "Turun Size"],
              ["jumlahKotor", "Kotor"],
            ].map(([key, label]) => (
              <div key={key}>
                <p className="text-xs mb-1 text-gray-500">{label}</p>
                <input
                  type="number"
                  value={(form as any)[key]}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      [key]: Number(e.target.value),
                    }))
                  }
                  className="w-full bg-gray-100 px-3 py-2 rounded-xl text-sm"
                />
              </div>
            ))}
          </div>

          {/* BUTTON */}
          <div className="flex gap-2 mt-5">
            <button
              onClick={() => setSelected(null)}
              className="flex-1 bg-gray-200 py-2 rounded-xl"
            >
              Batal
            </button>

            <button
              onClick={() => {
                mutate({
                  idQC: selected.idQC,
                  body: form,
                });

                setSelected(null);
              }}
              disabled={isPending}
              className="flex-1 bg-orange-500 text-white py-2 rounded-xl"
            >
              {isPending ? "Menyimpan..." : "Simpan"}
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
      <div className="bg-blue-100 text-blue-500 p-4 rounded-full mb-3">
        <ClipboardList />
      </div>
      <p className="font-medium">Belum ada data proses</p>
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
        className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
