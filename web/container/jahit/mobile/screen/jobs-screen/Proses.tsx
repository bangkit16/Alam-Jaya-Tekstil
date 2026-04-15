"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useGetPenjahitProses,
  PenjahitProses,
} from "@/services/jahit/useGetPenjahitProses";
import { usePutDikerjakan } from "@/services/jahit/usePutDikerjakan";
import { usePutJeda } from "@/services/jahit/usePutJeda";
import { usePutSelesaiJahit } from "@/services/jahit/usePutSelesaiJahit";

const schema = z.object({
  jumlahSelesaiJahit: z
    .any() // Menghindari konflik awal tipe data
    .refine((val) => val !== "", "Jumlah Selesai wajib diisi")
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), "Harus berupa angka")
    .refine((val) => val > 0, "Minimal jumlah adalah 1"),
  catatan: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function Proses() {
  const [selected, setSelected] = useState<PenjahitProses | null>(null);
  const { data: apiData = [], isLoading } = useGetPenjahitProses();
  const mutasiDikerjakan = usePutDikerjakan();
  const mutasiJeda = usePutJeda();
  const mutasiSelesai = usePutSelesaiJahit();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const handleClose = () => {
    setSelected(null);
    reset();
  };

  const onConfirmSelesai = async (data: FormValues) => {
    if (!selected) return;

    await mutasiSelesai.mutateAsync({
      id: selected.idProsesStokPotong,
      jumlahSelesaiJahit: data.jumlahSelesaiJahit,
      catatan: data.catatan,
    });

    handleClose();
  };

  const handleUpdateStatus = async (newStatus: "DIKERJAKAN" | "JEDA") => {
    if (!selected) return;

    if (newStatus === "JEDA") {
      await mutasiJeda.mutateAsync(selected.idProsesStokPotong);
    } else {
      await mutasiDikerjakan.mutateAsync(selected.idProsesStokPotong);
    }

    handleClose();
  };

  if (isLoading)
    return (
      <div className="p-4 text-center text-xs text-gray-500">Memuat...</div>
    );

  return (
    <>
      <div className="flex flex-col gap-3">
        {apiData && apiData.length > 0 ? (
          apiData.map((job) => (
            <div
              key={job.idProsesStokPotong}
              onClick={() => setSelected(job)}
              className={`border border-gray-300 rounded-sm p-3 cursor-pointer hover:bg-gray-50 ${
                job.isUrgent ? "border-2 border-red-200 bg-red-50" : ""
              }`}
            >
              {job.isUrgent && (
                <span className="text-[10px] text-red-600 font-bold block mb-1">
                  URGENT
                </span>
              )}
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-800">
                  {job.namaBarang} - {job.ukuran}
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {job.jumlahLolos}
                </p>
              </div>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• Kode Stok Potongan: {job.kodeStokPotongan}</li>
                <li>
                  • Tanggal Mulai Jahit:{" "}
                  {new Date(job.tanggalMulaiJahit).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </li>
                <li>
                  • Status:{" "}
                  <span
                    className={
                      job.status === "JEDA"
                        ? "text-orange-600 font-bold"
                        : "text-blue-600 font-bold"
                    }
                  >
                    {job.status}
                  </span>
                </li>
              </ul>
            </div>
          ))
        ) : (
          /* Tampilan saat data kosong */
          <div className="p-8 text-center border border-dashed border-gray-300 text-gray-400 text-xs rounded-sm">
            Belum ada jahitan yang diproses.
          </div>
        )}
      </div>

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
            <div className="mb-3">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-800">
                  {selected.namaBarang} - {selected.ukuran}
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {selected.jumlahLolos}
                </p>
              </div>
              {selected.isUrgent && (
                <p className="text-md text-red-600 font-bold mt-1 uppercase ">
                  Urgent
                </p>
              )}
              <ul className="text-xs text-gray-700 space-y-1 my-4">
                <li>• Kode Stok Potongan: {selected.kodeStokPotongan}</li>
                <li>
                  • Tanggal Mulai Jahit:{" "}
                  {new Date(selected.tanggalMulaiJahit).toLocaleDateString(
                    "id-ID",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    },
                  )}
                </li>
                <li>
                  • Status:{" "}
                  <span
                    className={
                      selected.status === "JEDA"
                        ? "text-orange-600 font-bold"
                        : "text-blue-600 font-bold"
                    }
                  >
                    {selected.status}
                  </span>
                </li>
              </ul>
            </div>

            {/* INPUT FORM (Hanya aktif jika status DIKERJAKAN) */}
            {selected.status === "DIKERJAKAN" && (
              <div className={`space-y-2 mb-4 `}>
                <input
                  {...register("jumlahSelesaiJahit")}
                  type="number"
                  placeholder={`Jumlah selesai (Max: ${selected.jumlahLolos})`}
                  className={`w-full bg-gray-100 px-3 py-2 text-xs outline-none ${errors.jumlahSelesaiJahit ? "border border-red-500" : ""}`}
                />
                {errors.jumlahSelesaiJahit && (
                  <p className="text-xs text-red-500">
                    {errors.jumlahSelesaiJahit.message}
                  </p>
                )}
                <input
                  {...register("catatan")}
                  placeholder="Catatan (optional)"
                  className="w-full bg-gray-100 px-3 py-2 text-xs outline-none"
                />
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="flex flex-col gap-2">
              {selected.status === "DIKERJAKAN" ? (
                <>
                  <button
                    onClick={handleSubmit(onConfirmSelesai)}
                    disabled={mutasiSelesai.isPending}
                    className="w-full bg-gray-800 text-white text-xs py-2.5 rounded-sm font-bold disabled:bg-gray-400"
                  >
                    {mutasiSelesai.isPending
                      ? "MENGIRIM..."
                      : "KONFIRMASI SELESAI"}
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateStatus("JEDA")}
                      disabled={mutasiJeda.isPending}
                      className="flex-1 bg-orange-500 text-white text-xs py-2 rounded-sm disabled:bg-gray-400"
                    >
                      {mutasiJeda.isPending ? "..." : "JEDA"}
                    </button>
                    <button
                      onClick={handleClose}
                      className="flex-1 bg-gray-300 text-gray-800 text-xs py-2 rounded-sm"
                    >
                      BATAL
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleUpdateStatus("DIKERJAKAN")}
                    disabled={mutasiDikerjakan.isPending}
                    className="w-full bg-blue-600 text-white text-xs py-2.5 rounded-sm font-bold disabled:bg-gray-400"
                  >
                    {mutasiDikerjakan.isPending
                      ? "MEMPROSES..."
                      : "LANJUT KERJAKAN"}
                  </button>
                  <button
                    onClick={handleClose}
                    className="w-full bg-gray-300 text-gray-800 text-xs py-2 rounded-sm"
                  >
                    KEMBALI
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
