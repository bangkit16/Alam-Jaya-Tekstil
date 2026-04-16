"use client";

import { useGetPenanggungJawabBox } from "@/services/qc/useGetPenanggungJawabBox";
import { useGetQCMasukBox } from "@/services/qc/useGetQCBoxMasuk";
import { usePostPackingBox } from "@/services/qc/usePostPackingBox";
import { useState } from "react";
import { toast } from "sonner";
// Asumsi hook ini mengembalikan { id, nama }

export default function MasukBox({ search = "" }: { search: string }) {
  const [open, setOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [namaBox, setNamaBox] = useState("");
  const [penanggungJawabId, setPenanggungJawabId] = useState("");

  // ================= DATA FROM SERVICE =================
  const { data: boxItems = [], isLoading: loadingItems } = useGetQCMasukBox();
  const { data: listPJ = [], isLoading: loadingPJ } =
    useGetPenanggungJawabBox();
  const { mutate: kirimPacking, isPending } = usePostPackingBox();

  // ================= FILTER LOGIC =================
  const filteredData = boxItems.filter((o) =>
    o.namaBarang.toLowerCase().includes(search.toLowerCase()),
  );

  // ================= HANDLE SELECT =================
  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSubmit = async () => {
    console.log("Submit Packing:", {
      ids: selectedItems,
      namaBox,
      pjId: penanggungJawabId,
    });
    kirimPacking(
      {
        idPenanggungJawabBox: penanggungJawabId,
        namaBox: namaBox,
        idQc: selectedItems, // Array ID yang dipilih
      },
      {
        onSuccess: () => {
          // Reset state jika berhasil
          toast.success(`Berhasil melakukan packing box ${namaBox}`);
          setOpen(false);
          setSelectedItems([]);
          setNamaBox("");
          setPenanggungJawabId("");
        },
      },
    );
  };

  if (loadingItems)
    return <p className="text-center text-xs p-5">Loading data box...</p>;

  return (
    <>
      {/* ================= LIST ================= */}
      <div className="flex flex-col gap-3 h-full">
        <div className="flex flex-col gap-2 flex-1 overflow-auto">
          {filteredData.length === 0 ? (
            <p className="text-center text-gray-400 text-sm mt-10">
              Box kosong
            </p>
          ) : (
            filteredData.map((o) => (
              <div
                key={o.idQC}
                className={`bg-white border rounded-xl p-3 shadow-sm transition-all ${
                  selectedItems.includes(o.idQC)
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200"
                }`}
                onClick={() => toggleItem(o.idQC)}
              >
                <div className="flex justify-between">
                  <p className="text-sm font-medium">{o.namaBarang}</p>
                  <p className="text-lg font-bold">{o.jumlahLolos}</p>
                </div>

                <div className="text-[11px] mt-2 space-y-1 text-gray-500">
                  <p>• Kode Potongan : {o.kodeStokPotongan}</p>
                  <p>• Nama Penjahit : {o.namaPenjahit}</p>
                  <p>
                    • Tanggal Seleai QC :{" "}
                    {new Date(o.tanggalSelesaiQC).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* BUTTON PACKING */}
        <div className="mt-2">
          <button
            disabled={selectedItems.length === 0}
            onClick={() => setOpen(true)}
            className={`w-full py-3 text-xs rounded-xl font-bold shadow transition-all ${
              selectedItems.length > 0
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            PACKING ({selectedItems.length} ITEM)
          </button>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white w-[90%] max-w-sm rounded-2xl p-5 shadow-xl relative">
            <p className="font-bold text-base mb-4">PACKING STOK</p>

            {/* INPUT SECTION */}
            <div className="space-y-3 mb-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 ml-1">
                  PENANGGUNG JAWAB
                </label>
                <select
                  value={penanggungJawabId}
                  onChange={(e) => setPenanggungJawabId(e.target.value)}
                  className="w-full bg-gray-100 px-3 py-2.5 rounded-lg text-xs outline-none border-none appearance-none"
                >
                  <option value="">Pilih Penanggung Jawab</option>
                  {listPJ.map((pj: any) => (
                    <option key={pj.id} value={pj.id}>
                      {pj.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 ml-1">
                  IDENTITAS BOX
                </label>
                <input
                  placeholder="Contoh: BOX-001 / BOX-A"
                  value={namaBox}
                  onChange={(e) => setNamaBox(e.target.value)}
                  className="w-full bg-gray-100 px-3 py-2.5 rounded-lg text-xs outline-none"
                />
              </div>
            </div>

            {/* ITEM SUMMARY */}
            <p className="text-[10px] font-bold text-gray-400 mb-2 ml-1">
              ITEM TERPILIH
            </p>
            <div className="bg-gray-50 rounded-xl p-2 max-h-[150px] overflow-auto border border-gray-100">
              {boxItems
                .filter((item) => selectedItems.includes(item.idQC))
                .map((o) => (
                  <div
                    key={o.idQC}
                    className="flex justify-between p-2 border-b border-gray-100 last:border-0"
                  >
                    <p className="text-[11px]">
                      {o.namaBarang} ({o.ukuran})
                    </p>
                    <p className="text-[11px] font-bold">{o.jumlahLolos}</p>
                  </div>
                ))}
            </div>

            {/* ACTION BUTTON */}
            <div className="flex gap-2 mt-5">
              <button
                className="flex-1 bg-gray-100 py-2.5 text-xs rounded-xl font-medium"
                onClick={() => setOpen(false)}
              >
                Batal
              </button>
              <button
                disabled={!namaBox || !penanggungJawabId || isPending}
                className="flex-1 bg-orange-500 disabled:bg-orange-300 text-white py-2.5 text-xs rounded-xl font-bold shadow-md"
                onClick={handleSubmit}
              >
                {isPending ? "MEMPROSES..." : "KONFIRMASI"}
              </button>
            </div>
          </div>

          <div
            className="absolute inset-0 -z-10"
            onClick={() => setOpen(false)}
          />
        </div>
      )}
    </>
  );
}
