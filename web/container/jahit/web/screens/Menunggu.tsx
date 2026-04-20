"use client";

import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { useGetPenjahitMenunggu } from "@/services/jahit/useGetPenjahitMenunggu";
import { usePutMulaiJahit } from "@/services/jahit/usePutMulaiJahit";

export default function Menunggu() {
  const { data = [] } = useGetPenjahitMenunggu();
  const mutation = usePutMulaiJahit();

  const [selected, setSelected] = useState<any>(null);

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow">
        {data.length === 0 ? (
          <Empty icon={<ClipboardList />} text="Belum ada data menunggu" />
        ) : (
          data.map((item: any) => (
            <div
              key={item.idProsesStokPotong}
              onClick={() => setSelected(item)}
              className="border p-3 rounded-xl cursor-pointer mb-2"
            >
              {item.namaBarang} - {item.ukuran}
            </div>
          ))
        )}
      </div>

      {selected && (
        <Modal onClose={() => setSelected(null)}>
          <button
            onClick={() => {
              mutation.mutate(selected.idProsesStokPotong);
              setSelected(null);
            }}
            className="bg-orange-500 text-white px-4 py-2 rounded"
          >
            Proses
          </button>
        </Modal>
      )}
    </>
  );
}

function Empty({ icon, text }: any) {
  return (
    <div className="flex flex-col items-center py-16 text-gray-400">
      <div className="bg-gray-100 p-4 rounded-full mb-3">{icon}</div>
      <p className="font-medium text-gray-500">{text}</p>
    </div>
  );
}

function Modal({ children, onClose }: any) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-5 rounded-2xl shadow-xl w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
