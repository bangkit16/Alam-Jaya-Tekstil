"use client";

import { useState } from "react";
import { useGetPermintaanPotong } from "@/services/stok-gudang/useGetPermintaanPotong";
import { usePostMintaPotong } from "@/services/stok-gudang/usePostMintaPotong";
import { useGetTracking } from "@/services/stok-gudang/useGetTracking";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useGetKategori } from "@/services/stok-gudang/useGetKategori";
import Pagination from "@/components/Pagination";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function MintaPotong() {
  const [page, setPage] = useState(1);
  const { data: dataPermintaan, isLoading } = useGetPermintaanPotong(page);
  const mutationPost = usePostMintaPotong();
  const { data: dataKategori } = useGetKategori();

  const data = dataPermintaan?.data || [];
  const meta = dataPermintaan?.meta;

  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: tracking, isLoading: isTrackingLoading } = useGetTracking(
    selectedId || "",
  );

  const PermintaanSchema = z.object({
    nama: z.string().min(3, "Nama produk minimal 3 karakter"),
    jumlah: z
      .any() // Menghindari konflik awal tipe data
      .refine((val) => val !== "", "Jumlah wajib diisi")
      .transform((val) => Number(val))
      .refine((val) => !isNaN(val), "Harus berupa angka")
      .refine((val) => val > 0, "Minimal jumlah adalah 1"),
    ukuran: z.string().min(1, "Ukuran harus diisi"),
    kategori: z.string().min(1, "Pilih salah satu kategori"),
    isUrgent: z.boolean(),
  });

  // Type untuk TypeScript
  type PermintaanFormData = z.infer<typeof PermintaanSchema>;

  // ================= FORM VALIDATION =================
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
        onSuccess: (data) => {
          toast.success(data.message);
          setOpen(false);
          reset(); // Kosongkan form setelah sukses
        },
      },
    );
  };

  return (
    <>
      {/* ================= BUTTON ================= */}
      <button
        onClick={() => setOpen(true)}
        className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-1 px-3 rounded-sm font-bold mb-4 text-base hover:scale-[1.02] active:scale-95 transition disabled:opacity-50 disabled:scale-100"
      >
        Minta Potong
      </button>
      {/* ================= LIST ================= */}
      {isLoading && <LoadingSpinner />}
      <div className=" grid grid-cols-1 md:grid-cols-2  gap-3">
        {data.map((i: any) => (
          <div
            key={i.idPermintaan}
            // TAMBAHKAN: flex flex-col agar anak-anaknya bisa diatur posisinya
            className="bg-white p-4 rounded-2xl flex flex-col shadow border cursor-pointer hover:bg-gray-50 h-full"
            onClick={() => setSelectedId(i.idPermintaan)}
          >
            {/* Container Atas & Tengah */}
            <div className="flex-grow">
              {i.isUrgent && (
                <p className="text-xs text-red-500 font-bold mb-1">URGENT</p>
              )}

              <div className="flex justify-between">
                <p className="font-medium">
                  {i.namaBarang} - {i.ukuran}
                </p>
                <p className="font-bold">{i.jumlahMinta}</p>
              </div>
            </div>

            {/* Bagian Bawah (Sekarang akan selalu nempel di bawah karena mt-auto) */}
            <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
              <p>STATUS : {i.status.replace(/_/g, " ")}</p>
              <button className=" bg-gradient-to-r from-slate-500 to-gray-700 text-white py-1 px-2 rounded-sm font-bold text-xs hover:scale-[1.02] active:scale-95 transition disabled:opacity-50 disabled:scale-100">
                TRACK
              </button>
            </div>
          </div>
        ))}
      </div>
        {meta && meta.totalPages > 1 && (
          <Pagination meta={meta} onPageChange={setPage} />
        )}

      {/* ================= MODAL FORM ================= */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg shadow-xl rounded-sm p-6 relative">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* HEADER */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 tracking-tight">
                  Permintaan Baru
                </h3>
                <p className="text-xs text-gray-400">
                  Isi detail produk untuk membuat permintaan produksi.
                </p>
              </div>

              <div className="space-y-4 border-t pt-4 mb-6">
                {/* Input Nama */}
                <div>
                  <label className="block mb-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Nama Produk
                  </label>
                  <input
                    {...register("nama", {
                      required: "Nama produk wajib diisi",
                    })}
                    placeholder="Masukkan nama produk"
                    className={`w-full bg-gray-100 px-4 py-2.5 rounded-sm text-sm outline-none focus:ring-1 focus:ring-orange-500 transition ${errors.nama ? "border border-red-500" : "border-none"}`}
                  />
                  {errors.nama && (
                    <p className="text-[10px] text-red-500 mt-1 font-bold">
                      {errors.nama.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Input Jumlah */}
                  <div>
                    <label className="block mb-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Jumlah
                    </label>
                    <input
                      {...register("jumlah", {
                        required: "Jumlah wajib diisi",
                        min: { value: 1, message: "Minimal 1" },
                      })}
                      type="number"
                      placeholder="0"
                      className={`w-full bg-gray-100 px-4 py-2.5 rounded-sm text-sm outline-none focus:ring-1 focus:ring-orange-500 transition ${errors.jumlah ? "border border-red-500" : "border-none"}`}
                    />
                    {errors.jumlah && (
                      <p className="text-[10px] text-red-500 mt-1 font-bold">
                        {errors.jumlah.message}
                      </p>
                    )}
                  </div>

                  {/* Select Ukuran */}
                  <div>
                    <label className="block mb-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Ukuran
                    </label>
                    <select
                      {...register("ukuran", { required: "Pilih ukuran" })}
                      className={`w-full bg-gray-100 px-4 py-2.5 rounded-sm text-sm outline-none focus:ring-1 focus:ring-orange-500 transition ${errors.ukuran ? "border border-red-500" : "border-none"}`}
                    >
                      <option value="">Pilih</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                      <option value="L">L</option>
                      <option value="M">M</option>
                    </select>
                    {errors.ukuran && (
                      <p className="text-[10px] text-red-500 mt-1 font-bold">
                        {errors.ukuran.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Select Kategori */}
                <div>
                  <label className="block mb-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Kategori
                  </label>
                  <select
                    {...register("kategori", { required: "Pilih kategori" })}
                    className={`w-full bg-gray-100 px-4 py-2.5 rounded-sm text-sm outline-none focus:ring-1 focus:ring-orange-500 transition ${errors.kategori ? "border border-red-500" : "border-none"}`}
                  >
                    <option value="">Pilih Kategori</option>
                    {dataKategori?.map(
                      (kat: {
                        id: string;
                        slug: string;
                        namaKategori: string;
                      }) => (
                        <option key={kat.id} value={kat.slug}>
                          {kat.namaKategori}
                        </option>
                      ),
                    )}
                  </select>
                  {errors.kategori && (
                    <p className="text-[10px] text-red-500 mt-1 font-bold">
                      {errors.kategori.message}
                    </p>
                  )}
                </div>

                {/* Toggle Urgent */}
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-sm border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">
                    Status Prioritas
                  </span>
                  <button
                    type="button"
                    onClick={() => setValue("isUrgent", !isUrgent)}
                    className={`text-[10px] font-black px-4 py-1.5 rounded-sm transition-all tracking-widest ${
                      isUrgent
                        ? "bg-red-600 text-white shadow-lg shadow-red-200"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {isUrgent ? "URGENT" : "NORMAL"}
                  </button>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setOpen(false);
                    reset();
                  }}
                  type="button"
                  className="flex-1 bg-gray-200 text-gray-800 text-xs py-3 rounded-sm font-bold hover:scale-[1.02] active:scale-95 transition"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  disabled={mutationPost.isPending}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs py-3 rounded-sm font-bold hover:scale-[1.02] active:scale-95 transition disabled:opacity-50"
                >
                  {mutationPost.isPending ? "MENGIRIM..." : "KIRIM PERMINTAAN"}
                </button>
              </div>
            </form>
          </div>
          <div
            className="absolute inset-0 -z-10"
            onClick={() => setOpen(false)}
          />
        </div>
      )}

      {/* ================= MODAL TRACKING ================= */}
      {selectedId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl shadow-xl rounded-sm p-6 relative flex flex-col max-h-[85vh]">
            {/* HEADER */}

            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-800 tracking-tight">
                Tracking Detail
              </h3>
              <p className="text-xs text-gray-400">
                Riwayat pergerakan dan status barang.
              </p>
            </div>

            {isTrackingLoading ? (
              <div className="py-20 text-center">
                <div className="animate-spin inline-block w-5 h-5 border-[2px] border-current border-t-transparent text-orange-500 rounded-full mb-2"></div>
                <p className="text-xs text-gray-400">Memuat data...</p>
              </div>
            ) : tracking ? (
              <>
                {/* INFO PRODUK */}
                <ul className="text-sm text-gray-600 space-y-2.5 mb-6 border-t pt-4">
                  {tracking.isUrgent && (
                    <li className="flex justify-between">
                      <span className="text-red-500 font-bold">URGENT</span>
                    </li>
                  )}
                  <li className="flex justify-between">
                    <span className="text-gray-400">Produk</span>
                    <span className="text-gray-800 font-medium">
                      {tracking.namaBarang} ({tracking.ukuran})
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Jumlah Minta</span>
                    <span className="text-gray-800 font-medium">
                      {tracking.jumlahMinta} pcs
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Status Saat Ini</span>
                    <span className="text-orange-600 font-bold text-[10px] uppercase bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
                      {tracking.logPermintaan[
                        tracking.logPermintaan.length - 1
                      ]?.status.replace(/_/g, " ")}
                    </span>
                  </li>
                </ul>

                {/* TIMELINE LOG */}
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-3 tracking-widest">
                  Riwayat Aktivitas
                </p>

                {/* Scroll Area dengan style scrollbar minimalis */}
                <div className="space-y-4 overflow-y-auto pr-2 flex-1 scrollbar-minimal">
                  {Array.isArray(tracking?.logPermintaan) &&
                  tracking.logPermintaan.length > 0 ? (
                    [...tracking.logPermintaan].reverse().map((log, idx) => (
                      <div
                        key={idx}
                        className="relative pl-3 border-l-4 border-gray-100 border py-2 pr-2 border-l-amber-500"
                      >
                        {/* Dot Indicator */}
                        {/* <div className="absolute -left-[4.5px] top-1 w-2 h-2 rounded-full bg-gray-300 border border-white"></div> */}

                        <div className="flex justify-between items-baseline mb-1">
                          <p className="text-[10px] text-gray-400 font-medium">
                            {log.tanggal}
                          </p>
                          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tight ">
                            {log.status?.replace(/_/g, " ")}
                          </span>
                        </div>
                        <p className="text-[13px] text-gray-600 leading-relaxed">
                          {log.keterangan}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 bg-gray-50 rounded border border-dashed border-gray-200">
                      <p className="text-xs text-gray-400">
                        Belum ada riwayat.
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="py-20 text-center text-xs text-red-500">
                Data tidak ditemukan
              </div>
            )}

            {/* ACTION BUTTON */}
            <div className="mt-6 pt-2 border-t border-gray-50">
              <button
                onClick={() => setSelectedId(null)}
                className="w-full bg-gray-100 text-gray-600 py-2.5 rounded-sm font-bold text-xs hover:bg-gray-200 transition-colors"
              >
                TUTUP
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
