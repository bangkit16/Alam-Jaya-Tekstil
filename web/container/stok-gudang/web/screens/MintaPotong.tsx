"use client";

import { useState } from "react";
import { useGetPermintaanPotong } from "@/services/stok-gudang/useGetPermintaanPotong";
import { usePostMintaPotong } from "@/services/stok-gudang/usePostMintaPotong";
import { useForm } from "react-hook-form";

export default function MintaPotong() {
  const { data = [] } = useGetPermintaanPotong();
  const mutation = usePostMintaPotong();

  const [open, setOpen] = useState(false);
  const { register, handleSubmit } = useForm();

  const onSubmit = (form: any) => {
    mutation.mutate(form);
    setOpen(false);
  };

  return (
    <>
      {data.map((i: any) => (
        <div key={i.idPermintaan} className="bg-white p-3 rounded-xl mb-2">
          {i.namaBarang}
        </div>
      ))}

      <button
        onClick={() => setOpen(true)}
        className="w-full bg-orange-500 text-white py-2 rounded"
      >
        MINTA POTONG
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-5 rounded-xl"
          >
            <input {...register("namaBarang")} placeholder="Nama" />
            <button type="submit">Kirim</button>
          </form>
        </div>
      )}
    </>
  );
}
