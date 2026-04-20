"use client";

import { useState } from "react";
import { useGetPermintaanPotong } from "@/services/stok-gudang/useGetPermintaanPotong";
import { usePostMintaPotong } from "@/services/stok-gudang/usePostMintaPotong";
import { useGetTracking } from "@/services/stok-gudang/useGetTracking";
import { useForm } from "react-hook-form";

export default function MintaPotong() {
  const { data = [] } = useGetPermintaanPotong();
  const mutation = usePostMintaPotong();

  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: tracking, isLoading } = useGetTracking(selectedId || "");

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (form: any) => {
    mutation.mutate(form, {
      onSuccess: () => {
        setOpen(false);
        reset();
      },
    });
  };

  return (
    <>
      {/* ================= LIST ================= */}
      <div className="space-y-3">
        {data.map((i: any) => (
          <div
            key={i.idPermintaan}
            className="bg-white p-4 rounded-2xl shadow border cursor-pointer hover:bg-gray-50"
            onClick={() => setSelectedId(i.idPermintaan)}
          >
            {i.isUrgent && (
              <p className="text-xs text-red-500 font-bold mb-1">URGENT</p>
            )}

            <div className="flex justify-between">
              <p className="font-medium">
                {i.namaBarang} - {i.ukuran}
              </p>
              <p className="font-bold">{i.jumlahMinta}</p>
            </div>

            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <p>STATUS : {i.status.replace(/_/g, " ")}</p>

              <button className="bg-gray-200 px-2 py-1 rounded text-xs">
                TRACK
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= BUTTON ================= */}
      <button
        onClick={() => setOpen(true)}
        className="w-full mt-4 bg-orange-500 text-white py-2 rounded-xl"
      >
        MINTA POTONG
      </button>

      {/* ================= MODAL FORM ================= */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-5 rounded-2xl w-[400px]"
          >
            <h3 className="font-semibold mb-3">Minta Potong</h3>

            <input
              {...register("namaBarang")}
              placeholder="Nama Barang"
              className="w-full border p-2 mb-2 rounded"
            />

            <input
              {...register("jumlahMinta")}
              placeholder="Jumlah"
              type="number"
              className="w-full border p-2 mb-2 rounded"
            />

            <div className="flex justify-end gap-2 mt-3">
              <button type="button" onClick={() => setOpen(false)}>
                Batal
              </button>

              <button
                type="submit"
                className="bg-orange-500 text-white px-3 py-1 rounded"
              >
                {mutation.isPending ? "Loading..." : "Kirim"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= MODAL TRACKING ================= */}
      {selectedId && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-5 rounded-2xl w-[420px] max-h-[90vh] overflow-auto">
            <h2 className="font-semibold mb-4">Tracking Detail</h2>

            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <>
                {/* HEADER INFO */}
                <div className="bg-gray-100 p-3 rounded-xl text-sm mb-4">
                  <p>
                    <b>Produk:</b> {tracking?.namaBarang} ({tracking?.ukuran})
                  </p>
                  <p>
                    <b>Jumlah:</b> {tracking?.jumlahMinta}
                  </p>
                  <p>
                    <b>Kategori:</b> {tracking?.kategori}
                  </p>
                  <p>
                    <b>Jenis Permintaan:</b> {tracking?.jenisPermintaan}
                  </p>
                  <p>
                    <b>Status Terakhir:</b>{" "}
                    {tracking?.logPermintaan?.[0]?.status?.replace(/_/g, " ") ||
                      "-"}
                  </p>
                </div>

                {/* TIMELINE */}
                <div className="space-y-3">
                  {tracking?.logPermintaan?.map((log: any, idx: number) => (
                    <div
                      key={idx}
                      className="border-l-4 border-orange-400 bg-gray-50 p-3 rounded-xl"
                    >
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">
                          {new Date(log.createdAt).toLocaleString("id-ID")}
                        </span>

                        <span className="text-orange-500 font-semibold">
                          {log.status.replace(/_/g, " ")}
                        </span>
                      </div>

                      <p className="text-sm text-gray-700">{log.keterangan}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            <button
              onClick={() => setSelectedId(null)}
              className="w-full mt-4 bg-gray-200 py-2 rounded-xl"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
}
