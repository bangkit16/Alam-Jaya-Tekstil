"use client";

import { useState, useEffect, useRef } from "react";
import { Package } from "lucide-react";

import { useGetStock } from "@/services/stok-potong/useGetStock";
import { useGetPenjahit } from "@/services/stok-potong/useGetPenjahit";
import { usePutStock } from "@/services/stok-potong/usePutStock";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import Pagination from "@/components/Pagination";

export default function Stok() {
  const [page, setPage] = useState(1);

  const { data: dataStok, isLoading, isFetching } = useGetStock(page);

  const { data: penjahitList } = useGetPenjahit();
  const { mutate, isPending } = usePutStock();

  const [selected, setSelected] = useState<any>(null);
  const [namaPenjahit, setNamaPenjahit] = useState("");

  // 🔥 SIMPAN DATA SEBELUMNYA
  const prevDataRef = useRef<any[]>([]);
  const prevMetaRef = useRef<any>(null);

  useEffect(() => {
    if (dataStok?.data) {
      prevDataRef.current = dataStok.data;
    }
    if (dataStok?.meta) {
      prevMetaRef.current = dataStok.meta;
    }
  }, [dataStok]);

  // 🔥 PAKAI DATA LAMA SAAT LOADING
  const data = dataStok?.data || prevDataRef.current || [];
  const meta = dataStok?.meta || prevMetaRef.current;

  const count = data?.length || 0;

  const loading = isLoading || isFetching;

  const handleSubmit = () => {
    if (!selected || !namaPenjahit) return;

    mutate(
      {
        id: selected.idStokPotong,
        penjahitId: namaPenjahit,
      },
      {
        onSuccess: () => {
          setSelected(null);
          setNamaPenjahit("");
        },
      },
    );
  };

  return (
    <>
      {/* CARD UTAMA */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col h-full min-h-0">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-base font-semibold text-gray-800">Data Stok</h2>

          <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600">
            {count} item
          </span>
        </div>

        {/* WRAPPER */}
        <div className="relative flex-1 min-h-0">
          {/* EMPTY */}
          {!loading && count === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <div className="bg-green-100 text-green-500 p-4 rounded-full mb-4">
                <Package size={28} />
              </div>
              <p className="font-medium text-gray-500 mb-1">Belum ada stok</p>
              <p className="text-xs text-gray-400">
                Data stok akan muncul di sini
              </p>
            </div>
          )}

          {/* LIST */}
          {count > 0 && (
            <div
              className={`space-y-3 overflow-y-auto h-full pe-2 ${
                loading ? "pointer-events-none" : ""
              }`}
            >
              {data.map((item: any) => {
                const isLocked = item.status !== "SELESAI";

                return (
                  <div
                    key={item.idStokPotong}
                    onClick={() => {
                      if (!isLocked) setSelected(item);
                    }}
                    className={`bg-white border border-gray-100 rounded-xl p-4 shadow-sm transition
              ${
                isLocked
                  ? "opacity-60 cursor-not-allowed"
                  : "cursor-pointer hover:bg-gray-50"
              }`}
                  >
                    {item.isUrgent && (
                      <span className="text-sm text-red-600 font-bold">
                        URGENT
                      </span>
                    )}

                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-semibold text-gray-800">
                        {item.namaBarang} - {item.ukuran}
                      </p>

                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium
                  ${
                    item.status === "STOK"
                      ? "bg-blue-100 text-blue-600"
                      : item.status === "MENUNGGU_KURIR"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-green-100 text-green-600"
                  }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500 space-y-1">
                      <p>Kode : {item.kodeStokPotongan}</p>
                      <p>
                        Masuk :{" "}
                        {item.tanggalMasukPotong &&
                          new Date(item.tanggalMasukPotong).toLocaleDateString(
                            "id-ID",
                          )}
                      </p>
                      <p>Jumlah : {item.jumlahLolos}</p>
                    </div>

                    {isLocked && (
                      <p className="text-xs text-red-500 mt-2">
                        Potongan sudah dikirim
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* 🔥 OVERLAY LOADING */}
          {loading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
              <LoadingSpinner />
            </div>
          )}
        </div>

        {/* PAGINATION */}
        {meta && meta.totalPages > 1 && (
          <Pagination meta={meta} onPageChange={setPage} />
        )}
      </div>

      {/* MODAL */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl w-full max-w-sm shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {selected.isUrgent && (
              <span className="text-sm text-red-600 font-bold">URGENT</span>
            )}
            <p className="font-semibold mb-4 text-gray-800">
              {selected.namaBarang}
            </p>

            <p className="font-semibold mb-2 text-sm text-gray-600">
              Pilih Penjahit
            </p>

            <select
              value={namaPenjahit}
              onChange={(e) => setNamaPenjahit(e.target.value)}
              className="w-full bg-gray-100 px-3 py-2 rounded-xl text-sm mb-4"
            >
              <option value="">Pilih Penjahit</option>
              {penjahitList?.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.nama}
                </option>
              ))}
            </select>

            <button
              onClick={handleSubmit}
              disabled={!namaPenjahit || isPending}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2.5 rounded-xl font-semibold disabled:opacity-50"
            >
              {isPending ? "Loading..." : "Kirim"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
