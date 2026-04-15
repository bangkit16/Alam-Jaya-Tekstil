"use client";

import { useState } from "react";
import {
  useGetPenjahitMenunggu,
  PenjahitMenunggu,
} from "@/services/jahit/useGetPenjahitMenunggu"; // Sesuaikan path hook
import { usePutMulaiJahit } from "@/services/jahit/usePutMulaiJahit";

export default function Menunggu() {
  const [selected, setSelected] = useState<PenjahitMenunggu | null>(null);

  // 🔥 Integrasi Hook TanStack Query
  const {
    data: apiData = [],
    isLoading,
    isError,
    refetch,
  } = useGetPenjahitMenunggu();

  const mutation = usePutMulaiJahit();

  const handleClose = () => {
    setSelected(null);
  };

  const handleProses = async (job: PenjahitMenunggu) => {
    try {
      // Eksekusi API PUT ke server
      await mutation.mutateAsync(job.idProsesStokPotong);

      // Jika sukses, tutup modal (Invalidasi data diurus otomatis oleh hook)
      handleClose();
    } catch (error) {
      // Error sudah dihandle oleh alert di dalam hook
      console.error("Mutation failed");
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center text-xs text-gray-500 italic">
        Memuat daftar jahitan...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-center border border-red-200 bg-red-50 rounded-sm">
        <p className="text-xs text-red-600 mb-2">Gagal memuat data</p>
        <button
          onClick={() => refetch()}
          className="text-[10px] bg-white border px-2 py-1 uppercase font-bold"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <>
      {/* ================= LIST ================= */}
      <div className="flex flex-col gap-3">
        {apiData.length === 0 ? (
          <div className="p-8 text-center border border-dashed text-gray-400 text-xs">
            Belum ada jahitan yang menunggu.
          </div>
        ) : (
          apiData.map((job) => (
            <div
              key={job.idProsesStokPotong}
              onClick={() => setSelected(job)}
              className={`border rounded-sm p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                job.isUrgent ? "border-red-300 bg-red-50/30" : "border-gray-300"
              }`}
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {job.namaBarang} - {job.ukuran}
                  </p>
                  {job.isUrgent && (
                    <span className="text-[9px] font-bold text-red-600 text-xl uppercase">
                      Urgent
                    </span>
                  )}
                </div>

                <p className="text-lg font-bold text-gray-900">{job.jumlah}</p>
              </div>

              {/* DETAIL */}
              <ul className="text-xs text-gray-700 space-y-1">
                <li>
                  • Kode:{" "}
                  <span className="font-mono">{job.kodeStokPotongan}</span>
                </li>
                <li>
                  • Dikirim:{" "}
                  {new Date(job.tanggalKirim).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </li>
              </ul>
            </div>
          ))
        )}
      </div>

      {/* ================= MODAL ================= */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          onClick={handleClose}
        >
          <div
            className="bg-white p-4 w-full max-w-sm shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-3">
              <div>
                {selected.isUrgent && (
                  <span className="text-base font-bold text-red-600 uppercase">
                    Urgent
                  </span>
                )}
                <p className="text-sm font-medium text-gray-800">
                  {selected.namaBarang} - {selected.ukuran}
                </p>
              </div>

              <p className="text-xl font-bold text-gray-900">
                {selected.jumlah}
              </p>
            </div>

            {/* DETAIL */}
            <ul className="text-xs text-gray-700 space-y-2 mb-6 border-t pt-3">
              <li className="flex justify-between">
                <span className="text-gray-400">Kode Stok</span>
                <span className="font-bold">{selected.kodeStokPotongan}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Tanggal Kirim</span>
                <span>
                  {new Date(selected.tanggalKirim).toLocaleString("id-ID")}
                </span>
              </li>
            </ul>

            {/* BUTTON */}
            <div className="flex gap-2">
              <button
                onClick={() => handleProses(selected)}
                disabled={mutation.isPending} // Disable saat loading
                className="flex-1 bg-gray-800 text-white text-xs py-2.5 rounded-sm font-bold disabled:bg-gray-400"
              >
                {mutation.isPending ? "MEMPROSES..." : "PROSES"}
              </button>

              <button
                onClick={handleClose}
                className="flex-1 bg-gray-200 text-gray-800 text-xs py-2.5 rounded-sm font-bold active:bg-gray-300"
              >
                TIDAK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
