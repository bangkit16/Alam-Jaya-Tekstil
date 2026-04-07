"use client";

import { useGetKategoriProduk } from "@/services/useGetKategoriProduk";
import { useGetStokProdukByKategori } from "@/services/useGetStokProdukByKategori";
import { usePutStokPotong } from "@/services/usePutStokPotong";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

// 1. Definisi Tipe dan Skema
// interface StokKirimFormData {
//   penjahit: string;
//   admin: string;
//   tanggal_kirim: string;
// }

const kirimSchema = z.object({
  penjahit: z.string().min(1, "Nama penjahit wajib diisi"),
  admin: z.string().min(1, "Nama admin wajib diisi"),
  tanggal_kirim: z.string().min(1, "Tanggal wajib diisi"),
});

type StokKirimFormData = z.infer<typeof kirimSchema>;

type kategoriProdukType = {
  id: string;
  name: string;
  slug: string;
};

type StokPotongType = {
  id_stok_potong: string;
  id_permintaan: string;
  nama_produk: string;
  kode_kain: string;
  kode_potongan: string;
  pengecek: string;
  jumlah_hasil: number;
  ukuran: "S" | "M" | "L" | "XL" | "XXL";
};

export default function Stok() {
  const [selectedKategoriSlug, setSelectedKategoriSlug] = useState<
    string | null
  >(null);
  const [selectedStokPotong, setSelectedStokPotong] =
    useState<StokPotongType | null>(null);

  const { data: dataKategori, isLoading: isLoadingKategori } =
    useGetKategoriProduk();
  const { data: dataStok, isLoading: isLoadingStok } =
    useGetStokProdukByKategori(selectedKategoriSlug);
  const { mutate: mutateStokKirim } = usePutStokPotong();

  // 2. React Hook Form Setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StokKirimFormData>({
    resolver: zodResolver(kirimSchema),
    defaultValues: {
      penjahit: "",
      admin: "",
      tanggal_kirim: "",
    },
  });

  const handleCloseModal = () => {
    setSelectedStokPotong(null);
    reset();
  };

  const onSubmit = (data: StokKirimFormData) => {
    if (!selectedStokPotong) return;

    const submitData = {
      id: selectedStokPotong.id_stok_potong,
      data: data,
    };

    mutateStokKirim(submitData, {
      onSuccess: () => {
        handleCloseModal();
        toast.success("Stok dalam proses kirim");
      },
    });
  };

  return (
    <>
      <div className="flex flex-col gap-3 overflow-y-auto">
        {!selectedKategoriSlug ? (
          isLoadingKategori ? (
            <p className="text-center py-10">Loading Kategori...</p>
          ) : (
            dataKategori?.map((kategori: kategoriProdukType, index: number) => (
              <div
                key={`${kategori.slug}-${index}`}
                onClick={() => setSelectedKategoriSlug(kategori.slug)}
                className="border border-gray-300 rounded-2xl p-4 flex text-center justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <p className="text-sm w-full text-center font-semibold text-gray-800 uppercase tracking-wide">
                  {kategori.name}
                </p>
              </div>
            ))
          )
        ) : (
          <>
            <button
              onClick={() => setSelectedKategoriSlug(null)}
              className="text-xs mb-4 text-blue-600 font-bold flex items-center gap-1"
            >
              ← KEMBALI KE KATEGORI
            </button>

            {isLoadingStok ? (
              <p className="text-center py-10">
                Memuat stok {selectedKategoriSlug}...
              </p>
            ) : dataStok && dataStok.length > 0 ? (
              dataStok?.map((stok: StokPotongType, index: number) => (
                <div
                  key={`${stok.id_stok_potong}-${index}`}
                  onClick={() => setSelectedStokPotong(stok)}
                  className="p-3 border border-gray-300 rounded-xl mb-2 hover:border-purple-300 transition-all cursor-pointer"
                >
                  <div className="flex w-full justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {stok.nama_produk}
                      </p>
                      <div className="text-[10px] text-gray-500 mt-1 space-y-0.5">
                        <p>
                          UKURAN:{" "}
                          <span className="font-bold">{stok.ukuran}</span>
                        </p>
                        <p>
                          KODE POTONGAN:{" "}
                          <span className="font-bold">
                            {stok.kode_potongan}
                          </span>
                        </p>
                        <p>
                          PENGECEK:{" "}
                          <span className="font-bold text-gray-700">
                            {stok.pengecek}
                          </span>
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-2xl text-gray-800">
                      {stok.jumlah_hasil}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl">
                <p className="text-gray-500 font-medium">Data Kosong</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* ================= MODAL KIRIM ================= */}
      {selectedStokPotong && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
          onClick={handleCloseModal}
        >
          <form
            className="bg-white p-5 rounded-xl w-full max-w-xs shadow-lg"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <p className="text-sm font-bold text-gray-700 truncate mr-2">
                {selectedStokPotong.nama_produk}
              </p>
              <p className="text-sm font-bold text-purple-600 whitespace-nowrap">
                {selectedStokPotong.jumlah_hasil} Pcs
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <p className="text-[10px] text-gray-400 uppercase mb-1 font-bold">
                  Penjahit
                </p>
                <input
                  {...register("penjahit")}
                  placeholder="Nama penjahit"
                  className={`w-full border ${errors.penjahit ? "border-red-500" : "border-gray-200"} px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-200 text-gray-700`}
                />
                {errors.penjahit && (
                  <p className="text-[9px] text-red-500 mt-1">
                    {errors.penjahit.message}
                  </p>
                )}
              </div>

              <div>
                <p className="text-[10px] text-gray-400 uppercase mb-1 font-bold">
                  Admin
                </p>
                <input
                  {...register("admin")}
                  placeholder="Nama admin"
                  className={`w-full border ${errors.admin ? "border-red-500" : "border-gray-200"} px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-200 text-gray-700`}
                />
                {errors.admin && (
                  <p className="text-[9px] text-red-500 mt-1">
                    {errors.admin.message}
                  </p>
                )}
              </div>

              <div>
                <p className="text-[10px] text-gray-400 uppercase mb-1 font-bold">
                  Tanggal
                </p>
                <input
                  {...register("tanggal_kirim")}
                  type="date"
                  className={`w-full border ${errors.tanggal_kirim ? "border-red-500" : "border-gray-200"} px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-200 text-gray-700`}
                />
                {errors.tanggal_kirim && (
                  <p className="text-[9px] text-red-500 mt-1">
                    {errors.tanggal_kirim.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={handleCloseModal}
                className="flex-1 py-2 text-sm text-gray-400 font-medium hover:text-gray-600 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 bg-purple-500 text-white text-sm py-2 rounded-lg font-semibold active:scale-95 transition-all hover:bg-purple-600 shadow-md"
              >
                Kirim
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
