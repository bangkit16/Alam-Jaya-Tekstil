"use client";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  KurirMenunggu,
  useGetKurirMenunggu,
} from "@/services/kurir/useGetKurirMenunggu";
import { useGetListKurir } from "@/services/kurir/useGetListKurir";
import { usePutAmbilJob } from "@/services/kurir/usePutAmbilJob";
import { Package } from "lucide-react";
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


  return (
    <>
      {/* ================= LIST ================= */}
      <div className="flex flex-col gap-3">
        {loadingJobs ? (
          <LoadingSpinner />
        ) : jobs && jobs.length > 0 ? (
          jobs.map((job) => (
            <div
              key={job.idProsesStokPotong}
              onClick={() => setSelectedJob(job)}
              className="border rounded-sm p-3 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              {/* HEADER */}
              {job.isUrgent && (
                <span className="text-sm text-red-500 uppercase font-bold">
                  Urgent
                </span>
              )}
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {job.namaBarang} - {job.ukuran}
                  </p>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {job.jumlahLolos}
                </p>
              </div>

              {/* DETAIL */}
              <ul className="text-xs text-gray-700 space-y-1">
                <li>
                  • Kode Potong:{" "}
                  <span className="font-semibold">{job.kodeStokPotongan}</span>
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
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <div className="bg-orange-100 text-orange-500 p-4 rounded-full mb-4">
              <Package size={30} />
            </div>

            <p className="font-semibold text-gray-500 mb-1">Belum ada order</p>
            <p className="text-xs text-gray-400">Order akan muncul di sini</p>
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
