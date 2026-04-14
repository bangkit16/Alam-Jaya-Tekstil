"use client";

import { useState } from "react";
import { useGetProses } from "@/services/stok-potong/useGetProses";
import { usePutProses } from "@/services/stok-potong/usePutProses";
import { useGetPengecek } from "@/services/stok-potong/useGetPengecek";

type prosesType = {
  idStokBarang: string;
  idStokPotong: string; // 🔥 WAJIB ADA
  namaBarang: string;
  ukuran: "M" | "L" | "XL" | "XXL";
  jumlahHasil: number;
};

export default function Proses() {
  const { data: pengecekList } = useGetPengecek();
  const { data, isLoading } = useGetProses();
  const { mutate, isPending } = usePutProses();

  const [selectedPermintaan, setSelectedPermintaan] =
    useState<prosesType | null>(null);

  const [form, setForm] = useState({
    pengecek: [] as string[],
    kode_potongan: "",
    jumlah_lolos: "",
    jumlah_reject: "",
    catatan: "",
  });

  const dataProses = data || [];

  const handleClose = () => {
    setSelectedPermintaan(null);
    setForm({
      pengecek: [] as string[],
      kode_potongan: "",
      jumlah_lolos: "",
      jumlah_reject: "",
      catatan: "",
    });
  };

  // 🔥 SUBMIT
  const handleSubmit = () => {
    if (!selectedPermintaan) return;

    const id = selectedPermintaan.idStokPotong;

    if (!id) {
      console.error("❌ ID STOK POTONG TIDAK ADA!");
      return;
    }

    // ✅ VALIDASI FIX
    if (
      form.pengecek.length === 0 ||
      !form.kode_potongan ||
      !form.jumlah_lolos
    ) {
      console.error("❌ FORM BELUM LENGKAP!");
      return;
    }

    const payload = {
      idPengecek: form.pengecek, // ✅ FIX (NO ARRAY DALAM ARRAY)
      kodeStokPotongan: form.kode_potongan,
      jumlahPotonganLolos: Number(form.jumlah_lolos),
      jumlahPotonganReject: Number(form.jumlah_reject || 0),
      catatan: form.catatan,
    };

    console.log("🚀 HIT API:", id, payload);

    mutate(
      { id, payload },
      {
        onSuccess: () => {
          console.log("✅ BERHASIL");
          handleClose();
        },
        onError: (err) => {
          console.error("❌ ERROR:", err);
        },
      },
    );
  };

  return (
    <>
      {/* LIST */}
      <div className="flex flex-col flex-1 overflow-y-auto gap-3">
        {isLoading ? (
          <p className="text-center py-4">Loading...</p>
        ) : dataProses.length > 0 ? (
          dataProses.map((item: prosesType) => (
            <div
              key={item.idStokPotong}
              onClick={() => setSelectedPermintaan(item)}
              className="border border-gray-300 rounded-2xl p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
            >
              <p className="text-sm font-semibold text-gray-800">
                {item.namaBarang} - {item.ukuran}
              </p>

              <p className="text-2xl font-bold text-gray-800">
                {item.jumlahHasil}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-500 font-medium">Data Kosong</p>
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedPermintaan && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          onClick={handleClose}
        >
          <div
            className="bg-white p-4 w-full max-w-sm shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex justify-between mb-3">
              <p className="text-sm font-medium">
                {selectedPermintaan.namaBarang} - {selectedPermintaan.ukuran}
              </p>
              <p className="text-lg font-bold">
                {selectedPermintaan.jumlahHasil}
              </p>
            </div>

            {/* FORM */}
            <div className="space-y-2">
              <select
                multiple
                value={form.pengecek}
                onChange={(e) => {
                  const selected = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value,
                  );

                  setForm({ ...form, pengecek: selected });
                }}
                className="w-full bg-gray-100 px-3 py-2 text-xs"
              >
                {pengecekList?.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nama}
                  </option>
                ))}
              </select>

              <input
                placeholder="Kode Potongan"
                value={form.kode_potongan}
                onChange={(e) =>
                  setForm({ ...form, kode_potongan: e.target.value })
                }
                className="w-full bg-gray-100 px-3 py-2 text-xs"
              />

              <input
                placeholder="Jumlah Lolos"
                value={form.jumlah_lolos}
                onChange={(e) =>
                  setForm({ ...form, jumlah_lolos: e.target.value })
                }
                className="w-full bg-gray-100 px-3 py-2 text-xs"
              />

              <input
                placeholder="Jumlah Reject"
                value={form.jumlah_reject}
                onChange={(e) =>
                  setForm({ ...form, jumlah_reject: e.target.value })
                }
                className="w-full bg-gray-100 px-3 py-2 text-xs"
              />

              <input
                placeholder="Catatan"
                value={form.catatan}
                onChange={(e) => setForm({ ...form, catatan: e.target.value })}
                className="w-full bg-gray-100 px-3 py-2 text-xs"
              />
            </div>

            {/* BUTTON */}
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="bg-gray-200 text-xs px-4 py-1.5 rounded-sm disabled:opacity-50"
              >
                {isPending ? "Menyimpan..." : "Selesai"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
