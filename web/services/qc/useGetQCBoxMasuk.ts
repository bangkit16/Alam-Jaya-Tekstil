import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// --- Type Definitions ---
export interface QCMasukBox {
  idQC: string;
  namaBarang: string;
  ukuran: string;
  isUrgent: boolean;
  kodeStokPotongan: string;
  namaPenjahit: string;
  jumlahLolos: number;
  tanggalSelesaiQC: string;
}

export interface MetaType {
  totalData: number;
  totalPages: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
}

export interface PaginatedQCMasukBoxResponse {
  data: QCMasukBox[];
  meta: MetaType;
}

// --- Fetcher Function ---
const fetchQCMasukBox = async (
  page = 1,
  limit = 10,
): Promise<PaginatedQCMasukBoxResponse> => {
  if (use_mock) {
    await delay(800);
    return {
      data: [
        {
          idQC: "7a1d4d20-3b94-43ea-b23b-d4bc99cf4753",
          namaBarang: "Hoodie Green Navy (Mock)",
          ukuran: "L",
          isUrgent: false,
          kodeStokPotongan: "KODE-POTO",
          namaPenjahit: "Budi Santoso",
          jumlahLolos: 10,
          tanggalSelesaiQC: "2026-04-16T01:53:34.293Z",
        },
        {
          idQC: "8b2e5e31-4c05-54fb-c34c-e5cd00dg5864",
          namaBarang: "Hoodie Green Navy (Mock)",
          ukuran: "L",
          isUrgent: true,
          kodeStokPotongan: "KODE-POTO",
          namaPenjahit: "Budi Santoso",
          jumlahLolos: 10,
          tanggalSelesaiQC: "2026-04-16T01:53:34.293Z",
        },
      ],
      meta: {
        totalData: 2,
        totalPages: 1,
        currentPage: page,
        nextPage: null,
        prevPage: null,
      },
    };
  }

  const response = await api.get<PaginatedQCMasukBoxResponse>("/qc/masukbox", {
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
export const useGetQCMasukBox = (page: number = 1 , limit: number = 4) => {
  return useQuery<PaginatedQCMasukBoxResponse, Error>({
    queryKey: ["qc", "masukbox", page],
    queryFn: () => fetchQCMasukBox(page , limit),
  });
};

/**
 * Infinite Query (Scroll)
 */
export const useGetQCMasukBoxInfinite = () => {
  return useInfiniteQuery<PaginatedQCMasukBoxResponse, Error>({
    queryKey: ["qc", "masukbox", "infinite"],
    queryFn: ({ pageParam = 1 }) => fetchQCMasukBox(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.nextPage ?? undefined,
  });
};
