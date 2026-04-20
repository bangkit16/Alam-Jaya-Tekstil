'use client';

import { useState, useRef, useEffect } from 'react';
import { useGetKurirProsesInfinite, KurirProses } from '@/services/kurir/useGetKurirProses';
import { usePutSelesaiJob } from '@/services/kurir/usePutSelesaiJob';
import { toast } from 'sonner';
import { Package } from 'lucide-react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function Proses() {
  const [selectedJob, setSelectedJob] = useState<KurirProses | null>(null);

  // 1. Ambil data dari Service
  const { data: dataProses, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetKurirProsesInfinite();

  const data = dataProses?.pages.flatMap((page) => page.data) ?? [];
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 1,
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const mutation = usePutSelesaiJob();

  const handleClose = () => {
    setSelectedJob(null);
  };

  const handleSelesai = (id: string) => {
    mutation.mutate(id, {
      onSuccess: (data) => {
        toast.success(data.message);
        handleClose();
      },
    });
  };

  return (
    <>
      {/* ================= LIST ================= */}
      <div className='flex flex-col gap-3'>
        {isLoading ? (
          /* 1. TAMPILAN LOADING */
          <LoadingSpinner />
        ) : data && data.length > 0 ? (
          /* 2. TAMPILAN JIKA ADA DATA */
          data.map((job) => (
            <div
              key={job.idProsesStokPotong}
              onClick={() => setSelectedJob(job)}
              className='relative border rounded-sm p-3 cursor-pointer transition-colors hover:bg-gray-50'
            >
              {/* HEADER */}
              {job.isUrgent && <span className='text-red-500 text-sm font-bold'>URGENT</span>}
              <div className='flex justify-between items-center mb-2'>
                <p className={`text-sm font-medium ${job.isUrgent ? 'text-gray-900' : 'text-gray-800'}`}>
                  {job.namaBarang} - {job.ukuran}
                </p>
                <p className={`text-lg font-bold ${job.isUrgent ? 'text-gray-700' : 'text-gray-900'}`}>{job.jumlahLolos}</p>
              </div>

              {/* DETAIL */}
              <ul className={`text-xs space-y-1 ${job.isUrgent ? 'text-gray-800' : 'text-gray-700'}`}>
                <li>Kode Stok Potongan: {job.kodeStokPotongan}</li>
                <li>Dikirim Dari: {job.dikirimDari}</li>
                <li>Dikirim Ke: {job.dikirimKe}</li>
                <li>Tanggal Berangkat : {new Date(job.tanggalBerangkat).toLocaleDateString('id-ID')}</li>
              </ul>
            </div>
          ))
        ) : (
          /* 3. TAMPILAN JIKA DATA KOSONG */
          <div className='flex flex-col items-center justify-center py-16 text-gray-400'>
            <div className='bg-orange-100 text-orange-500 p-4 rounded-full mb-4'>
              <Package size={30} />
            </div>
            <p className='font-semibold text-gray-500 mb-1'>Belum ada order</p>
            <p className='text-xs text-gray-400'>Order akan muncul di sini</p>
          </div>
        )}
        <div
          ref={loadMoreRef}
          className='h-10 flex items-center justify-center'
        >
          {isFetchingNextPage && (
            <div className='flex items-center gap-2 text-xs text-gray-400'>
              <div className='w-4 h-4 border-2 border-gray-200 border-t-orange-500 rounded-full animate-spin'></div>
              Memuat data...
            </div>
          )}
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {selectedJob && (
        <div
          className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4'
          onClick={handleClose}
        >
          <div
            className={`bg-white p-4 w-full max-w-sm shadow-xl relative ${selectedJob.isUrgent ? 'bg-red-50' : 'bg-gray-50'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* LABEL URGENT POJOK KANAN */}
            {selectedJob.isUrgent && <span className=' text-red-500 text-sm font-bold  uppercase'>URGENT</span>}

            {/* HEADER */}
            <div className='flex justify-between items-center my-3'>
              <p className='text-sm font-medium text-gray-800'>{selectedJob.namaBarang}</p>
              <p className='text-lg font-bold text-gray-900'>{selectedJob.jumlahLolos}</p>
            </div>

            {/* DETAIL */}
            <ul className='text-xs text-gray-700 space-y-1 mb-6 bg-gray-50 p-3 rounded-sm'>
              <li>
                <span className='text-gray-400 uppercase text-[10px]'>Kode:</span> {selectedJob.kodeStokPotongan}
              </li>
              <li>
                <span className='text-gray-400 uppercase text-[10px]'>Dikirim Dari:</span> {selectedJob.dikirimDari}
              </li>
              <li>
                <span className='text-gray-400 uppercase text-[10px]'>Tujuan:</span> {selectedJob.dikirimKe}
              </li>
              <li>
                <span className='text-gray-400 uppercase text-[10px]'>Kurir:</span> {selectedJob.namaKurir}
              </li>
              <li>
                <span className='text-gray-400 uppercase text-[10px]'>Tanggal:</span> {new Date(selectedJob.tanggalBerangkat).toLocaleString('id-ID')}
              </li>
            </ul>

            {/* BUTTON */}
            <div className='flex gap-2'>
              <button
                disabled={mutation.isPending}
                onClick={() => handleSelesai(selectedJob.idProsesStokPotong)}
                className={`flex-1 text-white text-xs py-2 rounded-sm active:scale-95 disabled:bg-gray-400 bg-orange-500 text-semibold ${mutation.isPending ? 'bg-gray-400' : ''}`}
              >
                {mutation.isPending ? 'LOADING...' : 'SELESAI'}
              </button>

              <button
                disabled={mutation.isPending}
                onClick={handleClose}
                className='flex-1 bg-gray-300 text-gray-800 text-xs py-2 rounded-sm active:scale-95'
              >
                TIDAK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
