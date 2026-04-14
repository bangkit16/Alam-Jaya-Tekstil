"use client";

import { useState } from "react";
import {
  useGetBoxMasuk,
  BoxMasuk as IBoxMasuk,
} from "@/services/stok-gudang/useGetBoxMasuk";
import BarcodeGenerator from "@/components/BarcodeGenerator";
import { useGetPenerimaBox } from "@/services/stok-gudang/useGetPenerimaBox";
import { usePutBoxMasuk } from "@/services/stok-gudang/usePutBoxMasuk";

export default function BoxMasuk({ search = "" }: { search?: string }) {
  const [selected, setSelected] = useState<IBoxMasuk | null>(null);
  const [idPenerimaBox, setIdPenerimaBox] = useState<string>("");

  // ================= DATA FROM HOOK =================
  const { data: boxMasukData, isLoading, isError } = useGetBoxMasuk();
  const { data: dataPenerimaBox } = useGetPenerimaBox();
  const mutation = usePutBoxMasuk();

  // Filter data berdasarkan search prop
  const filtered =
    boxMasukData?.filter(
      (d) =>
        d.namaBox.toLowerCase().includes(search.toLowerCase()) ||
        d.kodeBox.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  if (isLoading)
    return (
      <div className="p-4 text-center text-xs text-gray-500">
        Memuat data box masuk...
      </div>
    );
  if (isError)
    return (
      <div className="p-4 text-center text-xs text-red-500">
        Gagal memuat data.
      </div>
    );

  return (
    <>
      {/* ================= LIST ================= */}
      <div className="flex flex-col gap-3">
        {filtered.map((box) => (
          <div
            key={box.idBox}
            onClick={() => setSelected(box)}
            className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm cursor-pointer hover:border-blue-300 transition-colors"
          >
            {/* TITLE */}
            <p className="text-sm font-bold mb-2">{box.namaBox}</p>

            {/* ITEMS (Preview dari stokPotongan) */}
            <div className="space-y-2">
              {box.stokPotongan.map((item) => (
                <div key={item.idQC} className="border rounded-lg p-2">
                  <div className="flex justify-between">
                    <p className="text-xs font-semibold">
                      {item.namaBarang} - {item.ukuran}
                    </p>
                    <p className="text-sm font-bold">{item.jumlah}</p>
                  </div>

                  <div className="text-[10px] text-gray-500">
                    <p>
                      <span className="font-semibold">
                        Kode Stok Potongan:{" "}
                      </span>{" "}
                      {item.kodeStokPotongan}
                    </p>
                    <p>
                      <span className="font-semibold">Tgl Selesai QC: </span>{" "}
                      {new Date(item.tanggalSelesaiQC).toLocaleDateString(
                        "id-ID",
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* BARCODE REPRESENTATION */}
            <div className="mt-3 h-18   rounded flex flex-col items-center justify-center text-[10px] text-gray-400 font-mono tracking-widest">
              <BarcodeGenerator value={box.kodeBox} />
              {/* Label Teks Kamu */}
              <span className="font-mono text-black text-[10px] mt-1 leading-none">
                {box.kodeBox}
              </span>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-xs">
            Data tidak ditemukan
          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-4 shadow-xl max-h-[90vh] overflow-auto">
            {/* TITLE */}
            <p className="text-sm font-semibold mb-2">{selected.namaBox}</p>

            {/* INFO */}
            <div className="text-xs text-gray-600 mb-2 space-y-1">
              <p>
                <span className="text-gray-400">Penanggung Jawab:</span>{" "}
                {selected.namaPenanggungJawab}
              </p>
              <p>
                <span className="text-gray-400">Tgl Masuk:</span>{" "}
                {new Date(selected.tanggalMasukStok).toLocaleString("id-ID")}
              </p>
            </div>

            {/* INPUT */}
            <div className="mb-3">
              <label className="text-[10px] font-bold text-gray-400 uppercase">
                Input Penerima
              </label>
              <select
                value={idPenerimaBox}
                onChange={(e) => setIdPenerimaBox(e.target.value)}
                className="w-full bg-gray-100 px-3 py-2 rounded text-xs outline-none mt-1 appearance-none"
              >
                <option value="" disabled>
                  Pilih Nama Penerima
                </option>
                {dataPenerimaBox.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* ITEMS DETAIL */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase">
                Detail Isi Box:
              </p>
              {selected.stokPotongan.map((item) => (
                <div
                  key={item.idQC}
                  className="bg-gray-50 rounded-lg p-2 border border-gray-100"
                >
                  <div className="flex justify-between">
                    <p className="text-xs font-medium">{item.namaBarang}</p>
                    <p className="text-sm font-bold">{item.jumlah}</p>
                  </div>

                  <div className="text-[10px] text-gray-500 mt-1">
                    <p>Kode: {item.kodeStokPotongan}</p>
                    <p>Ukuran: {item.ukuran}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* BARCODE LARGE */}
            <div className=" h-auto p-1 my-4 rounded flex flex-col items-center justify-center text-gray-400">
              <BarcodeGenerator value={selected.kodeBox} />

              {/* Label Teks Kamu */}
              <span className="font-mono text-black text-[10px] mt-1 leading-none">
                {selected.kodeBox}
              </span>
            </div>

            {/* BUTTON */}
            <div className="flex justify-between items-center mt-4">
              <button
                disabled={mutation.isPending}
                onClick={() => {
                  if (!idPenerimaBox) return alert("Masukkan nama penerima!");

                  mutation.mutate(
                    {
                      idBox: selected.idBox,
                      payload: {
                        // Asumsi: id penerima didapatkan dari state atau konteks user
                        idPenerimaBox: idPenerimaBox,
                      },
                    },
                    {
                      onSuccess: () => {
                        setSelected(null);
                        setIdPenerimaBox("");
                      },
                    },
                  );
                }}
                className={`${
                  mutation.isPending ? "bg-gray-400" : "bg-blue-600"
                } text-white px-6 py-2 text-xs rounded-lg shadow-md font-semibold`}
              >
                {mutation.isPending ? "MEMPROSES..." : "ACC BOX"}
              </button>
            </div>
          </div>

          {/* CLICK OUTSIDE */}
          <div
            className="absolute inset-0 -z-10"
            onClick={() => setSelected(null)}
          />
        </div>
      )}
    </>
  );
}
