"use client";

import { useState } from "react";
import { useGetPermintaan } from "@/services/stok-gudang/useGetPermintaan";
import { useGetDatabox } from "@/services/stok-gudang/useGetDataBox";
import { useGetPenerimaBox } from "@/services/stok-gudang/useGetPenerimaBox";
import BarcodeGenerator from "@/components/BarcodeGenerator";

export default function PermintaanResi() {
  const { data = [] } = useGetPermintaan();
  const { data: dataBox = [] } = useGetDatabox();
  const { data: penerima = [] } = useGetPenerimaBox();

  const [selected, setSelected] = useState<any>(null);
  const [selectedBox, setSelectedBox] = useState<string[]>([]);
  const [penerimaId, setPenerimaId] = useState("");

  const toggleBox = (id: string) => {
    setSelectedBox((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  // 🔥 HITUNG TOTAL
  const totalDipilih = dataBox
    .filter((box: any) => selectedBox.includes(box.idBox))
    .reduce((total: number, box: any) => {
      const jumlah = box.stokPotongan?.reduce(
        (t: number, item: any) => t + (item.jumlah || 0),
        0,
      );
      return total + jumlah;
    }, 0);

  const kurang = selected && totalDipilih < selected.jumlahMinta;

  return (
    <>
      {/* ================= LIST ================= */}
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

      {/* ================= MODAL ================= */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl p-5 max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <h2 className="font-semibold mb-3">
              Permintaan - {selected.namaBarang}
            </h2>

            {/* INPUT PENERIMA */}
            <div className="mb-4">
              <p className="text-xs text-gray-400 mb-1">INPUT PENERIMA</p>

              <select
                value={penerimaId}
                onChange={(e) => setPenerimaId(e.target.value)}
                className="w-full border rounded-xl p-2 text-sm"
              >
                <option value="">Pilih Nama Penerima</option>

                {penerima.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* DETAIL */}
            <div className="text-sm text-gray-600 mb-4">
              <p>Kategori: {selected.kategori}</p>
              <p>Ukuran: {selected.ukuran}</p>
              <p>Jumlah: {selected.jumlahMinta}</p>
            </div>

            {/* LIST BOX */}
            <div className="space-y-4">
              {dataBox.map((box: any) => (
                <div
                  key={box.idBox}
                  className="border rounded-2xl p-3 bg-gray-50"
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold">{box.namaBox}</p>

                    <span className="text-[10px] text-gray-400">
                      {box.kodeBox}
                    </span>
                  </div>

                  <div className="space-y-2 mb-3">
                    {box.stokPotongan?.map((item: any) => (
                      <div
                        key={item.idQC}
                        className="bg-white border rounded-xl p-2"
                      >
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm">
                              {item.namaBarang} ({item.ukuran})
                            </p>

                            <p className="text-xs text-gray-500">
                              Kode: {item.kodeStokPotongan}
                            </p>

                            <p className="text-xs text-gray-400">
                              Selesai QC:{" "}
                              {new Date(
                                item.tanggalSelesaiQC,
                              ).toLocaleDateString("id-ID")}
                            </p>
                          </div>

                          <b>{item.jumlah}</b>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CHECKBOX */}
                  <label className="flex items-center gap-2 text-sm mb-3">
                    <input
                      type="checkbox"
                      checked={selectedBox.includes(box.idBox)}
                      onChange={() => toggleBox(box.idBox)}
                    />
                    Pilih Box
                  </label>

                  {/* BARCODE */}
                  <div className="flex flex-col items-center">
                    <BarcodeGenerator value={box.kodeBox} />
                    <span className="text-[10px] text-gray-400">
                      {box.kodeBox}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* BUTTON */}
            <div className="flex gap-2 mt-5">
              {/* BATAL */}
              <button
                onClick={() => setSelected(null)}
                className="flex-1 bg-gray-200 py-2 rounded-xl"
              >
                Batal
              </button>

              {/* MINTA POTONG */}
              <button
                disabled={!kurang}
                onClick={() => console.log("Minta potong")}
                className="flex-1 bg-gray-400 text-white py-2 rounded-xl disabled:opacity-40"
              >
                MINTA POTONG
              </button>

              {/* KIRIM */}
              <button
                disabled={!penerimaId || selectedBox.length === 0 || kurang}
                className="flex-1 bg-orange-500 text-white py-2 rounded-xl disabled:bg-gray-300"
              >
                KIRIM
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
