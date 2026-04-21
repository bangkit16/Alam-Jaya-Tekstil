"use client";

import { useState } from "react";
import { ClipboardList } from "lucide-react";
import {
  PenjahitMenunggu,
  useGetPenjahitMenunggu,
} from "@/services/jahit/useGetPenjahitMenunggu";
import { usePutMulaiJahit } from "@/services/jahit/usePutMulaiJahit";
import { toast } from "sonner";
import Pagination from "@/components/Pagination";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function Menunggu() {
  const [page, setPage] = useState(1);
  const { data: dataMenunggu , isLoading } = useGetPenjahitMenunggu(page);

  const data = dataMenunggu?.data || [];
  const meta = dataMenunggu?.meta;

  const mutation = usePutMulaiJahit();

  const [selected, setSelected] = useState<PenjahitMenunggu | null>(null);

  const handleClose = () => {
    setSelected(null);
  };

  const handleProses = async (selected: PenjahitMenunggu) => {
    try {
      // Eksekusi API PUT ke server
      mutation.mutate(selected.idProsesStokPotong, {
        onSuccess: (data) => {
          toast.success(data.message);
          handleClose();
        },
      });

      // Jika sukses, tutup modal (Invalidasi data diurus otomatis oleh hook)
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-6 space-y-3 shadow">
        {isLoading ? (
          <LoadingSpinner />
        ) : data.length === 0 ? (
          <Empty icon={<ClipboardList />} text="Belum ada data menunggu" />
        ) : (
          data.map((job: any) => (
            <div
              key={job.idProsesStokPotong}
              onClick={() => setSelected(job)}
              className="border rounded-sm p-3 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-2">
                <div>
                  {job.isUrgent && (
                    <span className="text-sm font-bold text-red-600 uppercase">
                      Urgent
                    </span>
                  )}
                  <p className="text-md font-semibold text-gray-700">
                    {job.namaBarang} - {job.ukuran}
                  </p>
                </div>
                <p className="text-lg font-bold text-gray-900">{job.jumlah}</p>
              </div>

              {/* DETAIL */}
              <ul className="text-sm text-gray-500 space-y-1">
                <li>
                  Kode:{" "}
                  <span className="font-mono font-bold ">
                    {job.kodeStokPotongan}
                  </span>
                </li>
                <li>
                  Dikirim:{" "}
                  <span className="font-bold">
                    {new Date(job.tanggalKirim).toLocaleString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </span>
                </li>
              </ul>
            </div>
          ))
        )}
        {!isLoading && meta && meta.totalPages > 1 && (
          <Pagination meta={meta} onPageChange={setPage} />
        )}
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          onClick={handleClose}
        >
          <div
            className="bg-white p-6 w-full max-w-lg shadow-xl rounded-sm"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            {selected.isUrgent && (
              <span className="text-md font-bold text-red-600 uppercase">
                Urgent
              </span>
            )}
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-lg font-bold text-gray-800">
                  {selected.namaBarang} - {selected.ukuran}
                </p>
              </div>

              <p className="text-xl font-bold text-gray-900">
                {selected.jumlah}
              </p>
            </div>

            {/* DETAIL */}
            <ul className="text-sm text-gray-700 space-y-2 mb-6 border-t pt-3">
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
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 py-1.5 text-xs rounded-sm font-semibold hover:scale-105 active:scale-95 transition disabled:bg-orange-300"
              >
                {mutation.isPending ? "MEMPROSES..." : "PROSES"}
              </button>

              <button
                onClick={handleClose}
                className="flex-1 bg-gray-200 text-gray-800 text-xs py-2.5 rounded-sm font-bold active:bg-gray-300 hover:scale-105 active:scale-95 transition"
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

function Empty({ icon, text }: any) {
  return (
    <div className="flex flex-col items-center py-16 text-gray-400">
      <div className="bg-gray-100 p-4 rounded-full mb-3">{icon}</div>
      <p className="font-medium text-gray-500">{text}</p>
    </div>
  );
}
