"use client";

import { useState } from "react";
import { ClipboardList } from "lucide-react";

import {
  KurirMenunggu,
  useGetKurirMenunggu,
} from "@/services/kurir/useGetKurirMenunggu";
import { useGetListKurir } from "@/services/kurir/useGetListKurir";
import { usePutAmbilJob } from "@/services/kurir/usePutAmbilJob";
import Pagination from "@/components/Pagination";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { toast } from "sonner";

export default function Menunggu() {
  const [page, setPage] = useState(1);

  const { data: dataMenunggu, isLoading } = useGetKurirMenunggu(page);
  const { data: listKurir } = useGetListKurir();
  const mutation = usePutAmbilJob();

  const [selected, setSelected] = useState<any>(null);
  const [kurirId, setKurirId] = useState("");

  const count = dataMenunggu?.data.length || 0;

  const data = dataMenunggu?.data || [];
  const meta = dataMenunggu?.meta;

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      {/* CARD UTAMA */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-base font-semibold text-gray-800">
            Data Menunggu
          </h2>

          <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600">
            {count} item
          </span>
        </div>

        {/* CONTENT */}
        {count === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <div className="bg-yellow-100 text-yellow-500 p-4 rounded-full mb-4">
              <ClipboardList size={28} />
            </div>

            <p className="font-medium text-gray-500 mb-1">
              Belum ada data menunggu
            </p>

            <p className="text-xs text-gray-400">Data akan muncul di sini</p>
          </div>
        ) : (
          <div className="space-y-3">
            {(data || []).map((item: KurirMenunggu) => (
              <div
                key={item.idProsesStokPotong}
                className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:bg-gray-50 transition"
              >
                {/* HEADER ITEM */}
                {item.isUrgent && (
                  <span className="text-sm text-red-500  font-bold">
                    URGENT
                  </span>
                )}
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-semibold text-gray-800">
                    {item.namaBarang} - {item.ukuran}
                  </p>

                  <span className="text-sm bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full font-medium">
                    {item.jumlahLolos}
                  </span>
                </div>

                {/* DIVIDER */}
                <div className="h-px bg-gray-200 mb-2" />

                {/* DETAIL */}
                <div className="flex justify-between">
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>
                      Dikirim Dari :{" "}
                      <span className="text-gray-700 font-bold">
                        {item.dikirimDari}
                      </span>
                    </p>
                    <p>
                      Dikirim Ke :{" "}
                      <span className="text-gray-700 font-bold">
                        {item.dikirimKe}
                      </span>
                    </p>
                    <p>
                      Kode Stok Potongan :{" "}
                      <span className="text-gray-700 font-bold">
                        {item.kodeStokPotongan}
                      </span>
                    </p>
                  </div>

                  {/* BUTTON */}
                  <div className="text-right mt-auto">
                    <button
                      disabled={mutation.isPending}
                      onClick={() => setSelected(item)}
                      className=" mt-auto disabled:bg-orange-300 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 py-1.5 text-xs rounded-lg font-semibold hover:scale-105 active:scale-95 transition"
                    >
                      Ambil
                    </button>
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
            {/* HEADER */}
            <div className="mb-4">
              <p className="text-sm text-gray-500">{selected.namaBarang}</p>
              <h2 className="text-lg font-bold text-gray-800">Ambil Job</h2>
            </div>

            <div className="h-px bg-gray-200 mb-4" />

            {/* FORM */}
            <select
              value={kurirId}
              onChange={(e) => setKurirId(e.target.value)}
              className="w-full bg-gray-100 px-3 py-2 rounded-xl text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="">Pilih Kurir</option>
              {listKurir?.map((k: any) => (
                <option key={k.id} value={k.id}>
                  {k.nama}
                </option>
              ))}
            </select>

            {/* BUTTON */}
            <button
              onClick={() => {
                if (!kurirId) return;

                mutation.mutate(
                  {
                    idProsesStokPotong: selected.idProsesStokPotong,
                    idKurir: kurirId,
                  },
                  {
                    onSuccess: (data) => {
                      toast.success(data.message);
                      setSelected(null);
                      setKurirId("");
                    },
                  },
                );
              }}
              disabled={!kurirId || mutation.isPending}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2.5 rounded-xl font-semibold disabled:opacity-50"
            >
              {mutation.isPending ? "Mengambil Job..." : "Ambil Job"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
