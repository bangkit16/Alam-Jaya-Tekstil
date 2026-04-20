"use client";

import { useState } from "react";
import { Package } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useGetProses } from "@/services/stok-potong/useGetProses";
import { usePutProses } from "@/services/stok-potong/usePutProses";
import { useGetPengecek } from "@/services/stok-potong/useGetPengecek";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import Pagination from "@/components/Pagination";
import { toast } from "sonner";

/* ================= SCHEMA ================= */

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

      if (total > jumlahHasil) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["jumlah_lolos"],
          message: `Total melebihi (${jumlahHasil})`,
        });
      }

      if (total < jumlahHasil) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["jumlah_reject"],
          message: `Total kurang (${jumlahHasil})`,
        });
      }
    });

type ProsesFormValues = z.infer<ReturnType<typeof prosesSchema>>;
type pengecekType = { id: string; nama: string };

export default function Proses() {
  const [page, setPage] = useState(1);

  const { data: dataProses, isLoading } = useGetProses(page);
  const { data: pengecekList } = useGetPengecek();
  const { mutate, isPending } = usePutProses();

  const [selected, setSelected] = useState<any>(null);

  const data = dataProses?.data || [];
  const meta = dataProses?.meta;
  const count = data.length || 0;

  const form = useForm<ProsesFormValues>({
    resolver: zodResolver(prosesSchema(selected?.jumlahHasil || 0)),
    defaultValues: {
      pengecek: [],
      kode_potongan: "",
      jumlah_lolos: 0,
      jumlah_reject: 0,
      catatan: "",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = form;

  const selectedPengecek = watch("pengecek") || [];

  const submitHandler = (values: ProsesFormValues) => {
    mutate(
      {
        id: selected.idStokPotong,
        payload: {
          idPengecek: values.pengecek,
          kodeStokPotongan: values.kode_potongan,
          jumlahPotonganLolos: values.jumlah_lolos,
          jumlahPotonganReject: values.jumlah_reject,
          catatan: values.catatan,
        },
      },
      {
        onSuccess: (data) => {
          toast.success("Potongan selesai di cek");
          setSelected(null);
          reset();
        },
      },
    );

  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <div className="mt-2">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-base font-semibold text-gray-800">
              Data Proses
            </h2>

            <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600">
              {count} item
            </span>
          </div>

          {/* CONTENT */}
          {count === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <div className="bg-blue-100 text-blue-500 p-4 rounded-full mb-4">
                <Package size={28} />
              </div>

              <p className="font-medium text-gray-500 mb-1">
                Belum ada data proses
              </p>

              <p className="text-xs text-gray-400">
                Data proses akan muncul di sini
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.map((item: any) => (
                <div
                  key={item.idStokPotong}
                  onClick={() => {
                    setSelected(item);
                    reset({
                      pengecek: [],
                      kode_potongan: "",
                      jumlah_lolos: 0,
                      jumlah_reject: 0,
                      catatan: "",
                    });
                  }}
                  className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm cursor-pointer hover:bg-gray-50 transition"
                >
                  {item.isUrgent && (
                    <span className="text-sm text-red-600  font-bold">
                      URGENT
                    </span>
                  )}
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-semibold text-gray-800">
                      {item.namaBarang} - {item.ukuran}
                    </p>

                    <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">
                      Proses
                    </span>
                  </div>

                  <div className="h-px bg-gray-200 mb-2" />

                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Nama Produk : {item.namaBarang}</p>
                    <p>Ukuran : {item.ukuran}</p>
                    <p>Jumlah : {item.jumlahHasil}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {meta && meta.totalPages > 1 && (
            <Pagination meta={meta} onPageChange={setPage} />
          )}
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4"
          onClick={() => {
            setSelected(null);
            reset();
          }}
        >
          <form
            onSubmit={handleSubmit(submitHandler)}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-sm rounded-xl p-4 shadow-xl"
          >
            {/* HEADER */}

            {selected.isUrgent && (
              <span className="text-md text-red-600  font-bold">URGENT</span>
            )}

            <div className="flex justify-between mb-4">
              <p className="text-sm font-semibold">
                {selected.namaBarang} - {selected.ukuran}
              </p>

              <p className="text-lg font-bold">{selected.jumlahHasil}</p>
            </div>
            <p className="text-sm font-semibold">
              Kode Kain : {selected.kodeKain}
            </p>

            <div className="space-y-3">
              {/* ===============================
            PENGECEK MULTI SELECT
        ============================== */}

              <div className="space-y-2">
                {/* badge */}
                <div className="flex flex-wrap gap-2">
                  {selectedPengecek.map((id) => {
                    const nama =
                      pengecekList?.find((item: any) => item.id === id)?.nama ||
                      id;

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

                {/* select */}
                <select
                  value=""
                  onChange={(e) => {
                    const val = e.target.value;

                    if (!val) return;

                    if (selectedPengecek.includes(val)) return;

                    if (selectedPengecek.length >= 2) return;

                    setValue("pengecek", [...selectedPengecek, val], {
                      shouldValidate: true,
                    });
                  }}
                  className={`w-full bg-gray-100 px-3 py-2 rounded-xl text-sm ${
                    errors.pengecek ? "border border-red-500" : ""
                  }`}
                >
                  <option value="">Pilih pengecek</option>

                  {pengecekList?.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.nama}
                    </option>
                  ))}
                </select>

                {errors.pengecek && (
                  <p className="text-[10px] text-red-500">
                    {errors.pengecek.message}
                  </p>
                )}
              </div>

              {/* KODE */}
              <div>
                <label className="text-xs font-semibold text-gray-600">
                  Kode
                </label>

                <input
                  {...register("kode_potongan")}
                  placeholder="Kode"
                  className={`w-full bg-gray-100 px-3 py-2 rounded text-xs ${
                    errors.kode_potongan ? "border border-red-500" : ""
                  }`}
                />

                {errors.kode_potongan && (
                  <p className="text-[10px] text-red-500 mt-1">
                    {errors.kode_potongan.message}
                  </p>
                )}
              </div>

              {/* LOLOS & REJECT */}
              <div className="flex gap-3">
                <div className="w-full">
                  <label className="text-xs font-semibold text-gray-600">
                    Lolos
                  </label>

                  <input
                    type="number"
                    {...register("jumlah_lolos")}
                    placeholder="Lolos"
                    className={`w-full bg-gray-100 px-3 py-2 rounded text-xs ${
                      errors.jumlah_lolos ? "border border-red-500" : ""
                    }`}
                  />

                  {errors.jumlah_lolos && (
                    <p className="text-[10px] text-red-500 mt-1">
                      {errors.jumlah_lolos.message}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <label className="text-xs font-semibold text-gray-600">
                    Reject
                  </label>

                  <input
                    type="number"
                    {...register("jumlah_reject")}
                    placeholder="Reject"
                    className={`w-full bg-gray-100 px-3 py-2 rounded text-xs ${
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
              <div>
                <label className="text-xs font-semibold text-gray-600">
                  Catatan
                </label>

                <input
                  {...register("catatan")}
                  placeholder="Catatan"
                  className="w-full bg-gray-100 px-3 py-2 rounded text-xs"
                />
              </div>
            </div>

            {/* BUTTON */}
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className=" w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2.5 rounded-xl font-semibold hover:scale-[1.02] active:scale-[0.98] transition"
              >
                {isPending ? "Loading..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
