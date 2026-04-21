"use client";

import { useState } from "react";
import { Package } from "lucide-react";
import { PenjahitProses, useGetPenjahitProses } from "@/services/jahit/useGetPenjahitProses";
import { usePutJeda } from "@/services/jahit/usePutJeda";
import { usePutDikerjakan } from "@/services/jahit/usePutDikerjakan";
import { usePutSelesaiJahit } from "@/services/jahit/usePutSelesaiJahit";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "sonner";

const schema = z.object({
  jumlahSelesaiJahit: z
    .any() // Menghindari konflik awal tipe data
    .refine((val) => val !== "", "Jumlah Selesai wajib diisi")
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), "Harus berupa angka")
    .refine((val) => val > 0, "Minimal jumlah adalah 1"),
  catatan: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function Proses() {
  const { data = [] } = useGetPenjahitProses();
  const mutasiDikerjakan = usePutDikerjakan();
  const mutasiJeda = usePutJeda();
  const mutasiSelesai = usePutSelesaiJahit();


  const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<FormValues>({
      resolver: zodResolver(schema),
    });


  const handleClose = () => {
    setSelected(null);
    reset();
  };

  const [selected, setSelected] = useState<any>(null);

  // 🔥 FORM
  const [form, setForm] = useState({
    jumlahSelesai: 0,
    catatan: "",
  });

    const onConfirmSelesai = async (data: FormValues) => {
      if (!selected) return;

      await mutasiSelesai.mutate({
        id: selected.idProsesStokPotong,
        jumlahSelesaiJahit: data.jumlahSelesaiJahit,
        catatan: data.catatan,
      } , {
        onSuccess: (data) => {
          toast.success(data.message);
          handleClose();
        },
      });

    };

    const handleUpdateStatus = async (newStatus: "DIKERJAKAN" | "JEDA") => {
      if (!selected) return;

      if (newStatus === "JEDA") {
        await mutasiJeda.mutateAsync(selected.idProsesStokPotong, {
          onSuccess: (data) => {
            toast.success(data.message);
            handleClose()
          },
        });
      } else {
        await mutasiDikerjakan.mutateAsync(selected.idProsesStokPotong , {
          onSuccess: (data) => {
            toast.success(data.message);
            handleClose()
          },
        });
      }

    };


  return (
    <>
      {/* LIST */}
      <div className="bg-white rounded-2xl p-6 shadow">
        {data.length === 0 ? (
          <Empty icon={<Package />} text="Belum ada data proses" />
        ) : (
          <div className="space-y-3">
            {data.map((item: PenjahitProses) => (
              <div
                key={item.idProsesStokPotong}
                onClick={() => {
                  setSelected(item);
                  reset(); // reset form
                }}
                className="border border-gray-200 rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition"
              >
                {/* HEADER */}
                {item.isUrgent && (
                  <p className="text-xs font-bold text-red-500 mb-1">URGENT</p>
                )}
                <div className="flex justify-between mb-2">
                  <p className="text-md font-semibold text-gray-800">
                    {item.namaBarang} - {item.ukuran}
                  </p>

                  <p className="text-lg font-bold">{item.jumlahLolos}</p>
                </div>

                {/* DETAIL */}
                <div className="text-xs text-gray-600 space-y-1">
                  <p>Kode Stok Potongan: {item.kodeStokPotongan}</p>
                  <p>
                    Tanggal Mulai Jahit:{" "}
                    {new Date(item.tanggalMulaiJahit).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "short", // 'long' untuk bulan lengkap, 'short' untuk singkatan
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false, // true untuk AM/PM, false untuk 24 jam
                      },
                    )}
                  </p>

                  <p>
                    Status:{" "}
                    <span
                      className={`font-bold ${
                        item.status === "JEDA"
                          ? "text-orange-500"
                          : "text-blue-500"
                      }`}
                    >
                      {item.status}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          onClick={handleClose}
        >
          <div
            className="bg-white p-6 w-full max-w-md rounded-2xl shadow-xl" // Mengikuti lebar max-w-lg dan padding p-6
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            {selected.isUrgent && (
              <p className="text-md font-bold text-red-600 uppercase mb-1">
                Urgent
              </p>
            )}

            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-lg font-bold text-gray-800">
                  {selected.namaBarang} - {selected.ukuran}
                </p>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {selected.jumlahLolos}
              </p>
            </div>

            {/* DETAIL - Menggunakan style list dari modal kedua */}
            <ul className="text-sm text-gray-700 space-y-2 mb-6 border-t pt-3">
              <li className="flex justify-between">
                <span className="text-gray-400">Kode Stok Potongan</span>
                <span className="font-bold">{selected.kodeStokPotongan}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Tanggal Mulai Jahit</span>
                <span>
                  {new Date(selected.tanggalMulaiJahit).toLocaleString(
                    "id-ID",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    },
                  )}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span
                  className={
                    selected.status === "JEDA"
                      ? "text-orange-600 font-bold"
                      : "text-blue-600 font-bold"
                  }
                >
                  {selected.status}
                </span>
              </li>
            </ul>

            {/* INPUT FORM (Hanya aktif jika status DIKERJAKAN) */}
            {selected.status === "DIKERJAKAN" && (
              <div className="space-y-3 mb-6">
                <div>
                  <input
                    {...register("jumlahSelesaiJahit")}
                    type="number"
                    placeholder="Jumlah selesai"
                    className={`w-full bg-gray-100 px-4 py-2.5 text-sm outline-none rounded-sm ${
                      errors.jumlahSelesaiJahit ? "border border-red-500" : ""
                    }`}
                  />
                  {errors.jumlahSelesaiJahit && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.jumlahSelesaiJahit.message}
                    </p>
                  )}
                </div>
                <input
                  {...register("catatan")}
                  placeholder="Catatan (optional)"
                  className="w-full bg-gray-100 px-4 py-2.5 text-sm outline-none rounded-sm"
                />
              </div>
            )}

            {/* ACTION BUTTONS - Mengikuti style hover/scale dan gradient modal kedua */}
            <div className="flex flex-col gap-3">
              {selected.status === "DIKERJAKAN" ? (
                <>
                  <button
                    onClick={handleSubmit(onConfirmSelesai)}
                    disabled={
                      mutasiSelesai.isPending ||
                      mutasiDikerjakan.isPending ||
                      mutasiJeda.isPending
                    }
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2.5 rounded-sm font-bold hover:scale-[1.02] active:scale-95 transition disabled:opacity-50"
                  >
                    {mutasiSelesai.isPending
                      ? "MENGIRIM..."
                      : "KONFIRMASI SELESAI"}
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateStatus("JEDA")}
                      disabled={
                        mutasiSelesai.isPending ||
                        mutasiDikerjakan.isPending ||
                        mutasiJeda.isPending
                      }
                      className="flex-1 bg-amber-500 text-white text-xs py-2.5 rounded-sm font-bold hover:scale-[1.02] active:scale-95 transition disabled:opacity-50"
                    >
                      {mutasiJeda.isPending ? "..." : "JEDA"}
                    </button>
                    <button
                      onClick={handleClose}
                      className="flex-1 bg-gray-200 text-gray-800 text-xs py-2.5 rounded-sm font-bold hover:scale-[1.02] active:scale-95 transition"
                    >
                      BATAL
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleUpdateStatus("DIKERJAKAN")}
                    disabled={
                      mutasiSelesai.isPending ||
                      mutasiDikerjakan.isPending ||
                      mutasiJeda.isPending
                    }
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2.5 rounded-sm font-bold hover:scale-[1.02] active:scale-95 transition disabled:opacity-50"
                  >
                    {mutasiDikerjakan.isPending
                      ? "MEMPROSES..."
                      : "LANJUT KERJAKAN"}
                  </button>
                  <button
                    onClick={handleClose}
                    className="w-full bg-gray-200 text-gray-800 text-xs py-2.5 rounded-sm font-bold hover:scale-[1.02] active:scale-95 transition"
                  >
                    KEMBALI
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Empty({ icon, text }: any) {
  return (
    <div className="flex flex-col items-center py-16 text-gray-400">
      <div className="bg-gray-100 p-4 rounded-full mb-3">{icon}</div>
      <p className="font-medium text-gray-500">{text}</p>
    </div>
  );
}

