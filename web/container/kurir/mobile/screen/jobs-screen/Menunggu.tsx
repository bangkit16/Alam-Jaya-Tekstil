"use client";

import {
  KurirMenunggu,
  useGetKurirMenunggu,
} from "@/services/kurir/useGetKurirMenunggu";
import { useGetListKurir } from "@/services/kurir/useGetListKurir";
import { usePutAmbilJob } from "@/services/kurir/usePutAmbilJob";
import { useState } from "react";
import { toast } from "sonner";

export default function Menunggu() {
  // Service Data
  const { data: jobs, isLoading: loadingJobs } = useGetKurirMenunggu();
  const { data: listKurir, isLoading: loadingKurir } = useGetListKurir();

  const mutation = usePutAmbilJob();

  const [selectedJob, setSelectedJob] = useState<KurirMenunggu | null>(null);
  const [selectedKurirId, setSelectedKurirId] = useState("");

  const handleClose = () => {
    setSelectedJob(null);
    setSelectedKurirId("");
  };

  const handleConfirmAmbil = () => {
    if (!selectedJob || !selectedKurirId) return;

    mutation.mutate(
      {
        idProsesStokPotong: selectedJob.idProsesStokPotong,
        idKurir: selectedKurirId,
      },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          handleClose()
        },
      },
    );
  };

  if (loadingJobs)
    return <div className="p-5 text-xs text-gray-500 text-center">Memuat antrean...</div>;

  return (
    <>
      {/* ================= LIST ================= */}
      <div className="flex flex-col gap-3">
        {jobs?.map((job) => (
          <div
            key={job.idProsesStokPotong}
            onClick={() => setSelectedJob(job)}
            className={`border rounded-sm p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
              job.isUrgent ? "border-red-300 bg-red-50/30" : "border-gray-300"
            }`}
          >
            {/* HEADER */}
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {job.namaBarang} - {job.ukuran}
                </p>
                {job.isUrgent && (
                  <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full uppercase font-bold">
                    Urgent
                  </span>
                )}
              </div>
              <p className="text-lg font-bold text-gray-900">
                {job.jumlahLolos}
              </p>
            </div>

            {/* DETAIL */}
            <ul className="text-xs text-gray-700 space-y-1">
              <li>
                • <span className="font-semibold">{job.kodeStokPotongan}</span>{" "}
                (Kode Potong)
              </li>
              <li>
                • Dikirim Dari:{" "}
                <span className="font-semibold">{job.dikirimDari}</span>
              </li>
              <li>
                • Dikirim Ke:{" "}
                <span className="font-semibold">{job.dikirimKe}</span>
              </li>
            </ul>
          </div>
        ))}

        {jobs?.length === 0 && (
          <div className="text-center py-10 text-gray-500 text-sm italic">
            Tidak ada antrean pengiriman.
          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {selectedJob && (
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
              <p className="text-sm font-medium text-gray-800">
                {selectedJob.namaBarang}
              </p>

              <p className="text-lg font-bold text-gray-900">
                {selectedJob.jumlahLolos}
              </p>
            </div>

            {/* DETAIL */}
            <ul className="text-xs text-gray-700 space-y-1 mb-4">
              <li>Kode Stok Potongan: {selectedJob.kodeStokPotongan}</li>
              <li>Dikirim Dari: {selectedJob.dikirimDari}</li>
              <li>Dikirim Ke: {selectedJob.dikirimKe}</li>
            </ul>

            {/* SELECT DROPDOWN (GANTI INPUT) */}
            <select
              value={selectedKurirId}
              onChange={(e) => setSelectedKurirId(e.target.value)}
              className="w-full bg-gray-100 px-3 py-2 text-xs outline-none mb-4 appearance-none cursor-pointer border border-transparent focus:border-gray-300"
              disabled={loadingKurir}
            >
              <option value="">
                {loadingKurir ? "Memuat Kurir..." : "Pilih Nama Kurir"}
              </option>
              {listKurir?.map((kurir) => (
                <option key={kurir.id} value={kurir.id}>
                  {kurir.nama}
                </option>
              ))}
            </select>

            {/* BUTTON */}
            <div className="flex gap-2">
              <button
                disabled={!selectedKurirId || mutation.isPending}
                onClick={handleConfirmAmbil}
                className="flex-1 bg-orange-500 text-white text-xs py-2 rounded-sm active:scale-95 disabled:bg-orange-300 transition-all"
              >
                {mutation.isPending ? "MEMPROSES..." : "AMBIL JOB"}
              </button>

              <button
                onClick={handleClose}
                className="flex-1 bg-gray-300 text-gray-800 text-xs py-2 rounded-sm active:scale-95"
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
