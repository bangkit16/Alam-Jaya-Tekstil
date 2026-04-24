"use client";

import { useState } from "react";
import { useGetPermintaan } from "@/services/stok-gudang/useGetPermintaan";
import { useGetDatabox } from "@/services/stok-gudang/useGetDataBox";
import { useGetPenerimaBox } from "@/services/stok-gudang/useGetPenerimaBox";
import BarcodeGenerator from "@/components/BarcodeGenerator";
import Pagination from "@/components/Pagination";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { toast } from "sonner";
import { usePutMintaPotong } from "@/services/stok-gudang/usePutMintaPotong";
import { usePutPermintaanProduk } from "@/services/stok-gudang/usePutPermintaanProduk";

export default function PermintaanResi() {
  const [page, setPage] = useState(1);
  const { data: dataPermintaanResi, isLoading } = useGetPermintaan(page);
  const { data: dataBox } = useGetDatabox(1, 100);
  const { data: penerima = [] } = useGetPenerimaBox();

  const [selected, setSelected] = useState<any>(null);
  const [selectedBox, setSelectedBox] = useState<string[]>([]);
  const [penanggungJawab, setPenanggungJawab] = useState("");

  const data = dataPermintaanResi?.data || [];
  const meta = dataPermintaanResi?.meta;

  const toggleBox = (id: string) => {
    setSelectedBox((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const mutationMintaPotong = usePutMintaPotong();
  const mutationKirimBox = usePutPermintaanProduk();

  const handleMintaPotong = () => {
    if (!selected) return;

    const yakin = confirm(
      `Apakah anda yakin ingin meminta potongan untuk ${selected.namaBarang}?`,
    );
    if (yakin) {
      mutationMintaPotong.mutate(selected.idPermintaan, {
        onSuccess: (data) => {
          toast.success(data.message);
          setSelected(null); // Tutup modal jika berhasil
        },
      });
    }
  };

  const handleKirimBox = () => {
    if (!selectedBox.length || !penanggungJawab || !selected) return;

    console.log("KIRIM BOX", { selectedBox, penanggungJawab });

    mutationKirimBox.mutate(
      {
        id: selected.idPermintaan,
        payload: {
          idPenanggungJawabBox: penanggungJawab,
          idBox: selectedBox,
        },
      },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          setSelected(null); // Tutup modal jika berhasil
        },
        onError: (error) => {
          toast.error(error.response.data.message);
        },
      },
    );
  };

  // 🔥 HITUNG TOTAL
  const totalDipilih = dataBox?.data
    .filter((box: any) => selectedBox.includes(box.idBox))
    .reduce((total: number, box: any) => {
      const jumlah = box.stokPotongan?.reduce(
        (t: number, item: any) => t + (item.jumlah || 0),
        0,
      );
      return total + jumlah;
    }, 0);

  const kurang = selected && Number(totalDipilih) < selected.jumlahMinta;

  return (
    <>
      {/* ================= LIST ================= */}
      {isLoading && <LoadingSpinner />}
      <div className="grid md:grid-cols-2 gap-4">
        {data.map((item: any) => (
          <div
            key={item.idPermintaan}
            onClick={() => setSelected(item)}
            className="bg-white p-4 rounded-2xl border cursor-pointer shadow-sm hover:bg-gray-50"
          >
            {item.isUrgent && (
              <p className="text-xs text-red-500 font-bold mb-1">URGENT</p>
            )}

            <div className="flex justify-between">
              <p className="font-medium">
                {item.namaBarang} - {item.ukuran}
              </p>

              <p className="font-bold">{item.jumlahMinta}</p>
            </div>

            <div className="text-xs text-gray-500 mt-2">
              <p>Kategori: {item.kategori}</p>
              <p>Permintaan dari: {item.jenisPermintaan}</p>
            </div>
          </div>
        ))}
      </div>
      {meta && meta.totalPages > 1 && (
        <Pagination meta={meta} onPageChange={setPage} />
      )}

      {/* ================= MODAL ================= */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4 animate-in fade-in duration-200"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white w-full max-w-3xl rounded-sm p-6 max-h-[90vh] flex flex-col shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-800 tracking-tight">
                Permintaan: {selected.namaBarang}
              </h3>
              <p className="text-xs text-gray-400">
                Pilih penangung jawab dan box yang akan dikirim.
              </p>
            </div>

            {/* DETAIL PRODUK - Style List Justify Between */}
            <ul className="text-sm text-gray-700 space-y-2 mb-6 border-t pt-4">
              <li className="flex justify-between">
                <span className="text-gray-400">Kategori</span>
                <span className="font-bold uppercase text-[11px]">
                  {selected.kategori}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Ukuran / Jumlah</span>
                <span className="font-bold">
                  {selected.ukuran} / {selected.jumlahMinta} pcs
                </span>
              </li>
            </ul>

            <div className="mb-6">
              <label className="block mb-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Nama Penanggung Jawab
              </label>
              <select
                value={penanggungJawab}
                onChange={(e) => setPenanggungJawab(e.target.value)}
                className="w-full bg-gray-100 rounded-sm px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-orange-500 transition"
              >
                <option value="">Pilih Nama Penanggung Jawab</option>
                {penerima.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.nama}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-[10px] font-bold text-gray-400 uppercase mb-3 tracking-widest">
              Box Tersedia
            </p>
            <div className="overflow-y-auto flex-1 pr-1 scrollbar-minimal scroll-smooth">
              {/* INPUT PENERIMA */}

              {/* LIST BOX */}
              <div className=" mb-4 grid md:grid-cols-2 gap-4">
                {dataBox?.data.map((box: any) => (
                  <div key={box.idBox}>
                    <label className="flex items-center gap-3 cursor-pointer group mb-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-orange-600 rounded-sm cursor-pointer"
                        checked={selectedBox.includes(box.idBox)}
                        onChange={() => toggleBox(box.idBox)}
                      />
                      <span className="text-xs font-bold text-gray-600 group-hover:text-orange-600">
                        PILIH BOX
                      </span>
                    </label>
                    <div
                      className={`border rounded-sm p-4 transition-colors ${
                        selectedBox.includes(box.idBox)
                          ? "border-orange-500 bg-orange-50/30"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <p className="font-bold text-gray-800">{box.namaBox}</p>
                        <span className="font-mono text-[10px] text-gray-400 font-bold">
                          {box.kodeBox}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        {box.stokPotongan?.map((item: any) => (
                          <div
                            key={item.idQC}
                            className="bg-white border border-gray-100 rounded-sm p-3 flex justify-between items-start"
                          >
                            <div className="space-y-1">
                              <p className="text-xs font-bold text-gray-700">
                                {item.namaBarang} ({item.ukuran})
                              </p>
                              <p className="text-[10px] text-gray-400 font-mono uppercase">
                                KODE: {item.kodeStokPotongan}
                              </p>
                            </div>
                            <p className="text-sm font-black text-gray-900">
                              {item.jumlah}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* CHECKBOX & BARCODE */}
                      <div className="flex justify-center items-end border-t border-gray-200/50 pt-3">
                        <div className="flex flex-col justify-center items-center">
                          <BarcodeGenerator value={box.kodeBox} />
                          <p className="text-[10px] text-gray-400 font-mono uppercase mt-1">
                            KODE: {box.kodeBox}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-gray-50">
              <button
                onClick={() => setSelected(null)}
                className="bg-gray-100 text-gray-600 py-3 rounded-sm font-bold text-[10px] uppercase hover:bg-gray-200 transition"
              >
                BATAL
              </button>

              <button
                disabled={!kurang}
                onClick={handleMintaPotong}
                className="bg-gray-800 text-white py-3 rounded-sm font-bold text-[10px] uppercase hover:bg-black transition disabled:opacity-30"
              >
                {mutationMintaPotong.isPending ? "LOADING..." : "MINTA POTONG"}
              </button>

              <button
                disabled={
                  !penanggungJawab || selectedBox.length === 0 || kurang
                }
                onClick={handleKirimBox}
                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-sm font-bold text-[10px] uppercase hover:scale-[1.02] active:scale-95 transition disabled:opacity-50 disabled:scale-100"
              >
                {mutationKirimBox.isPending ? "LOADING..." : "KIRIM BOX"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
