"use client";

import { useState } from "react";
import {
  useGetPermintaan,
  PermintaanBarang,
} from "@/services/stok-gudang/useGetPermintaan"; // Sesuaikan path import

export default function PermintaanResi({ search = "" }: { search?: string }) {
  const [selected, setSelected] = useState<PermintaanBarang | null>(null);
  const [selectedBox, setSelectedBox] = useState<number[]>([]);
  const [penanggungJawab, setPenanggungJawab] = useState("");

  // ================= DATA FROM HOOK =================
  const { data: permintaanData, isLoading, isError } = useGetPermintaan();

  // Handle Loading & Error State
  if (isLoading)
    return <div className="p-4 text-center text-xs">Memuat data...</div>;
  if (isError)
    return (
      <div className="p-4 text-center text-xs text-red-500">
        Gagal memuat data.
      </div>
    );

  // Filter data berdasarkan search prop
  const filtered =
    permintaanData?.filter((d) =>
      d.namaBarang.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  // ================= DUMMY BOX (Tetap dummy sesuai instruksi alur) =================
  const dummyBox = [
    {
      id: 1,
      namaBox: "BOX - HOODIE GREEN BLACK",
      items: [
        { id: 1, nama: "Hoodie Green Navy - L", qty: 20 },
        { id: 2, nama: "Hoodie Black - M", qty: 15 },
      ],
    },
    { id: 2, namaBox: "BOX - HOODIE GREEN BLACK", items: [] },
    { id: 3, namaBox: "BOX - HOODIE GREEN BLACK", items: [] },
  ];

  const toggleBox = (id: number) => {
    setSelectedBox((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
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
            {/* URGENT */}
            {item.isUrgent && (
              <p className="text-[10px] text-red-500 font-bold mb-1">URGENT</p>
            )}

            {/* TITLE */}
            <div className="flex justify-between">
              <p className="text-sm font-medium">
                {item.namaBarang} - {item.ukuran}
              </p>
              <p className="text-lg font-bold">{item.jumlahMinta}</p>
            </div>

            {/* INFO */}
            <div className="text-xs text-gray-500 mt-1">
              <p>Kategori : {item.kategori}</p>
              <p>Permintaan dari : {item.jenisPermintaan}</p>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center text-gray-400 text-xs py-10">
            Data tidak ditemukan
          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-sm rounded-2xl p-4 shadow-xl max-h-[90vh] overflow-auto">
            {/* TITLE */}
            <p className="text-sm font-semibold mb-2">
              Permintaan - {selected.namaBarang} {selected.jumlahMinta}
            </p>

            {/* INPUT */}
            <input
              placeholder="Nama Penanggung jawab box"
              value={penanggungJawab}
              onChange={(e) => setPenanggungJawab(e.target.value)}
              className="w-full bg-gray-100 px-3 py-2 rounded text-xs outline-none mb-3"
            />

            {/* INFO */}
            <div className="text-xs text-gray-600 mb-3">
              <p>{selected.isUrgent ? "Status: URGENT" : ""}</p>
              <p>Kategori: {selected.kategori}</p>
              <p>Permintaan dari: {selected.jenisPermintaan}</p>
            </div>

            {/* LIST BOX */}
            <div className="space-y-2">
              {dummyBox.map((box) => (
                <div key={box.id} className="bg-gray-100 rounded-xl p-2">
                  <div className="flex gap-2">
                    <input
                      type="checkbox"
                      checked={selectedBox.includes(box.id)}
                      onChange={() => toggleBox(box.id)}
                    />

                    <div className="flex-1">
                      <p className="text-xs font-medium">{box.namaBox}</p>

                      {box.items.length > 0 && (
                        <div className="mt-2 bg-white border rounded p-2">
                          {box.items.map((boxItem: any) => (
                            <div key={boxItem.id} className="mb-2">
                              <div className="flex justify-between">
                                <p className="text-xs">{boxItem.nama}</p>
                                <p className="text-sm font-bold">
                                  {boxItem.qty}
                                </p>
                              </div>

                              <div className="text-[10px] text-gray-500">
                                <p>• kode Stok Potongan</p>
                                <p>• Tgl Masuk Stok</p>
                              </div>
                            </div>
                          ))}

                          {/* BARCODE */}
                          <div className="mt-2 h-12 bg-gray-100 border-2 border-dashed rounded flex items-center justify-center text-[10px] text-gray-400">
                            BARCODE
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* BUTTON */}
            <div className="flex justify-between mt-4">
              <button className="bg-gray-300 text-xs px-3 py-1 rounded">
                MINTA POTONG {selected.isUrgent && "(URGENT)"}
              </button>

              <button
                onClick={() => {
                  console.log({
                    selected,
                    selectedBox,
                    penanggungJawab,
                  });

                  setSelected(null);
                  setSelectedBox([]);
                  setPenanggungJawab("");
                }}
                className="bg-blue-600 text-white text-xs px-3 py-1 rounded font-semibold"
              >
                KIRIM
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
