import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// --- Type Definitions ---
export interface QCMenunggu {
  idQC: string;
  namaBarang: string;
  ukuran: string;
  namaPenjahit: string;
  kodeStokPotongan: string;
  jumlahSelesaiJahit: number;
  tanggalSelesaiJahit: string;
  isUrgent: boolean;
}

export interface MetaType {
  totalData: number;
  totalPages: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
}

export interface PaginatedQCResponse {
  data: QCMenunggu[];
  meta: MetaType;
}

// --- Fetcher Function ---
const fetchQCMenunggu = async (
  page = 1,
  limit = 10,
): Promise<PaginatedQCResponse> => {
  if (use_mock) {
    await delay(800);
    return {
      data: [
        {
          idQC: "1857a001-33b7-4862-b717-4037b1823143",
          namaBarang: "Hoodie Green Navy (Mock)",
          ukuran: "L",
          namaPenjahit: "Budi Santoso",
          kodeStokPotongan: "A002",
          jumlahSelesaiJahit: 20,
          tanggalSelesaiJahit: "2026-04-15T08:17:44.914Z",
          isUrgent: true,
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

  const response = await api.get<PaginatedQCResponse>("/qc/menunggu", {
    params: { page, limit },
  });

  return response.data;
};

// --- Exported Hooks ---

/**
 * Standard Query (Single Page)
 */
export const useGetQCMenunggu = (page: number = 1 , limit: number = 4) => {
  return useQuery<PaginatedQCResponse, Error>({
    queryKey: ["qc", "menunggu", page],
    queryFn: () => fetchQCMenunggu(page , limit),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
  });
};

/**
 * Infinite Query (Scroll)
 */
export const useGetQCMenungguInfinite = () => {
  return useInfiniteQuery<PaginatedQCResponse, Error>({
    queryKey: ["qc", "menunggu", "infinite"],
    queryFn: ({ pageParam = 1 }) => fetchQCMenunggu(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.nextPage ?? undefined,
  });
};
