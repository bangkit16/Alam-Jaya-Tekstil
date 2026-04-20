"use client";

import { useState } from "react";
import { useGetDatabox } from "@/services/stok-gudang/useGetDataBox";

export default function DataBox() {
  const { data = [] } = useGetDatabox();
  const [selected, setSelected] = useState<any>(null);

  return (
    <>
      <div className="grid md:grid-cols-2 gap-4">
        {data.map((box: any) => (
          <div
            key={box.idBox}
            onClick={() => setSelected(box)}
            className="bg-white p-4 rounded-xl border cursor-pointer"
          >
            <p className="font-bold">{box.namaBox}</p>
            <p className="text-xs">{box.namaPenerimaBox}</p>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-5 rounded-xl">
            <p>{selected.namaBox}</p>
            <button onClick={() => setSelected(null)}>Tutup</button>
          </div>
        </div>
      )}
    </>
  );
}
