"use client";

import { useState } from "react";
import {
  useGetPermintaan,
  PermintaanBarang,
} from "@/services/stok-gudang/useGetPermintaan";
import { useGetDatabox, DataBox } from "@/services/stok-gudang/useGetDataBox";
import { useGetPenanggungJawabBox } from "@/services/stok-gudang/useGetPenanggungJawabBox";
// 1. Import hook mutation
import { usePutMintaPotong } from "@/services/stok-gudang/usePutMintaPotong";

export default function PermintaanResi({ search = "" }: { search?: string }) {
  const [selected, setSelected] = useState<PermintaanBarang | null>(null);
  const [selectedBox, setSelectedBox] = useState<string[]>([]);
  const [penanggungJawab, setPenanggungJawab] = useState("");

  // ================= DATA FROM HOOKS =================
  const { data: permintaanData, isLoading, isError } = useGetPermintaan();
  const { data: databoxData, isLoading: isLoadingBox } = useGetDatabox();
  const {
    data: dataPenanggungJawabBox,
    isLoading: isLoadingPenanggungJawabBox,
  } = useGetPenanggungJawabBox();

  // 2. Inisialisasi mutation
  const mutationMintaPotong = usePutMintaPotong();

  // Handle Loading & Error State
  if (isLoading || isLoadingBox || isLoadingPenanggungJawabBox)
    return <div className="p-4 text-center text-xs">Memuat data...</div>;

  if (isError)
    return (
      <div className="p-4 text-center text-xs text-red-500">
        Gagal memuat data.
      </div>
    );

  const filtered =
    permintaanData?.filter((d) =>
      d.namaBarang.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  const toggleBox = (id: string) => {
    setSelectedBox((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  // 3. Fungsi Handler untuk Minta Potong
  const handleMintaPotong = () => {
    if (!selected) return;

    const yakin = confirm(
      `Apakah anda yakin ingin meminta potongan untuk ${selected.namaBarang}?`,
    );
    if (yakin) {
      mutationMintaPotong.mutate(selected.idPermintaan, {
        onSuccess: () => {
          setSelected(null); // Tutup modal jika berhasil
        },
      });
    }
  };

  return (
    <>
      {/* ================= LIST ================= */}
      <div className="flex flex-col gap-2">
        {filtered.map((item) => (
          <div
            key={item.idPermintaan}
            onClick={() => setSelected(item)}
            className="bg-white border rounded-xl p-3 shadow-sm cursor-pointer hover:border-blue-400 transition-colors"
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
            <div className="text-xs text-gray-500 mt-1">
              <p>Kategori : {item.kategori}</p>
              <p>Permintaan dari : {item.jenisPermintaan}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-sm rounded-2xl p-4 shadow-xl max-h-[90vh] overflow-auto">
            <p className="text-sm font-semibold mb-2">
              Permintaan - {selected.namaBarang}
            </p>

            {/* INPUT PENERIMA */}
            <div className="mb-3">
              <label className="text-[10px] font-bold text-gray-400 uppercase">
                Input Penerima
              </label>
              <select
                value={penanggungJawab}
                onChange={(e) => setPenanggungJawab(e.target.value)}
                className="w-full bg-gray-100 px-3 py-2 rounded text-xs mt-1 outline-none appearance-none"
              >
                <option value="" disabled>
                  Pilih Nama Penerima
                </option>
                {dataPenanggungJawabBox?.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* INFO DETAIL */}
            <div className="text-xs text-gray-600 mb-3 space-y-0.5">
              {selected.isUrgent && (
                <p className="text-red-500 font-bold">URGENT</p>
              )}
              <p>Kategori: {selected.kategori}</p>
              <p>Ukuran: {selected.ukuran}</p>
              <p>Jumlah: {selected.jumlahMinta}</p>
            </div>

            {/* LIST BOX */}
            <div className="space-y-2">
              {databoxData?.map((box: DataBox) => (
                <div key={box.idBox} className="bg-gray-100 rounded-xl p-2">
                  <div className="flex gap-2">
                    <input
                      type="checkbox"
                      checked={selectedBox.includes(box.idBox)}
                      onChange={() => toggleBox(box.idBox)}
                    />

                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="text-xs font-medium">{box.namaBox}</p>

                        <p className="text-[9px] text-gray-400">
                          {box.kodeBox}
                        </p>
                      </div>

                      {/* STOK POTONGAN DI DALAM BOX */}

                      {box.stokPotongan.length > 0 && (
                        <div className="mt-2 bg-white border rounded p-2">
                          {box.stokPotongan.map((stok) => (
                            <div key={stok.idQC} className="mb-2 last:mb-0">
                              <div className="flex justify-between">
                                <p className="text-[10px] font-medium">
                                  {stok.namaBarang} ({stok.ukuran})
                                </p>

                                <p className="text-xs font-bold">
                                  {stok.jumlah}
                                </p>
                              </div>

                              <div className="text-[9px] text-gray-500">
                                <p>• Kode: {stok.kodeStokPotongan}</p>

                                <p>
                                  • Selesai QC:{" "}
                                  {new Date(
                                    stok.tanggalSelesaiQC,
                                  ).toLocaleDateString("id-ID")}
                                </p>
                              </div>
                            </div>
                          ))}

                          {/* BARCODE PLACEHOLDER */}

                          <div className="mt-2 h-8 bg-gray-50 border border-dashed rounded flex items-center justify-center text-[9px] text-gray-400">
                            {box.kodeBox}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {databoxData?.length === 0 && (
                <p className="text-center text-[10px] text-gray-400 py-4">
                  Box tidak tersedia
                </p>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-between mt-4">
              {/* TOMBOL MINTA POTONG (INTEGRASI API) */}
              <button
                disabled={mutationMintaPotong.isPending}
                onClick={handleMintaPotong}
                className="bg-gray-300 text-gray-600 text-xs px-3 py-1 rounded disabled:opacity-50"
              >
                {mutationMintaPotong.isPending
                  ? "MEMPROSES..."
                  : "MINTA POTONG"}
              </button>

              <button
                onClick={() => {
                  console.log("KIRIM BOX", { selectedBox, penanggungJawab });
                  setSelected(null);
                }}
                disabled={selectedBox.length === 0 || !penanggungJawab}
                className={`${
                  selectedBox.length === 0 || !penanggungJawab
                    ? "bg-blue-300"
                    : "bg-blue-600"
                } text-white text-xs px-3 py-1 rounded font-semibold`}
              >
                KIRIM
              </button>
            </div>
          </div>

          <div
            className="absolute inset-0 -z-10"
            onClick={() => setSelected(null)}
          />
        </div>
      )}
    </>
  );
}
