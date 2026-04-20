"use client";

import { useState } from "react";
import { Package } from "lucide-react";

import { useGetProses } from "@/services/stok-potong/useGetProses";
import { usePutProses } from "@/services/stok-potong/usePutProses";
import { useGetPengecek } from "@/services/stok-potong/useGetPengecek";

export default function Proses() {
  const { data, isLoading } = useGetProses();
  const { data: pengecekList } = useGetPengecek();
  const { mutate, isPending } = usePutProses();

  const [selected, setSelected] = useState<any>(null);
  const [selectedPengecek, setSelectedPengecek] = useState<string[]>([]);
  const [form, setForm] = useState({
    kode: "",
    lolos: "",
    reject: "",
    catatan: "",
  });

  const count = data?.length || 0;

  if (isLoading) return <p className="text-center py-4">Loading...</p>;

  return (
    <>
      {/* WRAPPER (biar ada jarak dari atas) */}
      <div className="mt-2">
        {/* CARD UTAMA */}
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
              {(data || []).map((item: any) => (
                <div
                  key={item.idStokPotong}
                  onClick={() => setSelected(item)}
                  className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm cursor-pointer hover:bg-gray-50 transition"
                >
                  {/* HEADER ITEM */}
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-semibold text-gray-800">
                      {item.namaBarang} - {item.ukuran}
                    </p>

                    <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">
                      Proses
                    </span>
                  </div>

                  {/* DIVIDER */}
                  <div className="h-px bg-gray-200 mb-2" />

                  {/* DETAIL */}
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Nama Produk : {item.namaBarang}</p>
                    <p>Ukuran : {item.ukuran}</p>
                    <p>Jumlah : {item.jumlahHasil}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl w-full max-w-sm shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                {selected.namaBarang} - {selected.ukuran}
              </p>
              <h2 className="text-lg font-bold text-gray-800">Input Hasil</h2>
            </div>

            <div className="h-px bg-gray-200 mb-4" />

            {/* FORM */}
            <div className="space-y-3">
              <select
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val) return;
                  if (selectedPengecek.includes(val)) return;

                  setSelectedPengecek([...selectedPengecek, val]);
                }}
                className="w-full bg-gray-100 px-3 py-2 rounded-xl text-sm"
              >
                <option value="">Pilih pengecek</option>
                {pengecekList?.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.nama}
                  </option>
                ))}
              </select>

              <input
                placeholder="Kode"
                className="w-full bg-gray-100 px-3 py-2 rounded-xl text-sm"
                onChange={(e) => setForm({ ...form, kode: e.target.value })}
              />

              <input
                type="number"
                placeholder="Lolos"
                className="w-full bg-gray-100 px-3 py-2 rounded-xl text-sm"
                onChange={(e) => setForm({ ...form, lolos: e.target.value })}
              />

              <input
                type="number"
                placeholder="Reject"
                className="w-full bg-gray-100 px-3 py-2 rounded-xl text-sm"
                onChange={(e) => setForm({ ...form, reject: e.target.value })}
              />

              <input
                placeholder="Catatan"
                className="w-full bg-gray-100 px-3 py-2 rounded-xl text-sm"
                onChange={(e) => setForm({ ...form, catatan: e.target.value })}
              />
            </div>

            {/* BUTTON */}
            <button
              onClick={() => {
                mutate({
                  id: selected.idStokPotong,
                  payload: {
                    idPengecek: selectedPengecek,
                    kodeStokPotongan: form.kode,
                    jumlahPotonganLolos: Number(form.lolos),
                    jumlahPotonganReject: Number(form.reject),
                    catatan: form.catatan,
                  },
                });

                setSelected(null);
                setSelectedPengecek([]);
              }}
              className="mt-5 w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2.5 rounded-xl font-semibold hover:scale-[1.02] active:scale-[0.98] transition"
            >
              {isPending ? "Loading..." : "Simpan"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
