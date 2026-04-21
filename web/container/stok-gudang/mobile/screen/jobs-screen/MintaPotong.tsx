"use client";

import { useEffect, useRef, useState } from "react";
import { useGetPermintaanPotongInfinite } from "@/services/stok-gudang/useGetPermintaanPotong";
import { useGetTracking } from "@/services/stok-gudang/useGetTracking";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { usePostMintaPotong } from "@/services/stok-gudang/usePostMintaPotong";
import { useGetKategori } from "@/services/stok-gudang/useGetKategori";
import { Package } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function MintaPotong({ search = "" }: any) {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const PermintaanSchema = z.object({
    nama: z.string().min(3, "Nama produk minimal 3 karakter"),
    jumlah: z
      .any()
      .refine((val) => val !== "", "Jumlah wajib diisi")
      .transform((val) => Number(val))
      .refine((val) => !isNaN(val), "Harus berupa angka")
      .refine((val) => val > 0, "Minimal jumlah adalah 1"),
    ukuran: z.string().min(1, "Ukuran harus diisi"),
    kategori: z.string().min(1, "Pilih salah satu kategori"),
    isUrgent: z.boolean(),
  });

  type PermintaanFormData = z.infer<typeof PermintaanSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PermintaanFormData>({
    resolver: zodResolver(PermintaanSchema),
    defaultValues: {
      nama: "",
      jumlah: "" as any,
      ukuran: "",
      kategori: "",
      isUrgent: false,
    },
  });

  const isUrgent = watch("isUrgent");

  const mutationPost = usePostMintaPotong();
  const { data: dataKategori = [] } = useGetKategori();

  const onSubmit = (data: PermintaanFormData) => {
    mutationPost.mutate(
      {
        namaBarang: data.nama,
        kategori: data.kategori,
        ukuran: data.ukuran,
        isUrgent: data.isUrgent,
        jumlahMinta: data.jumlah,
      },
      {
        onSuccess: () => {
          setOpen(false);
          reset();
        },
      },
    );
  };

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetPermintaanPotongInfinite(5);

  const permintaanData = data?.pages.flatMap((page: any) => page.data) ?? [];

  useEffect(() => {
    const target = loadMoreRef.current;
    const root = scrollRef.current;

    if (!target || !root) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root,
        threshold: 0,
        rootMargin: "300px",
      },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [data?.pages.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const { data: tracking, isLoading: isTrackingLoading } = useGetTracking(
    selectedId || "",
  );

  const filtered =
    permintaanData.filter((d: any) =>
      d.namaBarang.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <div className="flex flex-col h-full gap-2">
        <div
          ref={scrollRef}
          className="flex flex-col gap-2 flex-1 overflow-auto"
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin mb-2"></div>
              <p className="text-xs text-gray-400">Memuat data...</p>
            </div>
          ) : filtered.length > 0 ? (
            <>
              {filtered.map((item: any) => (
                <div
                  key={item.idPermintaan}
                  className="bg-white border rounded-xl p-3 shadow-sm"
                >
                  {item.isUrgent && (
                    <p className="text-[10px] text-red-500 font-bold mb-1">
                      URGENT
                    </p>
                  )}

                  <div className="flex justify-between">
                    <p className="text-sm font-medium">
                      {item.namaBarang} - {item.ukuran}
                    </p>

                    <p className="text-lg font-bold">{item.jumlahMinta}</p>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-600 uppercase">
                      STATUS : {item.status.replace(/_/g, " ")}
                    </p>

                    <button
                      onClick={() => setSelectedId(item.idPermintaan)}
                      className="bg-gray-300 text-[10px] px-2 py-1 rounded"
                    >
                      TRACK
                    </button>
                  </div>
                </div>
              ))}

              <div
                ref={loadMoreRef}
                className="h-48 flex items-center justify-center"
              >
                {isFetchingNextPage && (
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <div className="w-4 h-4 border-2 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
                    Memuat data...
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <div className="bg-orange-100 text-orange-500 p-4 rounded-full mb-4">
                <Package size={30} />
              </div>

              <p className="font-semibold text-gray-500 mb-1">Belum ada data</p>

              <p className="text-xs text-gray-400">Data akan muncul di sini</p>
            </div>
          )}
        </div>

        <div className=" flex justify-center">
          <button
            onClick={() => setOpen(true)}
            className="bg-amber-500 text-sm w-full px-3 py-2 rounded-xl font-bold text-white shadow"
          >
            MINTA POTONG
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white w-[90%] max-w-sm rounded-2xl p-4 shadow-xl"
          >
            <p className="text-sm font-semibold mb-3">Permintaan</p>

            <div className="space-y-2">
              <input
                {...register("nama")}
                placeholder="Nama produk"
                className={`w-full bg-gray-100 px-3 py-2 rounded text-xs outline-none ${
                  errors.nama ? "border border-red-500" : ""
                }`}
              />

              {errors.nama && (
                <p className="text-[10px] text-red-500">
                  {errors.nama.message}
                </p>
              )}

              <input
                {...register("jumlah")}
                type="number"
                placeholder="Jumlah"
                className={`w-full bg-gray-100 px-3 py-2 rounded text-xs outline-none ${
                  errors.jumlah ? "border border-red-500" : ""
                }`}
              />

              {errors.jumlah && (
                <p className="text-[10px] text-red-500">
                  {errors.jumlah.message}
                </p>
              )}

              <select
                {...register("ukuran")}
                className={`w-full bg-gray-100 px-3 py-2 rounded text-xs outline-none ${
                  errors.ukuran ? "border border-red-500" : ""
                }`}
              >
                <option value="">Pilih Ukuran</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
                <option value="L">L</option>
                <option value="M">M</option>
              </select>

              {errors.ukuran && (
                <p className="text-[10px] text-red-500">
                  {errors.ukuran.message}
                </p>
              )}

              <select
                {...register("kategori")}
                className={`w-full bg-gray-100 px-3 py-2 rounded text-xs outline-none ${
                  errors.kategori ? "border border-red-500" : ""
                }`}
              >
                <option value="">Pilih Kategori</option>

                {dataKategori.map((kat: any) => (
                  <option key={kat.id} value={kat.slug}>
                    {kat.namaKategori}
                  </option>
                ))}
              </select>

              {errors.kategori && (
                <p className="text-[10px] text-red-500">
                  {errors.kategori.message}
                </p>
              )}

              <button
                type="button"
                onClick={() => setValue("isUrgent", !isUrgent)}
                className={`text-xs px-3 py-1 rounded transition-colors ${
                  isUrgent
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                IsUrgent
              </button>
            </div>

            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => {
                  setOpen(false);
                  reset();
                }}
                type="button"
                className="text-xs px-3 py-1 text-gray-500"
              >
                Batal
              </button>

              <button
                type="submit"
                className="bg-orange-500 text-white text-xs px-4 py-1 rounded shadow hover:bg-blue-700"
              >
                {mutationPost.isPending ? "MENGIRIM..." : "KIRIM"}
              </button>
            </div>
          </form>

          <div
            className="absolute inset-0 -z-10"
            onClick={() => setOpen(false)}
          />
        </div>
      )}

      {selectedId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-sm rounded-2xl p-4 shadow-xl max-h-[80vh] flex flex-col">
            <p className="text-sm font-semibold mb-3">Tracking Detail</p>

            {isTrackingLoading ? (
              <div className="py-10 text-center text-xs text-gray-500">
                Memuat data tracking...
              </div>
            ) : tracking ? (
              <>
                <div className="bg-gray-100 rounded-xl p-3 text-xs space-y-1">
                  {tracking.isUrgent && (
                    <p className="text-red-500 text-sm font-bold">URGENT</p>
                  )}

                  <p>
                    <b>Produk:</b> {tracking.namaBarang} ({tracking.ukuran})
                  </p>

                  <p>
                    <b>Jumlah:</b> {tracking.jumlahMinta}
                  </p>

                  <p>
                    <b>Kategori:</b> {tracking.kategori}
                  </p>

                  <p>
                    <b>Jenis Permintaan:</b> {tracking.jenisPermintaan}
                  </p>

                  <p>
                    <b>Status Terakhir:</b>{" "}
                    {tracking.logPermintaan[
                      tracking.logPermintaan.length - 1
                    ]?.status.replace(/_/g, " ")}
                  </p>
                </div>

                <div className="mt-3 text-[11px] space-y-2 overflow-y-auto pr-1">
                  {Array.isArray(tracking?.logPermintaan) ? (
                    [...tracking.logPermintaan]
                      .reverse()
                      .map((log: any, idx: number) => (
                        <div
                          key={idx}
                          className="bg-white border rounded p-2 border-l-4 border-l-amber-400"
                        >
                          <div className="flex justify-between items-start">
                            <p className="font-bold text-gray-400 text-[9px]">
                              {log.tanggal}
                            </p>

                            <span className="text-[8px] bg-amber-50 text-amber-600 px-1 rounded">
                              {log.status?.replace(/_/g, " ")}
                            </span>
                          </div>

                          <p className="text-gray-700 mt-1">{log.keterangan}</p>
                        </div>
                      ))
                  ) : (
                    <p className="text-center text-gray-400 py-4">
                      Belum ada riwayat log.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="py-10 text-center text-xs text-red-500">
                Data tidak ditemukan
              </div>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedId(null)}
                className="text-xs font-medium text-amber-600 hover:underline"
              >
                Tutup
              </button>
            </div>
          </div>

          <div
            className="absolute inset-0 -z-10"
            onClick={() => setSelectedId(null)}
          />
        </div>
      )}
    </>
  );
}
