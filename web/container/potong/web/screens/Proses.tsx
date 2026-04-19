"use client";

import { useState } from "react";
import { Package } from "lucide-react";
import { toast } from "sonner";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useGetProses } from "@/services/potong/useGetProses";
import { usePutProses } from "@/services/potong/usePutProses";
import { useGetPemotong } from "@/services/potong/useGetPemotong";

const schema = z.object({
  kode_potongan: z.string().min(1, "Kode kain wajib diisi"),
  jumlah_lolos: z.string().min(1, "Jumlah hasil wajib diisi"),
});

type FormValues = z.infer<typeof schema>;

export default function Proses() {
  const [selectedProses, setSelectedProses] = useState<any>(null);
  const [pemotongList, setPemotongList] = useState<string[]>([]);

  const { data: dataProses, isLoading } = useGetProses();
  const { data: pemotongData } = useGetPemotong();
  const { mutate: mutateProses } = usePutProses();

  const data = dataProses?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      kode_potongan: "",
      jumlah_lolos: "",
    },
  });

  const openModal = (item: any) => {
    setSelectedProses(item);
    setPemotongList([]);

    reset({
      kode_potongan: item.kodeKain || "",
      jumlah_lolos: "",
    });
  };

  const closeModal = () => {
    setSelectedProses(null);
    setPemotongList([]);
    reset();
  };

  const onSubmit = (values: FormValues) => {
    if (!selectedProses) return;

    if (pemotongList.length === 0) {
      toast.error("Minimal pilih 1 pemotong");
      return;
    }

    if (pemotongList.length > 2) {
      toast.error("Maksimal 2 pemotong");
      return;
    }

    const jumlahHasil = parseInt(values.jumlah_lolos);

    if (isNaN(jumlahHasil) || jumlahHasil <= 0) {
      toast.error("Jumlah tidak valid");
      return;
    }

    if (jumlahHasil > selectedProses.jumlahMinta) {
      toast.error("Tidak boleh melebihi jumlah diminta");
      return;
    }

    mutateProses(
      {
        id: selectedProses.idPermintaan,
        data: {
          kodeKain: values.kode_potongan.trim(),
          jumlahHasil,
          idPemotong: pemotongList,
        },
      },
      {
        onSuccess: () => {
          toast.success("Berhasil dipindah ke selesai");
          closeModal();
        },
        onError: () => {
          toast.error("Gagal memproses data");
        },
      },
    );
  };

  return (
    <>
      {/* SUMMARY */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-white/70 p-4 rounded-2xl shadow text-center">
          <p className="text-xs text-gray-500">Menunggu</p>
          <p className="text-2xl font-bold text-yellow-500">0</p>
        </div>

        <div className="bg-white/70 p-4 rounded-2xl shadow text-center">
          <p className="text-xs text-gray-500">Proses</p>
          <p className="text-2xl font-bold text-blue-500">{data.length}</p>
        </div>

        <div className="bg-white/70 p-4 rounded-2xl shadow text-center">
          <p className="text-xs text-gray-500">Selesai</p>
          <p className="text-2xl font-bold text-green-500">0</p>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-md border border-white/40">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
          <h3 className="font-semibold capitalize text-lg">Data Proses</h3>

          <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
            {data.length} item
          </span>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <div className="bg-orange-100 text-orange-500 p-4 rounded-full mb-4">
              <Package size={30} />
            </div>

            <p className="font-semibold text-gray-500 mb-1">
              Belum ada data proses
            </p>

            <p className="text-xs text-gray-400">Data akan muncul di sini</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.map((item: any) => (
              <div
                key={item.idPermintaan}
                onClick={() => openModal(item)}
                className="group bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                {item.isUrgent && (
                  <span className="inline-block bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse mb-1">
                    URGENT
                  </span>
                )}

                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-gray-800">
                    {item.namaBarang} - {item.ukuran}
                  </p>

                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    Proses
                  </span>
                </div>

                <div className="h-px bg-gray-200 my-2" />

                <div className="text-xs text-gray-500 space-y-1">
                  <p>NAMA PRODUK : {item.namaBarang}</p>
                  <p>UKURAN : {item.ukuran}</p>
                  <p>JUMLAH : {item.jumlahMinta}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedProses && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            onClick={(e) => e.stopPropagation()}
            className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl w-full max-w-sm shadow-2xl space-y-4 border border-white/40"
          >
            <div>
              <p className="text-sm font-semibold">
                {selectedProses.namaBarang} - {selectedProses.ukuran}
              </p>

              <p className="text-xl font-bold">{selectedProses.jumlahMinta}</p>
            </div>

            <div className="h-px bg-gray-200" />

            <div>
              <input
                placeholder="Kode Kain"
                {...register("kode_potongan")}
                className="w-full bg-gray-100 px-3 py-2 rounded-xl text-sm"
              />

              {errors.kode_potongan && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.kode_potongan.message}
                </p>
              )}
            </div>

            <select
              onChange={(e) => {
                const id = e.target.value;

                if (!id) return;

                if (pemotongList.includes(id)) {
                  toast.error("Sudah dipilih");
                  return;
                }

                if (pemotongList.length >= 2) {
                  toast.error("Maksimal 2 pemotong");
                  return;
                }

                setPemotongList([...pemotongList, id]);
                setValue("kode_potongan", selectedProses.kodeKain || "");
              }}
              className="w-full bg-gray-100 px-3 py-2 rounded-xl text-sm"
            >
              <option value="">Pilih Pemotong</option>

              {pemotongData?.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.nama}
                </option>
              ))}
            </select>

            <div className="flex flex-wrap gap-2">
              {pemotongList.map((id) => {
                const nama =
                  pemotongData?.find((p: any) => p.id === id)?.nama || id;

                return (
                  <div
                    key={id}
                    className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs flex items-center gap-2"
                  >
                    {nama}

                    <button
                      type="button"
                      onClick={() =>
                        setPemotongList((prev) =>
                          prev.filter((item) => item !== id),
                        )
                      }
                      className="text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>

            <div>
              <input
                placeholder="Jumlah hasil"
                {...register("jumlah_lolos")}
                className="w-full bg-gray-100 px-3 py-2 rounded-xl text-sm"
              />

              {errors.jumlah_lolos && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.jumlah_lolos.message}
                </p>
              )}
            </div>

            <button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:scale-105 active:scale-95 transition text-white py-2.5 rounded-xl text-sm font-semibold">
              SELESAI
            </button>
          </form>
        </div>
      )}
    </>
  );
}
