"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { useGetKurirSelesai } from "@/services/kurir/useGetKurirSelesai";
import Pagination from "@/components/Pagination";
import useDebounce from "@/hooks/useDebounce";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function Selesai() {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<any>(null);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const { data: dataSelesai, isLoading } = useGetKurirSelesai(
    page,
    debouncedSearch,
  );

  // 🔥 AMANIN DATA
  const data = dataSelesai?.data || [];
  const meta = dataSelesai?.meta;

  console.log(dataSelesai);

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      {/* CARD UTAMA */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-5">
          <h2 className="text-base font-semibold text-gray-800">
            Data Selesai
          </h2>

          <input
            placeholder="Search nama / tujuan / asal..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            className="w-full md:w-72 bg-gray-100 border border-gray-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600">
            {data.length} item
          </span>
        </div>

        {/* CONTENT */}
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <div className="bg-green-100 text-green-500 p-4 rounded-full mb-4">
              <CheckCircle size={28} />
            </div>

            <p className="font-medium text-gray-500 mb-1">
              {search ? "Data tidak ditemukan" : "Belum ada data selesai"}
            </p>

            <p className="text-xs text-gray-400">
              {search
                ? "Coba kata kunci lain"
                : "Data selesai akan muncul di sini"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.map((item: any, index: number) => (
              <div
                key={item.idProsesStokPotong + index}
                onClick={() => setSelected(item)}
                className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:bg-gray-50 transition cursor-pointer"
              >
                {/* HEADER */}
                <div className="flex justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {item.namaBarang}
                    </p>

                    <p className="text-[10px] text-gray-400 uppercase">
                      {item.status?.replaceAll("_", " ")}
                    </p>
                  </div>

                  <p className="text-lg font-bold">{item.jumlah}</p>
                </div>

                {/* DIVIDER */}
                <div className="h-px bg-gray-200 mb-2" />

                {/* DETAIL */}
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Dari:</span>
                    <span className="font-medium">{item.dikirimDari}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">Tujuan:</span>
                    <span className="font-medium">{item.dikirimKe}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">Selesai:</span>
                    <span>
                      {new Date(item.tanggalSampai).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {meta && meta.totalPages > 1 && (
          <Pagination meta={meta} onPageChange={setPage} />
        )}
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
            <h3 className="font-bold mb-4 text-gray-800">Detail Pengiriman</h3>

            <p className="font-semibold mb-2">{selected.namaBarang}</p>

            <div className="text-sm space-y-2">
              <p>Jumlah: {selected.jumlah} pcs</p>
              <p>Kurir: {selected.namaKurir}</p>

              <hr />

              <p>Dari: {selected.dikirimDari}</p>
              <p>Ke: {selected.dikirimKe}</p>
              <p>
                Waktu:
                {new Date(selected.tanggalSampai).toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
