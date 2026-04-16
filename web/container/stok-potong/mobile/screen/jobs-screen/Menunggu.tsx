"use client";

import { useState } from "react";
import { useGetPermintaanStokPotong } from "@/services/stok-potong/useGetPermintaan";
import { usePutMenunggu } from "@/services/stok-potong/usePutMenunggu";
import { toast } from "sonner";

type stockType = {
  idPermintaan: string;
  idStokBarang: string;
  idStokPotong: string; // 🔥 WAJIB (buat PUT API)
  namaBarang: string;
  ukuran: "M" | "L" | "XL" | "XXL";
  kodeKain: string;
  pemotong: string[];
  jumlahHasil: number;
  tanggalSelesaiPotong: string;
};

export default function MenungguStock() {
  const { data, isLoading, refetch } = useGetPermintaanStokPotong();
  const { mutate, isPending } = usePutMenunggu();

  const [selectedItem, setSelectedItem] = useState<stockType | null>(null);

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID");
  };

  return (
    <>
      {/* ================= LIST ================= */}
      <div className="flex flex-col gap-3 overflow-y-auto">
        {isLoading ? (
          <p className="text-center py-4">Loading...</p>
        ) : data && data.length > 0 ? (
          data.map((item: stockType) => (
            <div
              key={item.idPermintaan}
              onClick={() => setSelectedItem(item)}
              className="bg-white border border-gray-100 rounded-xl px-3 py-3 shadow-sm cursor-pointer hover:bg-gray-50 active:scale-[0.98] transition"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-semibold text-gray-800">
                  {item.namaBarang} - {item.ukuran}
                </p>

                <p className="text-lg font-bold text-gray-900">
                  {item.jumlahHasil}
                </p>
              </div>

              {/* DETAIL */}
              <div className="text-[11px] text-gray-600 space-y-0.5">
                <p>• Kode: {item.kodeKain}</p>
                <p>• Pemotong: {item.pemotong.join(", ")}</p>
                <p>• Selesai: {formatDate(item.tanggalSelesaiPotong)}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-500 font-medium">Data Kosong</p>
          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 "
          onClick={handleCloseModal}
        >
          <div
            className="bg-white p-4 w-full max-w-sm shadow-xl border border-gray-300 rounded-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-medium text-gray-800">
                {selectedItem.namaBarang} - {selectedItem.ukuran}
              </p>

              <p className="text-lg font-bold text-gray-900">
                {selectedItem.jumlahHasil}
              </p>
            </div>

            {/* DIVIDER */}
            <div className="h-px bg-gray-300 mb-3" />

            {/* DETAIL */}
            <ul className="text-xs text-gray-700 space-y-1 mb-6">
              <li>• Kode: {selectedItem.kodeKain}</li>
              <li>• Pemotong: {selectedItem.pemotong.join(", ")}</li>
              <li>
                • Selesai: {formatDate(selectedItem.tanggalSelesaiPotong)}
              </li>
            </ul>

            {/* BUTTON */}
            <div className="flex justify-end">
              <button
                disabled={isPending}
                onClick={() => {
                  if (!selectedItem) return;

                  console.log("SELECTED:", selectedItem);

                  // 🔥 WAJIB: pakai idStokPotong
                  if (!selectedItem.idStokPotong) {
                    console.error("❌ ID STOK POTONG TIDAK ADA!");
                    return;
                  }

                  console.log("🚀 KIRIM ID:", selectedItem.idStokPotong);

                  mutate(selectedItem.idStokPotong, {
                    onSuccess: (data) => {
                      console.log("✅ BERHASIL PINDAH KE PROSES" , data);

                      handleCloseModal();
                      toast.success(data.message);
                      // 🔥 refresh list biar hilang dari menunggu
                      refetch();
                    },
                    onError: (err) => {
                      console.error("❌ Gagal:", err);
                    },
                  });
                }}
                className="bg-orange-500 text-white text-xs px-4 py-1.5 rounded-sm hover:bg-orange-700 active:scale-95 transition disabled:opacity-50"
              >
                {isPending ? "Loading..." : "Cek"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
