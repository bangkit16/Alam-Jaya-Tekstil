import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Type Definitions
export interface PenjahitMenunggu {
  idProsesStokPotong: string;
  kodeStokPotongan: string;
  namaBarang: string;
  ukuran: string;
  jumlah: number;
  isUrgent: boolean;
  tanggalKirim: string;
}

export interface MetaType {
  totalData: number;
  totalPages: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
}

export interface PaginatedPenjahitMenungguResponse {
  data: PenjahitMenunggu[];
  meta: MetaType;
}

// Fetcher Function
const fetchPenjahitMenunggu = async (
  page: number = 1,
  limit: number = 8,
): Promise<PaginatedPenjahitMenungguResponse> => {
  if (use_mock) {
    await delay(800);
    return {
      data: [
        {
          idProsesStokPotong: "4217492d-4153-4b8f-8d69-80bece04de24",
          kodeStokPotongan: "A002",
          namaBarang: "Hoodie Green Navy (Mock)",
          ukuran: "L",
          jumlah: 20,
          isUrgent: true,
          tanggalKirim: "2026-04-15T06:41:56.218Z",
        },
        {
          idProsesStokPotong: "4217492d-4153-4b8f-8d69-80bece04de24",
          kodeStokPotongan: "A002",
          namaBarang: "Hoodie Green Navy (Mock)",
          ukuran: "L",
          jumlah: 20,
          isUrgent: false,
          tanggalKirim: "2026-04-15T06:41:56.218Z",
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
  }

  const response = await api.get<PaginatedPenjahitMenungguResponse>(
    "/penjahit/menunggu",
    {
      params: {
        page: page,
        limit: limit,
      },
    },
  );
  return response.data;
};

// Exported Hook
export const useGetPenjahitMenunggu = (page: number = 1, limit: number = 4) => {
  return useQuery<PaginatedPenjahitMenungguResponse, Error>({
    queryKey: ["penjahit", "menunggu", page],
    queryFn: () => fetchPenjahitMenunggu(page, limit),
    meta: {
      onError: (error: Error) => {
        console.error("Error fetching penjahit menunggu:", error.message);
        alert("Gagal mengambil daftar jahitan menunggu.");
      },
    },
  });
};

export const useGetPenjahitMenungguInfinite = () => {
  return useInfiniteQuery<PaginatedPenjahitMenungguResponse, Error>({
    queryKey: ["kurir", "proses", "infinite"],
    queryFn: ({ pageParam = 1 }) => fetchPenjahitMenunggu(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.nextPage ?? undefined,
  });
};