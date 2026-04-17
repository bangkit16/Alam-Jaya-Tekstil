import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

// --- 1. TYPES ---
export type Selesai = {
  idPermintaan: string;
  namaBarang: string;
  ukuran: string;
  isUrgent: boolean;
  pemotong: string[];
  kodeKain: string;
  jumlahHasil: number;
  jumlahMinta: number;
};

export type SelesaiResponse = {
  data: Selesai[];
  meta: {
    totalData: number;
    totalPages: number;
    currentPage: number;
    nextPage: number | null;
    prevPage: number | null;
  };
};

// --- 2. CONFIG & MOCK DATA ---
const use_mock = false;

const MOCK_DATA: SelesaiResponse = {
  data: [
    {
      idPermintaan: "e4e60f8e-87b1-4355-a715-efb198e5b8de",
      namaBarang: "Sweater Merah (MOCK)",
      ukuran: "L",
      isUrgent: true,
      pemotong: ["Rahmat Hidayat"],
      kodeKain: "AD123",
      jumlahHasil: 49,
      jumlahMinta: 50,
    },
    {
      idPermintaan: "4ceb9b55-f563-464e-972e-08e302e2f8bd",
      namaBarang: "Hoodie Red (MOCK)",
      ukuran: "M",
      isUrgent: true,
      pemotong: ["Rahmat Hidayat"],
      kodeKain: "KAIN123",
      jumlahHasil: 80,
      jumlahMinta: 100,
    },
  ],
  meta: {
    totalData: 2,
    totalPages: 1,
    currentPage: 1,
    nextPage: null,
    prevPage: null,
  },
};

// --- 3. FETCHER ---
const fetchSelesai = async (
  page: number,
  search: string,
): Promise<SelesaiResponse> => {
  if (use_mock) {
    await new Promise((res) => setTimeout(res, 800));
    return MOCK_DATA;
  }

  const response = await api.get("/potong/selesai", {
    params: {
      page,
      search: search || undefined, // Kirim param search jika ada isi
    },
  });

  return response.data;
};

// --- 4. HOOKS ---

/** Web Hook (Pagination + Search) */
export const useGetSelesai = (page: number = 1, search: string = "") => {
  return useQuery<SelesaiResponse>({
    queryKey: ["selesai", page, search],
    queryFn: () => fetchSelesai(page, search),
    placeholderData: (prev) => prev,
    staleTime: 0,
  });
};

/** Mobile Hook (Infinite Scroll + Search) */
export const useGetSelesaiInfinite = (search: string = "") => {
  return useInfiniteQuery<SelesaiResponse>({
    queryKey: ["selesai", "infinite", search],
    queryFn: ({ pageParam = 1 }) => fetchSelesai(pageParam as number, search),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.nextPage ?? undefined,
  });
};
