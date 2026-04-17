'use client';

import { useState } from 'react';
import { useGetQCMenunggu } from '@/services/qc/useGetQCMenunggu';
import { usePutMulaiQC } from '@/services/qc/usePutMulaiQC';
import { toast } from 'sonner';

export default function Menunggu({ search = '' }: any) {
  const [selected, setSelected] = useState<any>(null);

  // ================= API =================
  const { data: orders = [], isLoading, isError } = useGetQCMenunggu();

  const { mutate: prosesQC, isPending } = usePutMulaiQC();

  // ================= FILTER =================
  const data = orders.filter((o: any) => `${o.namaBarang} ${o.ukuran}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      {/* ================= LIST ================= */}
      <div className='flex flex-col gap-3'>
        {isLoading ? (
          <p className='text-center text-gray-400 text-sm'>Loading...</p>
        ) : isError ? (
          <p className='text-center text-red-400 text-sm'>Gagal mengambil data</p>
        ) : data.length === 0 ? (
          <p className='text-center text-gray-400 text-sm'>Tidak ada data</p>
        ) : (
          data.map((o: any) => (
            <div
              key={o.idQC}
              onClick={() => setSelected(o)}
              className='bg-white border border-gray-200 rounded-xl p-3 shadow-sm cursor-pointer'
            >
              {o.isUrgent && <p className='text-red-500 font-bold text-sm'>URGENT</p>}
              <div className='flex justify-between'>
                <p className='text-sm font-medium'>
                  {o.namaBarang} - {o.ukuran}
                </p>

                <p className='text-lg font-bold'>{o.jumlahSelesaiJahit}</p>
              </div>

              <div className='text-[11px] space-y-1 text-gray-600'>
                <p>
                  <b> Kode Potongan:</b> {o.kodeStokPotongan}
                </p>
                <p>
                  <b> Nama Penjahit:</b> {o.namaPenjahit}
                </p>
                <p>
                  <b>Tanggal Selesai Jahit: </b>
                  {new Date(o.tanggalSelesaiJahit).toLocaleDateString('id-ID')}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= MODAL ================= */}
      {selected && (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
          {/* BOX */}
          <div className='bg-white w-[90%] max-w-sm rounded-2xl p-4 shadow-xl relative z-10'>
            {selected.isUrgent && <p className='text-red-500 font-bold'>URGENT</p>}
            {/* TITLE */}
            <div className='flex justify-between mb-2'>
              <p className='font-medium text-sm'>
                {selected.namaBarang} - {selected.ukuran}
              </p>

              <p className='font-bold text-lg'>{selected.jumlahSelesaiJahit}</p>
            </div>

            {/* DETAIL */}
            <div className='text-xs text-gray-600 space-y-1 mt-2'>
              <p>• Kode Potongan: {selected.kodeStokPotongan}</p>
              <p>• Penjahit: {selected.namaPenjahit}</p>
              <p>• Tanggal: {new Date(selected.tanggalSelesaiJahit).toLocaleDateString('id-ID')}</p>
            </div>

            {/* BUTTON */}
            <div className='flex justify-end mt-4 gap-2'>
              <button
                className='bg-gray-100 px-3 py-1 text-xs rounded shadow'
                onClick={() => setSelected(null)}
              >
                Tutup
              </button>

              <button
                disabled={isPending}
                className='bg-orange-500 text-white px-3 py-1 text-xs rounded shadow disabled:opacity-50'
                onClick={() => {
                  prosesQC(selected.idQC, {

                    onSuccess: (data) => {
                      toast.success(data.message);
                      setSelected(null);
                    },
                  });
                }}
              >
                {isPending ? 'Memproses...' : 'Proses'}
              </button>
            </div>
          </div>

          {/* CLICK OUTSIDE */}
          <div
            className='absolute inset-0'
            onClick={() => setSelected(null)}
          />
        </div>
      )}
    </>
  );
}
