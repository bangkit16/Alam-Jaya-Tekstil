"use client";

import { useGetProses } from "@/services/potong/useGetProses";
import { usePutProses } from "@/services/potong/usePutProses";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

// Validasi Skema
const prosesSchema = z.object({
  kode_potongan: z.string().min(1, "Kode potongan wajib diisi"),
  jumlah_lolos: z.coerce.number().min(1, "Jumlah lolos minimal 1"),
  pengecek: z.string().min(1, "Nama pengecek wajib diisi"),
});

type ProsesFormData = z.infer<typeof prosesSchema>;

type prosesType = {
  id_permintaan: string;
  nama_produk: string;
  kode_kain: string;
  jumlah: number;
  ukuran: "M" | "L" | "XL" | "XXL";
  user_id: string;
  is_urgent: boolean;
  pengecek: string;
  pemotong: string;
};

export default function Proses() {
  const [selectedProses, setSelectedProses] = useState<prosesType | null>(null);
  const { data: dataProses, isLoading: isLoadingProses } = useGetProses();
  const { mutate: mutateProses } = usePutProses();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProsesFormData>({
    resolver: zodResolver(prosesSchema),
    defaultValues: {
      kode_potongan: "",
      jumlah_lolos: 0,
      pengecek: "",
    },
  });

  // Sinkronisasi data saat item diklik
  const handleSelectProses = (proses: prosesType) => {
    setSelectedProses(proses);
    setValue("kode_potongan", proses.kode_kain); // Pre-fill kode_potongan dengan kode_kain
    setValue("jumlah_lolos", 0);
    setValue("pengecek", "");
  };

  const handleCloseModal = () => {
    setSelectedProses(null);
    reset();
  };

  const onSubmit = (data: ProsesFormData) => {
    if (!selectedProses) return;

    const submitData = {
      id: selectedProses.id_permintaan,
      data: data,
    };

    mutateProses(submitData, {
      onSuccess: () => {
        handleCloseModal();
        toast.success("Permintaan berhasil di proses");
      },
    });
  };

  return (
    <>
      {/* ================= LIST ================= */}
      <div className="flex flex-col gap-3 overflow-y-auto">
        {isLoadingProses ? (
          <p className="text-center py-10">Loading...</p>
        ) : dataProses && dataProses.length > 0 ? (
          dataProses.map((proses: prosesType, index: number) => (
            <div
              key={`${proses.id_permintaan}-${index}`}
              onClick={() => handleSelectProses(proses)}
              className="border border-gray-300 rounded-2xl p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50"
            >
              <div className="flex-row w-full justify-between align-middle items-center">
                {proses.is_urgent && (
                  <p className="text-red-500 text-sm uppercase font-semibold">
                    Urgent
                  </p>
                )}
                <p className="text-sm font-semibold text-gray-800 my-1">
                  {proses.nama_produk} - {proses.ukuran}
                </p>
                <div className="space-y-0.5">
                  <p className="text-xs font-medium text-gray-400 uppercase">
                    KODE PRODUK :{" "}
                    <span className="font-bold text-gray-600">
                      {proses.kode_kain}
                    </span>
                  </p>
                  <p className="text-xs font-medium text-gray-400 uppercase">
                    PEMOTONG :{" "}
                    <span className="font-bold text-gray-600">
                      {proses.pemotong}
                    </span>
                  </p>
                  <p className="text-xs font-medium text-gray-400 uppercase">
                    PENGECEK :{" "}
                    <span className="font-bold text-gray-600">
                      {proses.pengecek}
                    </span>
                  </p>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-800">
                  {proses.jumlah}
                </p>
              </div>
            </div>
          ))
        ) : (
          /* Tampilan Data Kosong */
          <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-500 font-medium">Data Kosong</p>
          </div>
        )}
      </div>

      {/* ================= MODAL PROSES ================= */}
      {selectedProses && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          onClick={handleCloseModal}
        >
          <form
            className="bg-white p-4 rounded-xl w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit(onSubmit)}
          >
            {selectedProses.is_urgent && (
              <p className="text-red-500 text-md uppercase font-bold mb-1">
                Urgent
              </p>
            )}

            <div className="flex justify-between mb-2">
              <p className="text-md text-gray-800 font-semibold">
                {selectedProses.nama_produk}
              </p>
              <p className="font-bold text-gray-800">{selectedProses.jumlah}</p>
            </div>

            <hr className="mb-3 border-gray-300" />

            {/* Input Kode Potongan */}
            <div className="mb-2">
              <input
                {...register("kode_potongan")}
                placeholder="kode potongan"
                className="w-full border border-gray-300 text-gray-900 px-2 py-1.5 rounded text-sm focus:ring-2 focus:ring-purple-300 outline-none"
              />
              {errors.kode_potongan && (
                <p className="text-[10px] text-red-500 mt-0.5">
                  {errors.kode_potongan.message}
                </p>
              )}
            </div>

            {/* Input Jumlah Lolos */}
            <div className="mb-2">
              <input
                {...register("jumlah_lolos")}
                placeholder="jumlah lolos"
                className="w-full border border-gray-300 text-gray-900 px-2 py-1.5 rounded text-sm focus:ring-2 focus:ring-purple-300 outline-none"
              />
              {errors.jumlah_lolos && (
                <p className="text-[10px] text-red-500 mt-0.5">
                  {errors.jumlah_lolos.message}
                </p>
              )}
            </div>

            {/* Input Pengecek */}
            <div className="mb-4">
              <input
                {...register("pengecek")}
                placeholder="pengecek"
                className="w-full border border-gray-300 text-gray-900 px-2 py-1.5 rounded text-sm focus:ring-2 focus:ring-purple-300 outline-none"
              />
              {errors.pengecek && (
                <p className="text-[10px] text-red-500 mt-0.5">
                  {errors.pengecek.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="bg-purple-500 text-white text-xs px-4 py-2 rounded float-right font-semibold hover:bg-purple-600 transition-colors"
            >
              cek
            </button>
          </form>
        </div>
      )}
    </>
  );
}
