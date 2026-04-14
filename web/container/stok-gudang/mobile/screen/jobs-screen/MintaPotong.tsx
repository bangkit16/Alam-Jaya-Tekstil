"use client";

import { useState } from "react";
import {
  useGetPermintaanPotong,
  PermintaanPotong,
} from "@/services/stok-gudang/useGetPermintaanPotong";
import {
  LogPermintaan,
  useGetTracking,
} from "@/services/stok-gudang/useGetTracking";

export default function MintaPotong({ search = "" }: any) {
  const [open, setOpen] = useState(false); // modal form
  const [selectedId, setSelectedId] = useState<string | null>(null); // Simpan ID saja untuk trigger API

  const [form, setForm] = useState({
    nama: "",
    jumlah: "",
    ukuran: "",
    kategori: "",
    isUrgent: false,
  });

  // ================= DATA LIST =================
  const { data: permintaanData, isLoading } = useGetPermintaanPotong();

  // ================= DATA TRACKING (Hanya jalan jika selectedId tidak null) =================
  const { data: tracking, isLoading: isTrackingLoading } = useGetTracking(
    selectedId || "",
  );

  const filtered =
    permintaanData?.filter((d) =>
      d.namaBarang.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  if (isLoading)
    return <div className="p-4 text-center text-xs">Memuat data...</div>;

  return (
    <>
      {/* ================= HEADER BUTTON ================= */}
      <div className="mb-3 flex justify-center">
        <button
          onClick={() => setOpen(true)}
          className="bg-gray-300 text-xs px-3 py-1 rounded shadow"
        >
          MINTA POTONG
        </button>
      </div>

      {/* ================= LIST ================= */}
      <div className="flex flex-col gap-2">
        {filtered.map((item) => (
          <div
            key={item.idPermintaan}
            className="bg-white border rounded-xl p-3 shadow-sm"
          >
            {item.isUrgent && (
              <p className="text-[10px] text-red-500 font-bold mb-1">URGENT</p>
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
                onClick={() => setSelectedId(item.idPermintaan)} // Trigger tracking API
                className="bg-gray-300 text-[10px] px-2 py-1 rounded"
              >
                TRACK
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MODAL FORM ================= */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-sm rounded-2xl p-4 shadow-xl">
            <p className="text-sm font-semibold mb-3">Permintaan</p>
            <div className="space-y-2">
              <input
                placeholder="Nama produk"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                className="w-full bg-gray-100 px-3 py-2 rounded text-xs outline-none"
              />
              <input
                placeholder="Jumlah"
                value={form.jumlah}
                onChange={(e) => setForm({ ...form, jumlah: e.target.value })}
                className="w-full bg-gray-100 px-3 py-2 rounded text-xs outline-none"
              />
              <input
                placeholder="Ukuran"
                value={form.ukuran}
                onChange={(e) => setForm({ ...form, ukuran: e.target.value })}
                className="w-full bg-gray-100 px-3 py-2 rounded text-xs outline-none"
              />
              <input
                placeholder="Kategori"
                value={form.kategori}
                onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                className="w-full bg-gray-100 px-3 py-2 rounded text-xs outline-none"
              />
              <button
                onClick={() => setForm({ ...form, isUrgent: !form.isUrgent })}
                className={`text-xs px-3 py-1 rounded ${
                  form.isUrgent ? "bg-red-500 text-white" : "bg-gray-200"
                }`}
              >
                IsUrgent
              </button>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setOpen(false);
                  setForm({
                    nama: "",
                    jumlah: "",
                    ukuran: "",
                    kategori: "",
                    isUrgent: false,
                  });
                }}
                className="bg-gray-200 text-xs px-3 py-1 rounded shadow"
              >
                Kirim
              </button>
            </div>
          </div>
          <div
            className="absolute inset-0 -z-10"
            onClick={() => setOpen(false)}
          />
        </div>
      )}

      {/* ================= MODAL TRACKING DETAIL ================= */}
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
                {/* Debug Console Log diletakkan di sini */}
                {console.log("Data Tracking:", tracking)}

                <div className="bg-gray-100 rounded-xl p-3 text-xs space-y-1">
                  { tracking.isUrgent && <p className="text-red-500 text-sm font-bold">URGENT</p>}
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

                {/* TIMELINE LOG */}
                <div className="mt-3 text-[11px] space-y-2 overflow-y-auto pr-1">
                  {/* Tambahkan pengecekan Array.isArray atau fallback [] */}
                  {Array.isArray(tracking?.logPermintaan) ? (
                    [...tracking.logPermintaan].reverse().map((log, idx) => (
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
          {/* Overlay Click to Close */}
          <div
            className="absolute inset-0 -z-10"
            onClick={() => setSelectedId(null)}
          />
        </div>
      )}
    </>
  );
}
