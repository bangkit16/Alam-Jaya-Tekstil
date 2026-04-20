import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

// 🔥 TYPE DEFINITIONS (Opsional tapi sangat disarankan)
export type PermintaanType = {
  idPermintaan: string;
  namaBarang: string;
  kategori: string;
  jenisPermintaan: string;
  ukuran: string;
  isUrgent: boolean;
  jumlahMinta: number;
  tanggalMasukPermintaan: string;
};

export type MetaType = {
  totalData: number;
  totalPages: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
};

export type PaginatedResponse = {
  data: PermintaanType[];
  meta: MetaType;
};

// 🚀 FETCHER FUNCTION
const fetcher = async (
  page: number,
  limit: number = 8,
): Promise<PaginatedResponse> => {
  // Menggunakan limit 4 sesuai requirement awal Anda
  const response = await api.get("/potong/menunggu", {
    params: { page, limit },
  });

  // Karena data backend Anda sudah memiliki struktur { data, meta }
  // Kita tinggal mengembalikan data tersebut secara langsung
  return response.data;
};

/**
 * Standard Query (Single Page)
 */
export const useGetPermintaan = (page: number = 1, limit: number = 4) => {
  return useQuery({
    queryKey: ["potong", "menunggu", page],
    queryFn: () => fetcher(page, limit),
  });
};

/**
 * Infinite Query (Scroll)
 * Memungkinkan pemuatan data berkelanjutan
 */
export const useGetPermintaanInfinite = () => {
  return useInfiniteQuery({
    queryKey: ["potong", "menunggu", "infinite"],
    queryFn: ({ pageParam = 1 }) => fetcher(pageParam as number),
    initialPageParam: 1,
    // Mengambil halaman berikutnya dari meta.nextPage yang diberikan API
    getNextPageParam: (lastPage) => lastPage.meta.nextPage ?? undefined,
  });
};
