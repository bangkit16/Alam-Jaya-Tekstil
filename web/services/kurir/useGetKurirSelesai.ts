import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Type Definitions
export interface SelesaiResponse {
  idProsesStokPotong: string;
  namaBarang: string;
  dikirimDari: string;
  dikirimKe: string;
  namaKurir: string;
  isUrgent: boolean;
  jumlah: number;
  tanggalBerangkat: string;
  tanggalSampai: string;
  status: "SELESAI_PENGIRIMAN";
}

export type KurirSelesaiResponse = {
  data: SelesaiResponse[];
  meta: {
    totalData: number;
    totalPages: number;
    currentPage: number;
    nextPage: number | null;
    prevPage: number | null;
  };
};

// Fetcher Function - Sekarang menerima page dan search
const fetchKurirSelesai = async (
  page: number = 1,
  search: string = "",
): Promise<KurirSelesaiResponse> => {
  if (use_mock) {
    await delay(800);
    return {
      data: [
        {
          idProsesStokPotong: "4217492d-4153-4b8f-8d69-80bece04de24",
          namaBarang: `Hoodie Green Navy (Mock) - Page ${page}`,
          dikirimDari: "Stok Potong",
          dikirimKe: "Penjahit (Budi Santoso)",
          namaKurir: "Joni Iskandar",
          isUrgent: true,
          jumlah: 20,
          tanggalBerangkat: "2026-04-15T06:14:25.315Z",
          tanggalSampai: "2026-04-15T06:41:56.218Z",
          status: "SELESAI_PENGIRIMAN",
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

  // Menambahkan query params ke axios
  const response = await api.get<KurirSelesaiResponse>("/kurir/selesai", {
    params: {
      page,
      search,
      limit: 10, // Opsional: tambahkan jika ingin limit statis
    },
  });
  return response.data;
};

// Exported Hook - Mendukung Query Params
export const useGetKurirSelesai = (page: number = 1, search: string = "") => {
  return useQuery<KurirSelesaiResponse, Error>({
    // Kembalikan SelesaiResponse agar meta bisa diakses
    queryKey: ["kurir", "selesai", page, search], // Tambahkan page & search ke key
    queryFn: () => fetchKurirSelesai(page, search),
    placeholderData: (previousData) => previousData,
    retry: 1,
  });
};

export const useGetKurirSelesaiInfinite = (search: string = "") => {
  return useInfiniteQuery<KurirSelesaiResponse>({
    queryKey: ["selesai", "infinite", search],
    queryFn: ({ pageParam = 1 }) =>
      fetchKurirSelesai(pageParam as number, search),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.nextPage ?? undefined,
  });
};
