"use client";

import { useEffect, useState, useRef } from "react"; // Tambah useRef
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  useGetProsesInfinite,
  ProsesType,
} from "@/services/stok-potong/useGetProses";
import { usePutProses } from "@/services/stok-potong/usePutProses";
import { useGetPengecek } from "@/services/stok-potong/useGetPengecek";

import { toast } from "sonner";
import { Package } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

// ... (Zod Schema tetap sama)
const prosesSchema = (jumlahHasil: number) =>
  z
    .object({
      pengecek: z
        .array(z.string())
        .min(1, "Pilih minimal 1 pengecek")
        .max(2, "Maksimal 2 pengecek"),
      kode_potongan: z.string().min(1, "Kode potongan wajib diisi"),
      jumlah_lolos: z
        .any()
        .refine((val) => val !== "", "Jumlah Lolos wajib diisi")
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val), "Harus berupa angka")
        .refine((val) => val >= 0, "Minimal jumlah adalah 0"),
      jumlah_reject: z
        .any()
        .refine((val) => val !== "", "Jumlah Reject wajib diisi")
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val), "Harus berupa angka")
        .refine((val) => val >= 0, "Minimal jumlah adalah 0"),
      catatan: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      const total = data.jumlah_lolos + data.jumlah_reject;
      if (total > jumlahHasil)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["jumlah_lolos"],
          message: `Total melebihi (${jumlahHasil})`,
        });
      if (total < jumlahHasil)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["jumlah_reject"],
          message: `Total kurang (${jumlahHasil})`,
        });
    });

type ProsesFormValues = z.infer<ReturnType<typeof prosesSchema>>;
type pengecekType = { id: string; nama: string };

