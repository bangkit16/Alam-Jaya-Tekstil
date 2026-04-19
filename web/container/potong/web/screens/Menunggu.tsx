"use client";

import { useState } from "react";
import { Package } from "lucide-react";
import { toast } from "sonner";

import { useGetPermintaan } from "@/services/potong/useGetPermintaan";
import { usePutPermintaan } from "@/services/potong/usePutPermintaan";

export default function Menunggu() {
  const [selectedMenunggu, setSelectedMenunggu] = useState<string | null>(null);

  const { data: dataPermintaan, isLoading } = useGetPermintaan();
  const { mutate: mutatePermintaan } = usePutPermintaan();

  const data = dataPermintaan?.data || [];

  const handlePermintaan = (item: any) => {
    mutatePermintaan(
      {
        id: item.idPermintaan,
        data: {
          kode_kain: "WEB",
          pemotong: "web",
          pengecek: "web",
        },
      },
      {
        onSuccess: () => {
          toast.success("Berhasil dipindah ke proses");
          setSelectedMenunggu(null);
        },
        onError: () => {
          toast.error("Gagal memproses data");
        },
      },
    );
  };

  return (
    <>
      {/* SUMMARY */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-white/70 p-4 rounded-2xl shadow text-center">
          <p className="text-xs text-gray-500">Menunggu</p>
          <p className="text-2xl font-bold text-yellow-500">{data.length}</p>
        </div>

        <div className="bg-white/70 p-4 rounded-2xl shadow text-center">
          <p className="text-xs text-gray-500">Proses</p>
          <p className="text-2xl font-bold text-blue-500">0</p>
        </div>

        <div className="bg-white/70 p-4 rounded-2xl shadow text-center">
          <p className="text-xs text-gray-500">Selesai</p>
          <p className="text-2xl font-bold text-green-500">0</p>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-md border border-white/40">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
          <h3 className="font-semibold capitalize text-lg">Data Menunggu</h3>

          <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
            {data.length} item
          </span>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <div className="bg-orange-100 text-orange-500 p-4 rounded-full mb-4">
              <Package size={30} />
            </div>

            <p className="font-semibold text-gray-500 mb-1">
              Belum ada data menunggu
            </p>

            <p className="text-xs text-gray-400">Data akan muncul di sini</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.map((item: any) => {
              const isOpen = selectedMenunggu === item.idPermintaan;

              return (
                <div
                  key={item.idPermintaan}
                  onClick={() =>
                    setSelectedMenunggu(isOpen ? null : item.idPermintaan)
                  }
                  className="group bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-orange-500 transition">
                        {item.namaBarang}
                      </p>

                      <div className="flex gap-2 mt-1">
                        <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full">
                          {item.ukuran}
                        </span>

                        <span className="text-[10px] bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full">
                          Menunggu
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-800">
                        {item.jumlahMinta}
                      </p>

                      <p className="text-[10px] text-gray-400">Qty</p>
                    </div>
                  </div>

                  {isOpen && (
                    <>
                      <div className="h-px bg-gray-200 my-3" />

                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Jumlah diminta : {item.jumlahMinta}</p>
                        <p>Kategori : {item.kategori || "Kaos"}</p>
                      </div>

                      <p className="text-center text-gray-400 text-sm mt-3">
                        Lanjut ke proses?
                      </p>

                      <div className="flex gap-3 mt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePermintaan(item);
                          }}
                          className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2 rounded-xl text-sm font-semibold"
                        >
                          PROSES
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMenunggu(null);
                          }}
                          className="flex-1 bg-gray-200 text-gray-600 py-2 rounded-xl text-sm font-semibold"
                        >
                          TIDAK
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
