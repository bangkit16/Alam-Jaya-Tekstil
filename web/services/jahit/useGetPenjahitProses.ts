import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// --- Type Definitions ---
export interface PenjahitProses {
  idProsesStokPotong: string;
  namaBarang: string;
  ukuran: string;
  jumlahLolos: number;
  kodeStokPotongan: string;
  tanggalMulaiJahit: string;
  isUrgent: boolean;
  status: "DIKERJAKAN" | "SELESAI" | "JEDA";
}

export interface MetaType {
  totalData: number;
  totalPages: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
}

export interface PaginatedPenjahitProsesResponse {
  data: PenjahitProses[];
  meta: MetaType;
}

// --- Fetcher Function ---
const fetchPenjahitProses = async (
  page = 1,
  limit = 10,
): Promise<PaginatedPenjahitProsesResponse> => {
  if (use_mock) {
    await delay(800);
    return {
      data: [
        {
          idProsesStokPotong: "4217492d-4153-4b8f-8d69-80bece04de24",
          namaBarang: "Hoodie Green Navy (Mocking)",
          ukuran: "L",
          jumlahLolos: 20,
          kodeStokPotongan: "A002",
          tanggalMulaiJahit: "2026-04-15T07:19:48.250Z",
          isUrgent: false,
          status: "DIKERJAKAN",
        },
        {
          idProsesStokPotong: "5217492d-4153-4b8f-8d69-80bece04de25",
          namaBarang: "Hoodie Green Navy (Mocking)",
          ukuran: "L",
          jumlahLolos: 20,
          kodeStokPotongan: "A002",
          tanggalMulaiJahit: "2026-04-15T07:19:48.250Z",
          isUrgent: true,
          status: "JEDA",
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

  const response = await api.get<PaginatedPenjahitProsesResponse>(
    "/penjahit/proses",
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
export const useGetPenjahitProses = (page: number = 1 , limit: number = 4) => {
  return useQuery<PaginatedPenjahitProsesResponse, Error>({
    queryKey: ["penjahit", "proses", page],
    queryFn: () => fetchPenjahitProses(page),
    // Menghapus alert dari meta agar tidak mengganggu UX saat auto-refetch,
    // disarankan handle error di level komponen UI.
  });
};

/**
 * Infinite Query (Scroll)
 */
export const useGetPenjahitProsesInfinite = () => {
  return useInfiniteQuery<PaginatedPenjahitProsesResponse, Error>({
    queryKey: ["penjahit", "proses", "infinite"],
    queryFn: ({ pageParam = 1 }) => fetchPenjahitProses(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.nextPage ?? undefined,
  });
};
