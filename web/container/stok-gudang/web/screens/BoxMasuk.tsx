"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useGetBoxMasuk } from "@/services/stok-gudang/useGetBoxMasuk";

export default function BoxMasuk() {
  const { data = [] } = useGetBoxMasuk();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {data.map((box: any) => {
        const isOpen = open === box.idBox;

        return (
          <div key={box.idBox} className="bg-white p-4 rounded-xl border">
            <p className="font-bold">{box.namaBox}</p>

            <button
              onClick={() => setOpen(isOpen ? null : box.idBox)}
              className="flex justify-between w-full mt-2 text-sm"
            >
              Lihat Isi
              <ChevronDown className={isOpen ? "rotate-180" : ""} />
            </button>

            {isOpen &&
              box.stokPotongan.map((i: any) => (
                <p key={i.idQC} className="text-xs mt-1">
                  {i.namaBarang} ({i.jumlah})
                </p>
              ))}
          </div>
        );
      })}
    </div>
  );
}
