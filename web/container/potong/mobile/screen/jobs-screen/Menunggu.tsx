"use client";

import { useGetPermintaan } from "@/services/potong/useGetPermintaan";
import { usePutPermintaan } from "@/services/potong/usePutPermintaan";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

// Skema Validasi
const permintaanSchema = z.object({
  kode_kain: z.string().min(1, "Kode kain wajib diisi"),
  pemotong: z.string().min(1, "Nama pemotong wajib diisi"),
  pengecek: z.string().min(1, "Nama pengecek wajib diisi"),
});

type PermintaanFormData = z.infer<typeof permintaanSchema>;

type permintaanType = {
  idPermintaan: string;
  namaBarang: string;
  kategori: string;
  jumlahMinta: number;
  ukuran: "M" | "L" | "XL" | "XXL";
  isUrgent: boolean;
};

export default function Menunggu() {
  const [selectedPermintaan, setSelectedPermintaan] =
    useState<permintaanType | null>(null);

  const { data: dataPermintaan, isLoading: isLoadingPermintaan } =
    useGetPermintaan();
  const { mutate: mutatePermintaan, data: dataMutate } = usePutPermintaan();

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
      id: selectedPermintaan.idPermintaan,
      data: data,
    };

    mutatePermintaan(submitData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["permintaans"] }); // 🔥 TAMBAH INI
        handleCloseModal();
        toast.success((dataMutate as any)?.message);
      },
    });
  };

  const handleCloseModal = () => {
    setSelectedPermintaan(null);
    reset(); // Reset form ke default
  };

  // 🔥 helper capitalize (biar UI rapi)
  const capitalize = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1);

  //
  const queryClient = useQueryClient();

  // console.log(dataPermintaan)

  return (
    <>
      {/* ================= LIST ================= */}
      <div className="flex flex-col gap-3 overflow-y-auto">
        {isLoadingPermintaan ? (
          <p className="text-center py-4">Loading...</p>
        ) : dataPermintaan.data && dataPermintaan.data.length > 0 ? (
          dataPermintaan.data.map((permintaan: permintaanType, index: number) => (
            <div
              key={`${permintaan.idPermintaan}-${index}`}
              onClick={() => setSelectedPermintaan(permintaan)}
              className="border border-gray-300 rounded-2xl p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50"
            >
              {/* LEFT */}
              <div className="flex-row w-full justify-between align-middle items-center">
                {permintaan.isUrgent && (
                  <p className="text-red-500 text-sm uppercase font-semibold">
                    Urgent
                  </p>
                )}

                <p className="text-sm font-semibold text-gray-800 my-1">
                  {permintaan.namaBarang} - {permintaan.ukuran}
                </p>

                <div className="space-y-0.5">
                  <p className="text-xs font-medium text-gray-400 uppercase">
                    NAMA PRODUK :
                    <span className="font-bold text-gray-600">
                      {permintaan.namaBarang}
                    </span>
                  </p>

                  <p className="text-xs font-medium text-gray-400 uppercase">
                    UKURAN :
                    <span className="font-bold text-gray-600">
                      {permintaan.ukuran}
                    </span>
                  </p>

                  <p className="text-xs font-medium text-gray-400 uppercase">
                    JUMLAH DIMINTA :
                    <span className="font-bold text-gray-600">
                      {permintaan.jumlahMinta}
                    </span>
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-800">
                  {permintaan.jumlahMinta}
                </p>
              </div>
            </div>
          ))
        ) : (
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
            {selectedPermintaan.isUrgent && (
              <div className="mb-2">
                <span className="bg-red-100 text-red-500 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  URGENT
                </span>
              </div>
            )}

            {/* HEADER */}
            <div className="flex justify-between items-start gap-2 mb-3">
              <p className="text-sm font-semibold text-gray-800 leading-snug">
                {selectedPermintaan.namaBarang} - {selectedPermintaan.ukuran}
              </p>

              <p className="text-xl font-bold text-gray-900">
                {selectedPermintaan.jumlahMinta}
              </p>
            </div>

            {/* DIVIDER */}
            <div className="h-px bg-gray-200 mb-3" />

            {/* DETAIL */}
            <div className="text-xs text-gray-600 space-y-1 mb-4">
              <p>
                Jumlah diminta :
                <span className="font-medium text-gray-800 ml-1">
                  {selectedPermintaan.jumlahMinta}
                </span>
              </p>
              <p>
                Kategori :
                <span className="font-medium text-gray-800 ml-1">
                  {capitalize(selectedPermintaan.kategori)}
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
                      id: selectedPermintaan.idPermintaan,
                      data: {
                        kode_kain: "-",
                        pemotong: "-",
                        pengecek: "-",
                      },
                    },
                    {
                      onSuccess: (data) => {
                        queryClient.invalidateQueries({
                          queryKey: ["permintaans"],
                        }); // 🔥 TAMBAH INI
                        handleCloseModal();
                        toast.success("Berhasil dipindah ke proses");
                      },
                    },
                  );
                }}
                className="flex-1 bg-linear-to-r from-orange-400 to-amber-500 text-white text-xs py-2.5 rounded-xl font-semibold shadow hover:opacity-90 active:scale-95 transition"
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
