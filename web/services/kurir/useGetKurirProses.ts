import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// --- Type Definitions ---
export interface KurirProses {
  idProsesStokPotong: string;
  namaBarang: string;
  ukuran: string;
  dikirimDari: string;
  dikirimKe: string;
  namaKurir: string;
  isUrgent: boolean;
  kodeStokPotongan: string;
  jumlahLolos: number;
  tanggalBerangkat: string;
}

export interface MetaType {
  totalData: number;
  totalPages: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
}

export interface PaginatedKurirProsesResponse {
  data: KurirProses[];
  meta: MetaType;
}

// --- Fetcher Function ---
const fetchKurirProses = async (
  page = 1,
  limit = 8,
): Promise<PaginatedKurirProsesResponse> => {
  if (use_mock) {
    await delay(800);
    return {
      data: [
        {
          idProsesStokPotong: "24b54b90-6367-4577-9383-8de12fe67cba",
          namaBarang: "Singlet Yellow Gray (Mock)",
          ukuran: "XL",
          dikirimDari: "Stok Potong",
          dikirimKe: "Budi Santoso",
          namaKurir: "Joni Iskandar",
          isUrgent: false,
          kodeStokPotongan: "ZXC123",
          jumlahLolos: 10,
          tanggalBerangkat: "2026-04-20T08:38:11.999Z",
        },
        {
          idProsesStokPotong: "836bfa60-e3fe-4404-b799-c5ca128a1c35",
          namaBarang: "Kaos Branded (Mock)",
          ukuran: "XL",
          dikirimDari: "Stok Potong",
          dikirimKe: "Budi Santoso",
          namaKurir: "Joni Iskandar",
          isUrgent: true,
          kodeStokPotongan: "KOSA90123",
          jumlahLolos: 25,
          tanggalBerangkat: "2026-04-20T08:40:25.201Z",
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

  const response = await api.get<PaginatedKurirProsesResponse>(
    "/kurir/proses",
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
export const useGetKurirProses = (page: number = 1, limit: number = 4) => {
  return useQuery<PaginatedKurirProsesResponse, Error>({
    queryKey: ["kurir", "proses", page],
    queryFn: () => fetchKurirProses(page, limit),
  });
};

/**
 * Infinite Query (Scroll)
 */
export const useGetKurirProsesInfinite = () => {
  return useInfiniteQuery<PaginatedKurirProsesResponse, Error>({
    queryKey: ["kurir", "proses", "infinite"],
    queryFn: ({ pageParam = 1 }) => fetchKurirProses(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.nextPage ?? undefined,
  });
};
