"use client";

import { useState } from "react";
import { ClipboardList } from "lucide-react";

import { useGetQCProses } from "@/services/qc/useGetQCProses";
import { usePutQCProses } from "@/services/qc/usePutQCProses";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useGetPengecek } from "@/services/qc/useGetPengecek";
import Pagination from "@/components/Pagination";

const schema = (jumlahSelesaiJahit: number) =>
  z
    .object({
      idPengecek: z
        .array(z.string())
        .min(1, "Minimal pilih 1 pengecek")
        .max(2, "Maksimal 2 pengecek"),

      jumlahLolos: z
        .any() // Menghindari konflik awal tipe data
        .refine((val) => val !== "", "Jumlah Lolos wajib diisi")
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val), "Harus berupa angka")
        .refine((val) => val >= 0, "Jumlah tidak boleh negatif"),
      jumlahPermak: z
        .any() // Menghindari konflik awal tipe data
        .refine((val) => val !== "", "Jumlah Permak wajib diisi")
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val), "Harus berupa angka")
        .refine((val) => val >= 0, "Jumlah tidak boleh negatif"),
      jumlahReject: z
        .any() // Menghindari konflik awal tipe data
        .refine((val) => val !== "", "Jumlah Reject wajib diisi")
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val), "Harus berupa angka")
        .refine((val) => val >= 0, "Jumlah tidak boleh negatif"),
      jumlahTurunSize: z
        .any() // Menghindari konflik awal tipe data
        .refine((val) => val !== "", "Jumlah Turun size wajib diisi")
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val), "Harus berupa angka")
        .refine((val) => val >= 0, "Jumlah tidak boleh negatif"),
      jumlahKotor: z
        .any() // Menghindari konflik awal tipe data
        .refine((val) => val !== "", "Jumlah Kotor wajib diisi")
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val), "Harus berupa angka")
        .refine((val) => val >= 0, "Jumlah tidak boleh negatif"),
    })
    .superRefine((data, ctx) => {
      const total =
        data.jumlahLolos +
        data.jumlahPermak +
        data.jumlahReject +
        data.jumlahTurunSize +
        data.jumlahKotor;

      if (total > jumlahSelesaiJahit) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["jumlahLolos"],
          message: `Total melebihi jumlah selesai jahit (${jumlahSelesaiJahit})`,
        });
      }

      if (total < jumlahSelesaiJahit) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["jumlahKotor"],
          message: `Total kurang dari jumlah selesai jahit (${jumlahSelesaiJahit})`,
        });
      }
    });

type FormType = z.infer<ReturnType<typeof schema>>;

