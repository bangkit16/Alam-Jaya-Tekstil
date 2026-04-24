"use client";

import { useState } from "react";
import { useGetPesanan } from "@/services/stok-resi/useGetPesanan";
import { usePutMenungguStok } from "@/services/stok-resi/usePutMenungguStok";
import { usePutKirim } from "@/services/stok-resi/usePutKirim";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function ProsesPesanan() {
  const { data = [], isLoading } = useGetPesanan();
  const { mutate, isPending } = usePutMenungguStok();
  const { mutate: mutateKirim, isPending: isKirimLoading } = usePutKirim();

  const [selected, setSelected] = useState<any>(null);

  // ✅ TAMBAHAN STATE EDIT
  const [editDesign, setEditDesign] = useState<any>(null);

  // ================= HANDLE MENUNGGU =================
  const handleMenunggu = () => {
    if (!selected) return;

    const payload = selected.design.map((d: any) => ({
      idDesign: d.idDesign,
      idProduk: d.produk?.idProduk,
      jumlahProduk: d.jumlah,
    }));

    mutate(
      { id: selected.idPesanan, payload },
      {
        onSuccess: () => {
          alert("Berhasil ubah ke menunggu stok");
          setSelected(null);
        },
        onError: () => alert("Gagal update"),
      },
    );
  };

  // ================= HANDLE KIRIM =================
  const handleKirim = () => {
    if (!selected) return;

    const payload = selected.design.map((d: any) => ({
      idDesign: d.idDesign,
      idProduk: d.produk?.idProduk,
      jumlahProduk: d.jumlah,
    }));

    mutateKirim(
      { id: selected.idPesanan, payload },
      {
        onSuccess: () => {
          alert("Pesanan berhasil dikirim");
          setSelected(null);
        },
        onError: () => alert("Gagal kirim pesanan"),
      },
    );
  };

  // ================= EDIT VIEW (UBAH) =================
  if (editDesign) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-4 text-xs">
          {/* HEADER */}
          <p className="font-semibold mb-2">{selected?.kodeResi}</p>

          <input
            placeholder="Filter"
            className="w-full px-2 py-2 border rounded mb-2"
          />

          <input
            placeholder="Nama Pemroses"
            className="w-full px-2 py-2 border rounded mb-3"
          />

          {/* DESIGN */}
          <div className="flex gap-2 mb-3">
            <div className="w-14 h-14 bg-gray-200 rounded" />
            <div className="text-[10px]">
              <p>jumlah design</p>
              <p className="font-medium">{editDesign.namaDesign}</p>
            </div>
          </div>

          {/* BOX LIST */}
          <div className="space-y-3 max-h-60 overflow-auto">
            {[1, 2].map((_, i) => (
              <div key={i} className="bg-gray-100 p-2 rounded">
                <p className="text-[10px] font-semibold mb-1">
                  BOX - HOODIE GREEN BLACK
                </p>

                {[
                  { nama: "Hoodie Green Navy - L", qty: 20 },
                  { nama: "Hoodie Black - M", qty: 15 },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white p-2 rounded mb-2">
                    <div className="flex justify-between">
                      <p className="text-[10px]">{item.nama}</p>
                      <p className="font-bold">{item.qty}</p>
                    </div>

                    <div className="flex justify-between mt-1">
                      <ul className="text-[9px] text-gray-500">
                        <li>kode Stok Potongan</li>
                        <li>Tgl Masuk Stok</li>
                      </ul>

                      <button className="bg-gray-200 px-2 text-[10px] rounded">
                        -1+
                      </button>
                    </div>
                  </div>
                ))}

                {/* BARCODE */}
                <div className="h-8 bg-[repeating-linear-gradient(90deg,black,black_2px,white_2px,white_4px)]" />
              </div>
            ))}
          </div>

          {/* ACTION */}
          <button className="mt-3 w-full bg-gray-300 py-2 rounded text-xs">
            KIRIM
          </button>

          <button
            onClick={() => setEditDesign(null)}
            className="mt-2 w-full text-xs text-gray-500"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // ================= MODAL =================
  if (selected) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-4 text-xs">
          <div className="mb-3">
            <p className="font-semibold">{selected.kodeResi}</p>
            <p className="text-gray-500">{selected.namaToko}</p>

            {selected.isUrgent && (
              <p className="text-red-500 text-[10px] font-semibold mt-1">
                IS URGENT
              </p>
            )}
          </div>

          <input
            placeholder="Nama Pemroses"
            className="w-full px-2 py-2 border rounded mb-3"
          />

          {/* DESIGN LIST */}
          <div className="space-y-3 max-h-48 overflow-auto">
            {selected.design?.map((d: any) => (
              <div key={d.idDesign} className="flex gap-2 items-start">
                <div className="w-14 h-14 bg-gray-200 rounded" />

                <div className="flex-1">
                  <p className="text-[10px] text-gray-400">jumlah design</p>

                  <p className="text-xs font-medium">{d.namaDesign}</p>

                  <p className="text-[10px] text-gray-500">
                    {d.produk?.namaProduk} - {d.ukuran}
                  </p>
                </div>

                {/* ✅ UBAH BUTTON */}
                <button
                  onClick={() => setEditDesign(d)}
                  className="text-[10px] px-2 py-1 bg-gray-200 rounded"
                >
                  Ubah
                </button>
              </div>
            ))}
          </div>

          {/* ACTION */}
          <div className="flex justify-between mt-4">
            <button
              onClick={handleMenunggu}
              disabled={isPending}
              className="px-3 py-1 bg-gray-200 rounded text-[10px] disabled:opacity-50"
            >
              {isPending ? "Memproses..." : "Menunggu Stok"}
            </button>

            <button
              onClick={handleKirim}
              disabled={isKirimLoading}
              className="px-3 py-1 bg-orange-500 text-white rounded text-[10px] disabled:opacity-50"
            >
              {isKirimLoading ? "Mengirim..." : "KIRIM"}
            </button>
          </div>

          <button
            onClick={() => setSelected(null)}
            className="mt-3 w-full text-gray-500 text-xs"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // ================= LIST =================
  return (
    <div className="space-y-3">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-10 gap-2">
          <LoadingSpinner />
          <p className="text-[10px] text-gray-400">Memuat pesanan...</p>
        </div>
      ) : data.length === 0 ? (
        <p className="text-xs text-center text-gray-400">Tidak ada pesanan</p>
      ) : (
        data.map((item: any) => (
          <div
            key={item.idPesanan}
            className="border p-3 rounded-xl bg-gray-50"
          >
            {item.isUrgent && (
              <p className="text-[10px] text-red-500 font-semibold mb-1">
                URGENT
              </p>
            )}

            <div className="flex justify-between">
              <div>
                <p className="text-xs font-medium">{item.kodeResi}</p>
                <p className="text-[10px] text-gray-500">{item.namaToko}</p>
              </div>

              <p className="text-sm font-bold">{item.totalDesign}</p>
            </div>

            <p className="text-[10px] text-gray-500 mt-2">
              STATUS: {item.status}
            </p>

            <button
              onClick={() => setSelected(item)}
              className="mt-2 text-[10px] px-2 py-1 bg-gray-200 rounded"
            >
              OPEN
            </button>
          </div>
        ))
      )}
    </div>
  );
}