export default function Proses() {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetProsesInfinite();
  const { data: pengecekList } = useGetPengecek();
  const { mutate, isPending } = usePutProses();

  const [selectedPermintaan, setSelectedPermintaan] =
    useState<ProsesType | null>(null);

  // 1. Ref untuk sensor scroll
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const allProsesData = data?.pages.flatMap((page) => page.data) || [];
  const jumlahHasil = selectedPermintaan?.jumlahHasil || 0;

  // 2. Logic Intersection Observer untuk Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProsesFormValues>({
    resolver: zodResolver(prosesSchema(jumlahHasil)),
    defaultValues: {
      pengecek: [],
      kode_potongan: "",
      jumlah_lolos: 0,
      jumlah_reject: 0,
      catatan: "",
    },
  });

  useEffect(() => {
    if (selectedPermintaan) {
      reset({
        pengecek: [],
        kode_potongan: selectedPermintaan.kodeKain || "",
        jumlah_lolos: 0,
        jumlah_reject: 0,
        catatan: "",
      });
    }
  }, [selectedPermintaan, reset]);

  const selectedPengecek = watch("pengecek");
  const handleClose = () => {
    setSelectedPermintaan(null);
    reset();
  };

  const onSubmit: SubmitHandler<ProsesFormValues> = (values) => {
    if (!selectedPermintaan) return;
    mutate(
      {
        id: selectedPermintaan.idStokPotong,
        payload: {
          idPengecek: values.pengecek,
          kodeStokPotongan: values.kode_potongan,
          jumlahPotonganLolos: values.jumlah_lolos,
          jumlahPotonganReject: values.jumlah_reject,
          catatan: values.catatan ?? "",
        },
      },
      {
        onSuccess: () => {
          toast.success("Berhasil");
          handleClose();
          refetch();
        },
      },
    );
  };

  return (
    <>
      <div className="flex flex-col flex-1 overflow-y-auto gap-3 pb-5">
        {isLoading ? (
          <LoadingSpinner />
        ) : allProsesData.length > 0 ? (
          <>
            {allProsesData.map((item: ProsesType) => (
              <div
                key={item.idStokPotong}
                onClick={() => setSelectedPermintaan(item)}
                className="border border-gray-300 rounded-2xl p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition"
              >
                <div>
                  {item.isUrgent && (
                    <p className="text-xs text-red-500 font-semibold mb-2">
                      URGENT
                    </p>
                  )}
                  <p className="text-sm font-semibold text-gray-800">
                    {item.namaBarang} - {item.ukuran}
                  </p>
                  <p className="text-xs text-gray-500 ">
                    Kode Kain : {item.kodeKain}
                  </p>
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {item.jumlahHasil}
                </p>
              </div>
            ))}

            {/* 3. Sensor Element (loadMoreRef) */}
            <div
              ref={loadMoreRef}
              className="h-10 flex items-center justify-center"
            >
              {isFetchingNextPage && <LoadingSpinner />}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <div className="bg-orange-100 text-orange-500 p-4 rounded-full mb-4">
              <Package size={30} />
            </div>
            <p className="font-semibold text-gray-500 mb-1">Belum ada data</p>
          </div>
        )}
      </div>

      {/* MODAL (Tetap Sama) */}
      {selectedPermintaan && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4"
          onClick={handleClose}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-sm rounded-xl p-4 shadow-xl"
          >
            {/* Header */}

            {selectedPermintaan.isUrgent && (
              <p className="text-xs text-red-500 font-semibold mb-2">URGENT</p>
            )}

            <div className="flex justify-between mb-4">
              <p className="text-sm font-semibold">
                {selectedPermintaan.namaBarang} - {selectedPermintaan.ukuran}
              </p>

              <p className="text-lg font-bold">
                {selectedPermintaan.jumlahHasil}
              </p>
            </div>

            <div className="flex justify-between mb-2">
              <p className="text-xs font-">
                Kode Kain : {selectedPermintaan.kodeKain}
              </p>
            </div>

            <div className="space-y-3">
              {/* ===============================

                  PENGECEK MULTI SELECT

              ================================= */}

              <div className="space-y-2">
                {/* Badge */}

                <div className="flex flex-wrap gap-2">
                  {selectedPengecek.map((id) => {
                    const nama =
                      pengecekList?.find((item: pengecekType) => item.id === id)
                        ?.nama || id;

                    return (
                      <div
                        key={id}
                        className="flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs"
                      >
                        {nama}

                        <button
                          type="button"
                          onClick={() =>
                            setValue(
                              "pengecek",

                              selectedPengecek.filter((item) => item !== id),

                              { shouldValidate: true },
                            )
                          }
                          className="text-red-500 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Select */}

                <select
                  value=""
                  onChange={(e) => {
                    const val = e.target.value;

                    if (!val) return;

                    if (selectedPengecek.includes(val)) {
                      toast.error("Sudah dipilih");

                      return;
                    }

                    if (selectedPengecek.length >= 2) {
                      toast.error("Maksimal 2 pengecek");

                      return;
                    }

                    setValue("pengecek", [...selectedPengecek, val], {
                      shouldValidate: true,
                    });
                  }}
                  className={`w-full bg-gray-100 rounded-xl px-3 py-2 text-sm outline-none ${
                    errors.pengecek ? "border border-red-500" : ""
                  }`}
                >
                  <option value="">Pilih Pengecek</option>

                  {pengecekList?.map((item: pengecekType) => (
                    <option key={item.id} value={item.id}>
                      {item.nama}
                    </option>
                  ))}
                </select>

                {errors.pengecek && (
                  <p className="text-[10px] text-red-500">
                    {errors.pengecek.message}
                  </p>
                )}
              </div>

              {/* KODE POTONGAN */}

              <div>
                <label className="text-xs font-semibold text-gray-600">
                  Kode Potongan
                </label>
                <input
                  {...register("kode_potongan")}
                  placeholder="Kode Potongan"
                  className={`w-full bg-gray-100 px-3 py-2 rounded text-xs outline-none ${
                    errors.kode_potongan ? "border border-red-500" : ""
                  }`}
                />

                {errors.kode_potongan && (
                  <p className="text-[10px] text-red-500 mt-1">
                    {errors.kode_potongan.message}
                  </p>
                )}
              </div>

              {/* JUMLAH LOLOS */}
              <div className="flex space-x-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600">
                    Jumlah Lolos
                  </label>
                  <input
                    type="number"
                    {...register("jumlah_lolos")}
                    placeholder="Jumlah Lolos"
                    className={`w-full bg-gray-100 px-3 py-2 rounded text-xs outline-none ${
                      errors.jumlah_lolos ? "border border-red-500" : ""
                    }`}
                  />

                  {errors.jumlah_lolos && (
                    <p className="text-[10px] text-red-500 mt-1">
                      {errors.jumlah_lolos.message}
                    </p>
                  )}
                </div>

                {/* JUMLAH REJECT */}

                <div>
                  <label className="text-xs font-semibold text-gray-600">
                    Jumlah Reject
                  </label>
                  <input
                    type="number"
                    {...register("jumlah_reject")}
                    placeholder="Jumlah Reject"
                    className={`w-full bg-gray-100 px-3 py-2 rounded text-xs outline-none ${
                      errors.jumlah_reject ? "border border-red-500" : ""
                    }`}
                  />

                  {errors.jumlah_reject && (
                    <p className="text-[10px] text-red-500 mt-1">
                      {errors.jumlah_reject.message}
                    </p>
                  )}
                </div>
              </div>

              {/* CATATAN */}

              <label className="text-xs font-semibold text-gray-600">
                Catatan
              </label>
              <input
                {...register("catatan")}
                placeholder="Catatan (Opsional)"
                className="w-full bg-gray-100 px-3 py-2 rounded text-xs outline-none"
              />
            </div>

            {/* BUTTON */}

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={isPending}
                className="bg-orange-500 text-white text-xs px-6 py-2 rounded font-medium disabled:opacity-50 active:scale-95 transition"
              >
                {isPending ? "Menyimpan..." : "Selesai"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
