"use client";

import { useState } from "react";
import { useGetPermintaan } from "@/services/stok-gudang/useGetPermintaan";

export default function PermintaanResi() {
  const { data = [] } = useGetPermintaan();
  const [selected, setSelected] = useState<any>(null);

  return (
    <>
      <div className="grid md:grid-cols-2 gap-4">
        {data.map((item: any) => (
          <div
            key={item.idPermintaan}
            onClick={() => setSelected(item)}
            className="bg-white p-4 rounded-xl border cursor-pointer"
          >
            <p>{item.namaBarang}</p>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-5 rounded-xl">
            <p>{selected.namaBarang}</p>
            <button onClick={() => setSelected(null)}>Tutup</button>
          </div>
        </div>
      )}
    </>
  );
}
