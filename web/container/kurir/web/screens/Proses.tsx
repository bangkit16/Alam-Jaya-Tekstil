'use client';

import { Truck } from 'lucide-react';
import { KurirProses, useGetKurirProses } from '@/services/kurir/useGetKurirProses';
import { usePutSelesaiJob } from '@/services/kurir/usePutSelesaiJob';
import Pagination from '@/components/Pagination';
import { useState } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { toast } from 'sonner';

export default function Proses() {
  const [page, setPage] = useState(1);
  const { data: dataProses, isLoading } = useGetKurirProses(page);

  const [selected, setSelected] = useState<KurirProses | null>(null);

  const mutation = usePutSelesaiJob();

  const count = dataProses?.data.length || 0;

  const data: KurirProses[] = dataProses?.data || [];
  const meta = dataProses?.meta;

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      {/* CARD UTAMA */}
      <div className='bg-white rounded-2xl shadow-md border border-gray-100 p-6'>
        {/* HEADER */}
        <div className='flex justify-between items-center mb-5'>
          <h2 className='text-base font-semibold text-gray-800'>Data Proses</h2>

          <span className='text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600'>{count} item</span>
        </div>

        {/* CONTENT */}
        {count === 0 ? (
          <div className='flex flex-col items-center justify-center py-16 text-gray-400'>
            <div className='bg-blue-100 text-blue-500 p-4 rounded-full mb-4'>
              <Truck size={28} />
            </div>

            <p className='font-medium text-gray-500 mb-1'>Belum ada data proses</p>

            <p className='text-xs text-gray-400'>Data proses akan muncul di sini</p>
          </div>
        ) : (
          <div className='space-y-3'>
            {(data || []).map((item: KurirProses) => (
              <div
                key={item.idProsesStokPotong}
                className='bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:bg-gray-50 transition'
              >
                {/* HEADER ITEM */}
                {item.isUrgent && <span className='text-sm text-red-500  font-bold'>URGENT</span>}
                <div className='flex justify-between items-center mb-2'>
                  <p className='text-sm font-semibold text-gray-800'>{item.namaBarang}</p>

                  <p className='text-sm bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full font-medium'>{item.jumlahLolos}</p>
                </div>

                {/* DIVIDER */}
                <div className='h-px bg-gray-200 mb-2' />

                <div className='flex justify-between'>
                  <div className='text-xs text-gray-500 space-y-1'>
                    <p>
                      Dikirim Dari : <span className='text-gray-700 font-bold'>{item.dikirimDari}</span>
                    </p>
                    <p>
                      Dikirim Ke : <span className='text-gray-700 font-bold'>{item.dikirimKe}</span>
                    </p>
                    <p>
                      Kode Stok Potongan : <span className='text-gray-700 font-bold'>{item.kodeStokPotongan}</span>
                    </p>
                    <p>
                      Tanggal Berangkat : <span className='text-gray-700 font-bold'>{new Date(item.tanggalBerangkat).toLocaleString('id-ID')}</span>
                    </p>
                  </div>

                  {/* BUTTON */}
                  <div className='text-right mt-auto'>
                    <button
                      onClick={() => setSelected(item)}
                      className=' mt-auto  bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 py-1.5 text-xs rounded-lg font-semibold hover:scale-105 active:scale-95 transition'
                    >
                      Selesai
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {meta && meta.totalPages > 1 && (
          <Pagination
            meta={meta}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* ================= MODAL ================= */}
      {selected && (
        <div
          className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'
          onClick={() => setSelected(null)}
        >
          <div
            className='bg-white/90 backdrop-blur-xl p-6 rounded-2xl w-full max-w-sm shadow-xl'
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className='mb-4 flex justify-between'>
              <p className='text-lg  text-gray-800 font-bold'>
                {selected.namaBarang} - {selected.ukuran}
              </p>
              <p className='text-lg  text-gray-800 font-bold'>{selected.jumlahLolos}</p>
            </div>
            <div className='text-xs text-gray-500 space-y-1 mb-3 '>
              <p>
                Dikirim Dari : <span className='text-gray-700 font-bold'>{selected.dikirimDari}</span>
              </p>
              <p>
                Dikirim Ke : <span className='text-gray-700 font-bold'>{selected.dikirimKe}</span>
              </p>
              <p>
                Kode Stok Potongan : <span className='text-gray-700 font-bold'>{selected.kodeStokPotongan}</span>
              </p>
              <p>
                Tanggal Berangkat : <span className='text-gray-700 font-bold'>{new Date(selected.tanggalBerangkat).toLocaleString('id-ID')}</span>
              </p>
            </div>

            {/* BUTTON */}
            <button
              onClick={() => {
                mutation.mutate(selected.idProsesStokPotong, {
                  onSuccess: (data) => {
                    toast.success(data.message);
                    setSelected(null);
                  },
                });
              }}
              disabled={mutation.isPending}
              className='w-full bg-gradient-to-r mt-4 from-orange-500 to-amber-500 text-white py-2.5 rounded-xl font-semibold disabled:opacity-50'
            >
              {mutation.isPending ? 'Memproses...' : 'Selesai'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