export default function Proses() {
  const [page, setPage] = useState(1);

  const { data: dataProses, isLoading } = useGetQCProses(page);
  const { mutate, isPending } = usePutQCProses();
  const { data: dataPengecek = [] } = useGetPengecek();

  const data = dataProses?.data || [];
  const meta = dataProses?.meta;

  const [selected, setSelected] = useState<any>(null);

  const jumlahTarget = selected?.jumlahSelesaiJahit || 0;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(schema(jumlahTarget)),
    defaultValues: {
      idPengecek: [],
      jumlahLolos: 0,
      jumlahPermak: 0,
      jumlahReject: 0,
      jumlahTurunSize: 0,
      jumlahKotor: 0,
    },
  });

  const selectedPengecek = watch("idPengecek");

  const onSubmit = (data: FormType) => {
    if (!selected) return; // !selected
    const idQc = selected?.idQC;
    const payload = {
      idPengecek: data.idPengecek,
      jumlahLolos: data.jumlahLolos,
      jumlahPermak: data.jumlahPermak,
      jumlahReject: data.jumlahReject,
      jumlahTurunSize: data.jumlahTurunSize,
      jumlahKotor: data.jumlahKotor,
    };

    mutate(
      { idQC: idQc, body: payload },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          closeModal();
        },
      },
    );
  };

  const closeModal = () => {
    setSelected(null);
    reset();
  };

  if (isLoading) return <p className="text-center py-4">Loading...</p>;

  return (
    <>
      {/* CARD */}
      <div className="bg-white rounded-2xl p-6 shadow">
        {data.length === 0 ? (
          <Empty />
        ) : (
          <div className="space-y-3">
            {data.map((item: any) => (
              <div
                key={item.idQC}
                onClick={() => setSelected(item)}
                className="border rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition"
              >
                {/* HEADER */}
                {item.isUrgent && (
                  <span className="text-red-500 text-sm font-semibold">
                    URGENT
                  </span>
                )}
                <div className="flex justify-between mb-2">
                  <div>
                    <p className="font-semibold">
                      {item.namaBarang} - {item.ukuran}
                    </p>

                    <p className="text-xs text-gray-500">
                      {item.namaPenjahit} • {item.kodeStokPotongan}
                    </p>
                  </div>

                  <p className="font-bold text-lg text-orange-500">
                    {item.jumlahSelesaiJahit}
                  </p>
                </div>

                {/* EXTRA */}
                <div className="text-xs text-gray-500">
                  <p>
                    Mulai QC:{" "}
                    {new Date(item.tanggalMulaiQC).toLocaleString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        {meta && meta.totalPages > 1 && (
          <Pagination meta={meta} onPageChange={setPage} />
        )}
      </div>

      {/* ================= MODAL ================= */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg shadow-xl rounded-sm p-6 relative">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* HEADER */}
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold text-md">
                    {selected.namaBarang} - {selected.ukuran}
                  </p>
                </div>

                <p className="font-bold text-xl text-orange-600">
                  {selected.jumlahSelesaiJahit}
                </p>
              </div>

              {/* INFO */}
              <div className="text-xs text-gray-600 space-y-1 mt-2 border-t pt-3">
                <p>
                  <span className="text-gray-400">Kode Potongan:</span>{" "}
                  {selected.kodeStokPotongan}
                </p>

                <p>
                  <span className="text-gray-400">Penjahit:</span>{" "}
                  {selected.namaPenjahit}
                </p>

                <p>
                  <span className="text-gray-400">Tgl Selesai Jahit:</span>{" "}
                  {new Date(selected.tanggalSelesaiJahit).toLocaleDateString(
                    "id-ID",
                  )}
                </p>
              </div>

              {/* STATUS */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 mt-4 text-xs space-y-2">
                <p className="font-semibold text-gray-700">STATUS QC</p>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="bg-white p-2 rounded border border-gray-100">
                    <p className="text-gray-400 text-[10px]">Mulai QC</p>
                    <p className="font-medium">
                      {new Date(selected.tanggalMulaiQC).toLocaleString(
                        "id-ID",
                      )}
                    </p>
                  </div>

                  <div className="bg-white p-2 rounded border border-gray-100">
                    <p className="text-gray-400 text-[10px]">Prioritas</p>

                    <p
                      className={`font-medium ${
                        selected.isUrgent ? "text-red-500" : "text-green-500"
                      }`}
                    >
                      {selected.isUrgent ? "URGENT" : "NORMAL"}
                    </p>
                  </div>
                </div>
              </div>

              {/* FORM */}
              <div className="mt-4 space-y-3 text-xs">
                {/* DROPDOWN */}
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Pilih Pengecek (Maks 2)
                  </label>

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

                      setValue("idPengecek", [...selectedPengecek, val], {
                        shouldValidate: true,
                      });
                    }}
                    className={`w-full bg-gray-100 rounded-xl px-3 py-2 text-sm outline-none ${
                      errors.idPengecek ? "border border-red-500" : ""
                    }`}
                  >
                    <option value="">Pilih Pengecek</option>

                    {dataPengecek.map((item: any) => (
                      <option key={item.id} value={item.id}>
                        {item.nama}
                      </option>
                    ))}
                  </select>

                  {/* selected list */}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedPengecek.map((id) => {
                      const user = dataPengecek.find((x: any) => x.id === id);

                      return (
                        <div
                          key={id}
                          className="bg-orange-100 text-orange-700 px-2 py-1 rounded-lg flex items-center gap-2"
                        >
                          <span>{user?.nama}</span>

                          <button
                            type="button"
                            onClick={() =>
                              setValue(
                                "idPengecek",
                                selectedPengecek.filter((item) => item !== id),
                                { shouldValidate: true },
                              )
                            }
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {errors.idPengecek && (
                    <p className="text-red-500 mt-1">
                      {errors.idPengecek.message}
                    </p>
                  )}
                </div>

                {/* INPUT NUMBER */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block mb-1 text-gray-600">
                      Jumlah Lolos
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      className={`w-full border rounded-xl p-2 ${errors.jumlahLolos ? "border-red-500" : ""}`}
                      {...register("jumlahLolos")}
                    />
                    {errors.jumlahLolos && (
                      <p className="text-red-500 mt-1">
                        {errors.jumlahLolos.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-1 text-gray-600">
                      Jumlah Permak
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      className={`w-full border rounded-xl p-2 ${errors.jumlahPermak ? "border-red-500" : ""}`}
                      {...register("jumlahPermak")}
                    />
                    {errors.jumlahPermak && (
                      <p className="text-red-500 mt-1">
                        {errors.jumlahPermak.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-1 text-gray-600">
                      Jumlah Reject
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      className={`w-full border rounded-xl p-2 ${errors.jumlahReject ? "border-red-500" : ""}`}
                      {...register("jumlahReject")}
                    />
                    {errors.jumlahReject && (
                      <p className="text-red-500 mt-1">
                        {errors.jumlahReject.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-1 text-gray-600">
                      Jumlah Turun Size
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      className={`w-full border rounded-xl p-2 ${errors.jumlahTurunSize ? "border-red-500" : ""}`}
                      {...register("jumlahTurunSize")}
                    />
                    {errors.jumlahTurunSize && (
                      <p className="text-red-500 mt-1">
                        {errors.jumlahTurunSize.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-1 text-gray-600">
                      Jumlah Kotor
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      className={`w-full border rounded-xl p-2 ${errors.jumlahKotor ? "border-red-500" : ""}`}
                      {...register("jumlahKotor")}
                    />
                    {errors.jumlahKotor && (
                      <p className="text-red-500 mt-1">
                        {errors.jumlahKotor.message}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  Total:
                  {Number(watch("jumlahLolos") || 0) +
                    Number(watch("jumlahPermak") || 0) +
                    Number(watch("jumlahReject") || 0) +
                    Number(watch("jumlahTurunSize") || 0) +
                    Number(watch("jumlahKotor") || 0)}
                  / {selected.jumlahSelesaiJahit}
                </p>
              </div>

              {/* BUTTON */}
              <div className="flex gap-2 mt-5">
                <button
                  type="button"
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 text-xs rounded-xl transition-colors"
                  onClick={closeModal}
                >
                  Tutup
                </button>

                <button
                  disabled={isPending}
                  type="submit"
                  className={`flex-1 bg-orange-500 hover:bg-orange-700 text-white font-medium py-2 text-xs rounded-xl shadow-md transition-colors`}
                >
                  {isPending ? "Sedang menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>

          <div className="absolute inset-0 -z-10" onClick={closeModal} />
        </div>
      )}
    </>
  );
}

function Empty() {
  return (
    <div className="flex flex-col items-center py-16 text-gray-400">
      <div className="bg-blue-100 text-blue-500 p-4 rounded-full mb-3">
        <ClipboardList />
      </div>
      <p className="font-medium">Belum ada data proses</p>
    </div>
  );
}

function Modal({ children, onClose }: any) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
