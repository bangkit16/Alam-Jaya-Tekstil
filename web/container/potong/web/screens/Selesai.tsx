"use client";

import { useState } from "react";
import { Package } from "lucide-react";

import { useGetSelesai } from "@/services/potong/useGetPermintaanSelesai";
import Pagination from "@/components/Pagination";
import useDebounce from "@/hooks/useDebounce";

export default function Selesai() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 500);

  const { data: response, isLoading } = useGetSelesai(page , debouncedSearch);

  const data = response?.data || [];
  const meta = response?.meta;

  return (
    <div className="flex flex-col h-full">
      {/* SUMMARY */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-white/70 p-4 rounded-2xl shadow text-center">
          <p className="text-xs text-gray-500">Menunggu</p>
          <p className="text-2xl font-bold text-yellow-500">0</p>
        </div>

        <div className="bg-white/70 p-4 rounded-2xl shadow text-center">
          <p className="text-xs text-gray-500">Proses</p>
          <p className="text-2xl font-bold text-blue-500">0</p>
        </div>

        <div className="bg-white/70 p-4 rounded-2xl shadow text-center">
          <p className="text-xs text-gray-500">Selesai</p>
          <p className="text-2xl font-bold text-green-500">
            {meta?.totalData || 0}
          </p>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-md border border-white/40 flex flex-col flex-1 min-h-0">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
          <h3 className="font-semibold capitalize text-lg">Data Selesai</h3>

          <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
            {meta?.totalData || 0} item
          </span>
        </div>

        <input
          placeholder="Search nama / ukuran / kode kain..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full md:w-72 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 mb-4"
        />

        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <div className="bg-orange-100 text-orange-500 p-4 rounded-full mb-4">
              <Package size={30} />
            </div>

            <p className="font-semibold text-gray-500 mb-1">
              Belum ada data selesai
            </p>

            <p className="text-xs text-gray-400">Data akan muncul di sini</p>
          </div>
        ) : (
          <div className="space-y-3 overflow-y-auto pe-5 flex-1 min-h-0">
            {data.map((item: any) => (
              <div
                key={item.idPermintaan}
                className="group bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-800">
                    {item.namaBarang} - {item.ukuran}
                  </p>

                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                    Selesai
                  </span>
                </div>

                <div className="h-px bg-gray-200 mb-3" />

                <div className="text-xs text-gray-600 space-y-1">
                  <p>Nama Produk : {item.namaBarang}</p>
                  <p>Ukuran : {item.ukuran}</p>
                  <p>Kode Kain : {item.kodeKain || "-"}</p>

                  <p>
                    Pemotong :{" "}
                    {Array.isArray(item.pemotong)
                      ? item.pemotong.join(", ")
                      : item.pemotong || "-"}
                  </p>

                  <p>Jumlah Diminta : {item.jumlahMinta}</p>
                  <p>Jumlah Hasil : {item.jumlahHasil}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {meta && meta.totalPages > 1 && (
          <Pagination meta={meta} onPageChange={setPage} />
        )}
      </div>
    </div>
  );
}
