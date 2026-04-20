import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// --- Type Definitions ---
export interface KurirMenunggu {
  idProsesStokPotong: string;
  namaBarang: string;
  ukuran: string;
  dikirimDari: string;
  dikirimKe: string;
  isUrgent: boolean;
  kodeStokPotongan: string;
  jumlahLolos: number;
}

export interface MetaType {
  totalData: number;
  totalPages: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
}

export interface PaginatedKurirResponse {
  data: KurirMenunggu[];
  meta: MetaType;
}

// --- Mock Data Source ---
const MOCK_DATA_SOURCE: KurirMenunggu[] = [
  {
    idProsesStokPotong: "6cc55dc4-b4a8-49a4-851e-3eee94fc872c",
    namaBarang: "Hoodie Green Navy (Mock)",
    ukuran: "L",
    dikirimDari: "Stok Potong",
    dikirimKe: "Budi Santoso",
    isUrgent: false,
    kodeStokPotongan: "KODE-123",
    jumlahLolos: 3,
  },
  {
    idProsesStokPotong: "8acd0eba-c484-464a-aef6-4caae0771da5",
    namaBarang: "Hoodie Oblong (Mock)",
    ukuran: "XL",
    dikirimDari: "Stok Potong",
    dikirimKe: "Budi Santoso",
    isUrgent: true,
    kodeStokPotongan: "BND123",
    jumlahLolos: 50,
  },
  {
    idProsesStokPotong: "f8720178-fa1b-4c06-b281-54c26bb0c927",
    namaBarang: "Kaos Merah Jambu (Mock)",
    ukuran: "XL",
    dikirimDari: "Stok Potong",
    dikirimKe: "Budi Santoso",
    isUrgent: true,
    kodeStokPotongan: "VSADN123",
    jumlahLolos: 10,
  },
];

// --- Fetcher Function ---
const fetchKurirMenunggu = async (
  page = 1,
  limit = 10,
): Promise<PaginatedKurirResponse> => {
  if (use_mock) {
    await delay(800);
    return {
      data: MOCK_DATA_SOURCE,
      meta: {
        totalData: MOCK_DATA_SOURCE.length,
        totalPages: 1,
        currentPage: page,
        nextPage: null,
        prevPage: null,
      },
    };
  }

  const response = await api.get<PaginatedKurirResponse>("/kurir/menunggu", {
    params: { page, limit },
  });

  return response.data;
};

// --- Exported Hooks ---

/**
 * Standard Query (Single Page)
 */
export const useGetKurirMenunggu = (page: number = 1 , limit : number = 4) => {
  return useQuery<PaginatedKurirResponse, Error>({
    queryKey: ["kurir", "menunggu", page],
    queryFn: () => fetchKurirMenunggu(page , limit),

    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: 1,
  });
};

/**
 * Infinite Query (Load More / Scroll)
 */
export const useGetKurirMenungguInfinite = () => {
  return useInfiniteQuery<PaginatedKurirResponse, Error>({
    queryKey: ["kurir", "menunggu", "infinite"],
    queryFn: ({ pageParam = 1 }) => fetchKurirMenunggu(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.nextPage ?? undefined,
  });
};
