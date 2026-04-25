"use client";

import { useState } from "react";
import { useGetPermintaanProduk } from "@/services/stok-resi/useGetPermintaanProduk";
import { usePostPermintaanProduk } from "@/services/stok-resi/usePostPermintaanProduk";
import { useGetTracking } from "@/services/stok-resi/useGetTracking";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function Permintaan() {
  const { data = [], isLoading } = useGetPermintaanProduk();
  const { mutate, isPending } = usePostPermintaanProduk();

  const [showForm, setShowForm] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: tracking } = useGetTracking(selectedId || "");

  const [form, setForm] = useState({
    namaProduk: "",
    jumlah: "",
    ukuran: "",
    kategori: "",
    isUrgent: false,
  });

  const handleSubmit = () => {
    if (!form.namaProduk || !form.jumlah) {
      alert("Lengkapi data");
      return;
    }

    mutate(form, {
      onSuccess: () => {
        setShowForm(false);
        setForm({
          namaProduk: "",
          jumlah: "",
          ukuran: "",
          kategori: "",
          isUrgent: false,
        });
      },
    });
  };

  // ================= POPUP WRAPPER =================
  const Popup = ({ children }: any) => (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="w-full max-w-sm bg-white rounded-2xl p-4 shadow-xl">
        {children}
      </div>
    </div>
  );

  return (
    <>
      {/* ================= LIST VIEW ================= */}
      <div className="space-y-3">
        {/* BUTTON */}
        <button
          onClick={() => {
            setShowForm(true);
            setForm({
              namaProduk: "",
              jumlah: "",
              ukuran: "",
              kategori: "",
              isUrgent: false,
            });
          }}
          className="w-full bg-gray-200 text-xs py-2 rounded font-medium"
        >
          MINTA STOK PRODUK
        </button>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <LoadingSpinner />
            <p className="text-[10px] text-gray-400">Memuat permintaan...</p>
          </div>
        ) : data.length === 0 ? (
          <p className="text-xs text-center text-gray-400">
            Tidak ada permintaan
          </p>
        ) : (
          data.map((item: any) => (
            <div
              key={item.idPermintaan}
              onClick={() => {
                // 🔥 klik card → masuk form (prefill)
                setShowForm(true);
                setForm({
                  namaProduk: item.namaProduk,
                  jumlah: item.jumlah,
                  ukuran: item.ukuran,
                  kategori: item.kategori,
                  isUrgent: item.isUrgent,
                });
              }}
              className="border p-3 rounded-xl bg-gray-50 cursor-pointer"
            >
              {item.isUrgent && (
                <p className="text-[10px] text-red-500 font-semibold mb-1">
                  URGENT
                </p>
              )}

              <div className="flex justify-between">
                <div>
                  <p className="text-xs font-medium">
                    {item.namaProduk} - {item.ukuran}
                  </p>
                  <p className="text-[10px] text-gray-500">{item.kategori}</p>
                </div>

                <p className="text-sm font-bold">{item.jumlah}</p>
              </div>

              {/* STATUS + ACTION */}
              <div
                className="flex justify-between items-center mt-2"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-[10px] text-gray-500">
                  STATUS: {item.status}
                </p>

                <div className="flex gap-1">
                  {/* 🔥 CANCEL */}
                  <button className="text-[10px] px-2 py-1 bg-red-100 text-red-500 rounded">
                    Cancel
                  </button>

                  {/* 🔥 TRACK */}
                  <button
                    onClick={() => setSelectedId(item.idPermintaan)}
                    className="text-[10px] px-2 py-1 bg-gray-200 rounded"
                  >
                    TRACK
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= FORM POPUP ================= */}
      {showForm && (
        <Popup>
          <p className="text-xs font-semibold mb-3">Permintaan</p>

          <div className="space-y-2 text-xs">
            <input
              placeholder="Nama produk"
              value={form.namaProduk}
              onChange={(e) => setForm({ ...form, namaProduk: e.target.value })}
              className="w-full px-2 py-2 rounded border"
            />

            <input
              placeholder="Jumlah"
              type="number"
              value={form.jumlah}
              onChange={(e) => setForm({ ...form, jumlah: e.target.value })}
              className="w-full px-2 py-2 rounded border"
            />

            <input
              placeholder="Ukuran"
              value={form.ukuran}
              onChange={(e) => setForm({ ...form, ukuran: e.target.value })}
              className="w-full px-2 py-2 rounded border"
            />

            <input
              placeholder="Kategori"
              value={form.kategori}
              onChange={(e) => setForm({ ...form, kategori: e.target.value })}
              className="w-full px-2 py-2 rounded border"
            />

            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={form.isUrgent}
                onChange={(e) =>
                  setForm({ ...form, isUrgent: e.target.checked })
                }
              />
              Urgent
            </label>
          </div>

          <button
            onClick={handleSubmit}
            className="mt-3 w-full bg-orange-500 text-white py-2 rounded text-xs"
          >
            {isPending ? "Mengirim..." : "Kirim"}
          </button>

          <button
            onClick={() => setShowForm(false)}
            className="mt-2 w-full text-xs text-gray-500"
          >
            Batal
          </button>
        </Popup>
      )}

      {/* ================= TRACKING POPUP ================= */}
      {selectedId && (
        <Popup>
          {!tracking ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <LoadingSpinner />
              <p className="text-[10px] text-gray-400">Memuat tracking...</p>
            </div>
          ) : (
            <>
              <p className="text-xs font-semibold mb-2">Tracking Permintaan</p>

              {tracking.isUrgent && (
                <p className="text-red-500 text-[10px] mb-2 font-semibold">
                  URGENT
                </p>
              )}

              <div className="text-xs space-y-1 mb-3">
                <p>Nama produk: {tracking.namaBarang}</p>
                <p>Jumlah: {tracking.jumlah}</p>
                <p>Ukuran: {tracking.ukuran}</p>
                <p>Kategori: {tracking.kategori}</p>
              </div>

              <div className="text-[10px] space-y-2 max-h-40 overflow-auto text-gray-600">
                {tracking.logPermintaan?.map((log: any, i: number) => (
                  <div key={i}>
                    <p className="font-medium">{log.tanggal}</p>
                    <p>{log.keterangan}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setSelectedId(null)}
                className="mt-3 w-full text-xs text-gray-500"
              >
                Tutup
              </button>
            </>
          )}
        </Popup>
      )}
    </>
  );
}
