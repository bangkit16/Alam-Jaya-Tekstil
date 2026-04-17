import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

// --- 1. TYPES ---
export type Proses = {
  idPermintaan: string;
  namaBarang: string;
  kodeKain: string;
  ukuran: string;
  isUrgent: boolean;
  pemotong: string[]; // Sekarang array of strings
  jumlahHasil: number;
  jumlahMinta: number;
};

export type APIResponse = {
  data: Proses[];
  meta: {
    totalData: number;
    totalPages: number;
    currentPage: number;
    nextPage: number | null;
    prevPage: number | null;
  };
};

// --- 2. FETCHER FUNCTIONS ---
// Kita pisahkan logic fetch agar reusable
const fetchProses = async (page: number): Promise<APIResponse> => {
  const response = await api.get("/potong/proses", {
    params: { page },
  });
  return response.data;
};

// --- 3. HOOKS ---

/**
 * Hook untuk Web (Pagination)
 * @param page Halaman yang sedang aktif
 */
export const useGetProses = (page: number = 1) => {
  return useQuery<APIResponse>({
    queryKey: ["proses", page], // Key unik berdasarkan halaman
    queryFn: () => fetchProses(page),
    placeholderData: (previousData) => previousData, // UI tidak kedip saat ganti page
    staleTime: 1000 * 60 * 5, // Data dianggap segar selama 5 menit
  });
};

/**
 * Hook untuk Mobile (Infinite Scroll)
 * Menggunakan useInfiniteQuery dari TanStack Query
 */
export const useGetProsesInfinite = () => {
  return useInfiniteQuery<APIResponse>({
    queryKey: ["proses", "infinite"],
    queryFn: ({ pageParam = 1 }) => fetchProses(pageParam as number),
    initialPageParam: 1,
    /**
     * getNextPageParam mengambil data dari meta.nextPage
     * Jika null, berarti sudah halaman terakhir
     */
    getNextPageParam: (lastPage) => {
      return lastPage.meta.nextPage ?? undefined;
    },
    /**
     * getPreviousPageParam (Opsional) jika butuh scroll ke atas
     */
    getPreviousPageParam: (firstPage) => {
      return firstPage.meta.prevPage ?? undefined;
    },
  });
};
