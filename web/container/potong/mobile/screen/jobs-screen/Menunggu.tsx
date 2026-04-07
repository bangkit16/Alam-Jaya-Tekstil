"use client";

import { useGetPermintaan } from "@/services/potong/useGetPermintaan";
import { usePutPermintaan } from "@/services/potong/usePutPermintaan";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

// Skema Validasi
const permintaanSchema = z.object({
  kode_kain: z.string().min(1, "Kode kain wajib diisi"),
  pemotong: z.string().min(1, "Nama pemotong wajib diisi"),
  pengecek: z.string().min(1, "Nama pengecek wajib diisi"),
});

type PermintaanFormData = z.infer<typeof permintaanSchema>;

type permintaanType = {
  id_permintaan: string;
  nama_produk: string;
  jumlah: number;
  ukuran: "M" | "L" | "XL" | "XXL";
  user_id: string;
  is_urgent: boolean;
};

export default function Menunggu() {
  const [selectedPermintaan, setSelectedPermintaan] =
    useState<permintaanType | null>(null);

  const { data: dataPermintaan, isLoading: isLoadingPermintaan } =
    useGetPermintaan();
  const { mutate: mutatePermintaan } = usePutPermintaan();

  // Inisialisasi React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PermintaanFormData>({
    resolver: zodResolver(permintaanSchema),
    defaultValues: {
      kode_kain: "",
      pemotong: "",
      pengecek: "",
    },
  });

  const onSubmit = (data: PermintaanFormData) => {
    if (!selectedPermintaan) return;

    const submitData = {
      id: selectedPermintaan.id_permintaan,
      data: data,
    };

    mutatePermintaan(submitData, {
      onSuccess: () => {
        handleCloseModal();
        toast.success("Permintaan berhasil di proses");
      },
    });
  };

  const handleCloseModal = () => {
    setSelectedPermintaan(null);
    reset(); // Reset form ke default
  };

  return (
    <>
      {/* ================= LIST ================= */}
      <div className="flex flex-col gap-3 overflow-y-auto">
        {isLoadingPermintaan ? (
          <p className="text-center py-4">Loading...</p>
        ) : dataPermintaan && dataPermintaan.length > 0 ? (
          dataPermintaan.map((permintaan: permintaanType, index: number) => (
            <div
              key={`${permintaan.id_permintaan}-${index}`}
              onClick={() => setSelectedPermintaan(permintaan)}
              className="border border-gray-300 rounded-2xl p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col">
                {permintaan.is_urgent && (
                  <p className="text-red-500 text-xs uppercase font-bold">
                    Urgent
                  </p>
                )}
                <p className="text-sm font-semibold text-gray-800">
                  {permintaan.nama_produk} - {permintaan.ukuran}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-800">
                  {permintaan.jumlah}
                </p>
              </div>
            </div>
          ))
        ) : (
          /* Tampilan saat data kosong */
          <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-500 font-medium">Data Kosong</p>
          </div>
        )}
      </div>

      {/* ================= MODAL JOB ================= */}
      {selectedPermintaan && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <form
            className="bg-white p-4 rounded-xl w-[85%]"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit(onSubmit)}
          >
            {selectedPermintaan.is_urgent && (
              <p className="text-red-500 text-md uppercase font-bold mb-1">
                Urgent
              </p>
            )}

            <div className="flex justify-between mb-2">
              <p className="text-md text-gray-800 font-semibold">
                {selectedPermintaan.nama_produk}
              </p>
              <p className="font-bold text-gray-800">
                {selectedPermintaan.jumlah}
              </p>
            </div>

            <hr className="mb-3 border-gray-300" />

            {/* Input Kode Kain */}
            <div className="mb-2">
              <input
                {...register("kode_kain")}
                placeholder="kode kain"
                className={`w-full border ${errors.kode_kain ? "border-red-500" : "border-gray-300"} text-gray-900 px-2 py-1 rounded`}
              />
              {errors.kode_kain && (
                <p className="text-[10px] text-red-500 mt-1">
                  {errors.kode_kain.message}
                </p>
              )}
            </div>

            {/* Input Pemotong */}
            <div className="mb-2">
              <input
                {...register("pemotong")}
                placeholder="pemotong"
                className={`w-full border ${errors.pemotong ? "border-red-500" : "border-gray-300"} text-gray-900 px-2 py-1 rounded`}
              />
              {errors.pemotong && (
                <p className="text-[10px] text-red-500 mt-1">
                  {errors.pemotong.message}
                </p>
              )}
            </div>

            {/* Input Pengecek */}
            <div className="mb-3">
              <input
                {...register("pengecek")}
                placeholder="pengecek"
                className={`w-full border ${errors.pengecek ? "border-red-500" : "border-gray-300"} text-gray-900 px-2 py-1 rounded`}
              />
              {errors.pengecek && (
                <p className="text-[10px] text-red-500 mt-1">
                  {errors.pengecek.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="bg-purple-500 text-white text-xs px-3 py-1 rounded float-right hover:bg-purple-600 active:scale-95 transition-all"
            >
              cek
            </button>
          </form>
        </div>
      )}
    </>
  );
}
