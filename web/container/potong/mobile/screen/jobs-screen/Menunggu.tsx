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
              className="bg-white border border-gray-100 rounded-xl px-3 py-2 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition"
            >
              {/* LEFT */}
              <div className="flex flex-col leading-tight">
                {permintaan.is_urgent && (
                  <span className="text-[10px] text-red-500 font-semibold">
                    URGENT
                  </span>
                )}

                <p className="text-xs font-medium text-gray-800">
                  {permintaan.nama_produk} - {permintaan.ukuran}
                </p>
              </div>

              {/* RIGHT */}
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">
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
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white p-4 rounded-2xl w-full max-w-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* URGENT BADGE */}
            {selectedPermintaan.is_urgent && (
              <div className="mb-2">
                <span className="bg-red-100 text-red-500 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  URGENT
                </span>
              </div>
            )}

            {/* HEADER */}
            <div className="flex justify-between items-start gap-2 mb-3">
              <p className="text-sm font-semibold text-gray-800 leading-snug">
                {selectedPermintaan.nama_produk} - {selectedPermintaan.ukuran}
              </p>

              <p className="text-xl font-bold text-gray-900">
                {selectedPermintaan.jumlah}
              </p>
            </div>

            {/* DIVIDER */}
            <div className="h-px bg-gray-200 mb-3" />

            {/* DETAIL */}
            <div className="text-xs text-gray-600 space-y-1 mb-4">
              <p>
                Jumlah diminta :
                <span className="font-medium text-gray-800 ml-1">
                  {selectedPermintaan.jumlah}
                </span>
              </p>
              <p>
                Kategori :
                <span className="font-medium text-gray-800 ml-1">
                  {selectedPermintaan.nama_produk}
                </span>
              </p>
            </div>

            {/* ACTION TEXT */}
            <p className="text-xs text-gray-500 text-center mb-3">
              Lanjut ke proses?
            </p>

            {/* BUTTON */}
            <div className="flex gap-2">
              {/* PROSES */}
              <button
                onClick={() => {
                  mutatePermintaan(
                    {
                      id: selectedPermintaan.id_permintaan,
                      data: {
                        kode_kain: "-",
                        pemotong: "-",
                        pengecek: "-",
                      },
                    },
                    {
                      onSuccess: () => {
                        handleCloseModal();
                        toast.success("Dipindah ke proses");
                      },
                    },
                  );
                }}
                className="flex-1 bg-gradient-to-r from-orange-400 to-amber-500 text-white text-xs py-2.5 rounded-xl font-semibold shadow hover:opacity-90 active:scale-95 transition"
              >
                PROSES
              </button>

              {/* TIDAK */}
              <button
                onClick={handleCloseModal}
                className="flex-1 bg-gray-100 text-gray-700 text-xs py-2.5 rounded-xl font-medium hover:bg-gray-200 active:scale-95 transition"
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
