"use client";

import { useState } from "react";
import { useGetStock } from "@/services/stok-potong/useGetStock";
import { useGetPenjahit } from "@/services/stok-potong/useGetPenjahit";
import { usePutStock } from "@/services/stok-potong/usePutStock";
import { useQueryClient } from "@tanstack/react-query";

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
    if (!selectedStock) return;

    if (!namaPenjahit) {
      console.error("❌ Penjahit belum dipilih");
      return;
    }

    const id = String(selectedStock.idStokPotong);

    mutate(
      {
        id,
        penjahitId: namaPenjahit,
      },
      {
        onSuccess: () => {
          console.log("✅ BERHASIL KIRIM");

          // 🔥 REFRESH DATA (WAJIB SAMA KEY)
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
            const isSent = item.status === "SELESAI";

            return (
              <div
                key={item.idStokPotong}
                onClick={() => !isSent && setSelectedStock(item)}
                className={`border rounded-sm p-3
                  ${
                    isSent
                      ? "bg-gray-200 cursor-not-allowed opacity-60"
                      : "border-gray-300 cursor-pointer hover:bg-gray-50"
                  }
                `}
              >
                {/* HEADER */}
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-gray-800">
                    {item.namaBarang} - {item.ukuran}
                  </p>

                  <p className="text-lg font-bold text-gray-900">
                    {item.jumlahLolos}
                  </p>
                </div>

                {/* LABEL */}
                {isSent && (
                  <p className="text-[10px] text-green-600 font-semibold">
                    ✔ Sudah dikirim
                  </p>
                )}

                {/* DETAIL */}
                <ul className="text-xs text-gray-700 space-y-1">
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
            className="bg-white p-4 w-full max-w-sm shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const isAlreadySent = selectedStock?.status === "SELESAI";

              return (
                <>
                  {/* HEADER */}
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-medium text-gray-800">
                      {selectedStock?.namaBarang} - {selectedStock?.ukuran}
                    </p>

                    <p className="text-lg font-bold text-gray-900">
                      {selectedStock?.jumlahLolos}
                    </p>
                  </div>

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
                  <select
                    value={namaPenjahit}
                    onChange={(e) => setNamaPenjahit(e.target.value)}
                    disabled={isAlreadySent}
                    className={`w-full px-3 py-2 text-xs outline-none mb-4
                      ${
                        isAlreadySent
                          ? "bg-gray-200 cursor-not-allowed"
                          : "bg-gray-100"
                      }
                    `}
                  >
                    <option value="">Pilih Penjahit</option>
                    {penjahitList?.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nama}
                      </option>
                    ))}
                  </select>

                  {/* BUTTON */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleSubmit}
                      disabled={!namaPenjahit || isPending || isAlreadySent}
                      className={`text-xs px-4 py-1.5 rounded-sm transition
                        ${
                          !namaPenjahit || isAlreadySent
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gray-200 hover:bg-gray-300 active:scale-95"
                        }
                      `}
                    >
                      {isAlreadySent
                        ? "Sudah dikirim"
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
