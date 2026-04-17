"use client";

import { useState } from "react";
import { useGetStock } from "@/services/stok-potong/useGetStock";
import { useGetPenjahit } from "@/services/stok-potong/useGetPenjahit";
import { usePutStock } from "@/services/stok-potong/usePutStock";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function Stock() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useGetStock();
  const { data: penjahitList } = useGetPenjahit();
  const { mutate, isPending } = usePutStock();

  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [namaPenjahit, setNamaPenjahit] = useState("");

  const handleClose = () => {
    setSelectedStock(null);
    setNamaPenjahit("");
  };

  const handleSubmit = () => {
    console.log(selectedStock, namaPenjahit);

    // return;
    if (!selectedStock) return;

    if (!namaPenjahit) {
      console.error("❌ Penjahit belum dipilih");
      return;
    }

    const id = selectedStock?.idStokPotong;

    if (!id) {
      console.error("❌ ID TIDAK ADA");
      return;
    }

    console.log("🚀 KIRIM:", id, namaPenjahit);

    mutate(
      {
        id,
        penjahitId: namaPenjahit,
      },
      {
        onSuccess: () => {
          console.log("✅ BERHASIL KIRIM");
          toast.success("Berhasil dikirim menunggu kurir");

          queryClient.invalidateQueries({
            queryKey: ["stok-potong-stock"],
          });

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
      {/* ================= LIST ================= */}
      <div className="flex flex-col gap-3 overflow-y-auto">
        {isLoading ? (
          <p className="text-center py-4">Loading...</p>
        ) : data && data.length > 0 ? (
          data.map((item) => {
            const isLocked = item.status !== "SELESAI";

            return (
              <div
                key={item.idStokPotong}
                onClick={() => {
                  if (!isLocked) setSelectedStock(item);
                }}
                className={`border rounded-sm p-3
                  ${
                    isLocked
                      ? "bg-gray-200 cursor-not-allowed opacity-60"
                      : "border-gray-300 cursor-pointer hover:bg-gray-50"
                  }
                `}
              >
                {/* HEADER */}
                {item.isUrgent && (
                  <p className="text-xs text-red-500 font-semibold mb-2">
                    URGENT
                  </p>
                )}
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {item.namaBarang} - {item.ukuran}
                    </p>

                    {/* <p className="text-[10px] text-gray-400">
                      ID: {item.idStokPotong}
                    </p> */}
                  </div>

                  <p className="text-lg font-bold text-gray-900">
                    {item.jumlahLolos}
                  </p>
                </div>

                {/* STATUS */}
                <p
                  className={`text-[10px] font-semibold
                    ${
                      item.status === "STOK"
                        ? "text-blue-600"
                        : item.status === "MENUNGGU_KURIR"
                          ? "text-yellow-600"
                          : "text-green-600"
                    }
                  `}
                >
                  {item.status}
                </p>

                {/* LABEL */}
                {isLocked && (
                  <p className="text-[10px] text-red-500">
                    Potongan sudah dikirim
                  </p>
                )}

                {/* DETAIL */}
                <ul className="text-xs text-gray-700 space-y-1 mt-1">
                  <li>• Kode: {item.kodeStokPotongan}</li>
                  <li>
                    • Masuk:{" "}
                    {new Date(item.tanggalMasukPotong).toLocaleDateString(
                      "id-ID",
                    )}
                  </li>
                </ul>
              </div>
            );
          })
        ) : (
          <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-500 font-medium">Data Kosong</p>
          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {selectedStock && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          onClick={handleClose}
        >
          <div
            className="bg-white p-4 w-full max-w-sm shadow-xl rounded-md"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const isLocked = selectedStock?.status !== "SELESAI";

              return (
                <>
                  {/* HEADER */}
                  {selectedStock.isUrgent && (
                    <p className="text-xs text-red-500 font-semibold mb-2">
                      URGENT
                    </p>
                  )}
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-medium text-gray-800">
                      {selectedStock?.namaBarang} - {selectedStock?.ukuran}
                    </p>

                    <p className="text-lg font-bold text-gray-900">
                      {selectedStock?.jumlahLolos}
                    </p>
                  </div>

                  {/* STATUS */}
                  <p className="text-xs text-gray-500 mb-2">
                    Status: {selectedStock?.status}
                  </p>

                  {/* INFO */}
                  <div className="text-xs text-gray-700 space-y-2 mb-4">
                    <p>Kode: {selectedStock?.kodeStokPotongan}</p>
                    <p>
                      Masuk:{" "}
                      {selectedStock?.tanggalMasukPotong &&
                        new Date(
                          selectedStock.tanggalMasukPotong,
                        ).toLocaleDateString("id-ID")}
                    </p>
                  </div>

                  {/* INPUT */}
                  <div className="mb-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">
                      Pilih Penjahit
                    </label>
                    <select
                      value={namaPenjahit}
                      onChange={(e) => setNamaPenjahit(e.target.value)}
                      className="w-full bg-gray-100 px-3 py-2 rounded text-xs outline-none mt-1 appearance-none"
                    >
                      <option value="" disabled>
                        Pilih Nama Penerima
                      </option>
                      {penjahitList?.map((item: any) => (
                        <option key={item.id} value={item.id}>
                          {item.nama}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* BUTTON */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleSubmit}
                      disabled={!namaPenjahit || isPending || isLocked}
                      className={`text-xs px-4 py-1.5 rounded-sm transition text-white
                        ${
                          !namaPenjahit || isLocked
                            ? "bg-orange-300 text-orange-500 cursor-not-allowed"
                            : "bg-orange-500 hover:bg-orange-700 active:scale-95"
                        }
                      `}
                    >
                      {!namaPenjahit || isLocked
                        ? "Tidak bisa kirim"
                        : isPending
                          ? "Mengirim..."
                          : "Kirim"}
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </>
  );
}
