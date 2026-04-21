import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// --- Type Definitions ---
export interface PenjahitSelesai {
  idProsesStokPotong: string;
  namaBarang: string;
  kodeStokPotongan: string;
  ukuran: string;
  jumlahSelesai: number;
  isUrgent: boolean;
  tanggalSelesai: string;
  catatan: string | null;
}

export interface MetaType {
  totalData: number;
  totalPages: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
}

export interface PaginatedPenjahitSelesaiResponse {
  data: PenjahitSelesai[];
  meta: MetaType;
}

// --- Fetcher Function ---
const fetchPenjahitSelesai = async (
  page = 1,
  limit = 8,
): Promise<PaginatedPenjahitSelesaiResponse> => {
  if (use_mock) {
    await delay(800);
    return {
      data: [
        {
          idProsesStokPotong: "4217492d-4153-4b8f-8d69-80bece04de24",
          namaBarang: "Hoodie Green Navy (Mock)",
          kodeStokPotongan: "A002",
          ukuran: "L",
          jumlahSelesai: 20,
          isUrgent: false,
          tanggalSelesai: "2026-04-15T08:17:44.914Z",
          catatan: "Kain kurang",
        },
        {
          idProsesStokPotong: "5217492d-4153-4b8f-8d69-80bece04de25",
          namaBarang: "Hoodie Yellow Navy (Mock)",
          kodeStokPotongan: "B003",
          ukuran: "XL",
          jumlahSelesai: 15,
          isUrgent: true,
          tanggalSelesai: "2026-04-16T09:10:00.000Z",
          catatan: null,
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

  const response = await api.get<PaginatedPenjahitSelesaiResponse>(
    "/penjahit/selesai",
    {
      params: { page, limit },
    },
  );

  return response.data;
};

// --- Exported Hooks ---

/**
 * Standard Query (Single Page)
 */
export const useGetPenjahitSelesai = (page: number = 1 , limit: number = 5) => {
  return useQuery<PaginatedPenjahitSelesaiResponse, Error>({
    queryKey: ["penjahit", "selesai", page],
    queryFn: () => fetchPenjahitSelesai(page, limit),
  });
};

/**
 * Infinite Query (Scroll)
 */
export const useGetPenjahitSelesaiInfinite = () => {
  return useInfiniteQuery<PaginatedPenjahitSelesaiResponse, Error>({
    queryKey: ["penjahit", "selesai", "infinite"],
    queryFn: ({ pageParam = 1 }) => fetchPenjahitSelesai(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.nextPage ?? undefined,
  });
};
