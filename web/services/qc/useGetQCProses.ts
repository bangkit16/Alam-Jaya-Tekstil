import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// --- Type Definitions ---
export interface QCProses {
  idQC: string;
  namaBarang: string;
  ukuran: string;
  namaPenjahit: string;
  kodeStokPotongan: string;
  jumlahSelesaiJahit: number;
  tanggalSelesaiJahit: string;
  tanggalMulaiQC: string;
  isUrgent: boolean;
}

export interface MetaType {
  totalData: number;
  totalPages: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
}

export interface PaginatedQCProsesResponse {
  data: QCProses[];
  meta: MetaType;
}

// --- Fetcher Function ---
const fetchQCProses = async (
  page = 1,
  limit = 10,
): Promise<PaginatedQCProsesResponse> => {
  if (use_mock) {
    await delay(800);
    return {
      data: [
        {
          idQC: "7a1d4d20-3b94-43ea-b23b-d4bc99cf4753",
          namaBarang: "Hoodie Green Navy (Mock)",
          ukuran: "L",
          namaPenjahit: "Budi Santoso",
          kodeStokPotongan: "KODE-POTO",
          jumlahSelesaiJahit: 15,
          tanggalSelesaiJahit: "2026-04-15T09:16:56.032Z",
          tanggalMulaiQC: "2026-04-15T16:27:47.122Z",
          isUrgent: false,
        },
      ],
      meta: {
        totalData: 1,
        totalPages: 1,
        currentPage: page,
        nextPage: null,
        prevPage: null,
      },
    };
  }

  const response = await api.get<PaginatedQCProsesResponse>("/qc/proses", {
    params: { page, limit },
    headers: {
      accept: "application/json",
    },
  });

  return response.data;
};

// --- Exported Hooks ---

/**
 * Standard Query (Single Page)
 */
export const useGetQCProses = (page: number = 1 , limit: number = 4) => {
  return useQuery<PaginatedQCProsesResponse, Error>({
    queryKey: ["qc", "proses", page],
    queryFn: () => fetchQCProses(page , limit),
  });
};

/**
 * Infinite Query (Scroll)
 */
export const useGetQCProsesInfinite = () => {
  return useInfiniteQuery<PaginatedQCProsesResponse, Error>({
    queryKey: ["qc", "proses", "infinite"],
    queryFn: ({ pageParam = 1 }) => fetchQCProses(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.nextPage ?? undefined,
  });
};
