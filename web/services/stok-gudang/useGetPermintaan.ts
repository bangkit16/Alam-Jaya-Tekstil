import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// --- Type Definitions ---
export interface PermintaanBarang {
  idPermintaan: string;
  namaBarang: string;
  kategori: string;
  jenisPermintaan: string;
  ukuran: string;
  isUrgent: boolean;
  jumlahMinta: number;
  tanggalMasukPermintaan: string;
}

export interface MetaType {
  totalData: number;
  totalPages: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
}

export interface PaginatedPermintaanResponse {
  data: PermintaanBarang[];
  meta: MetaType;
}

// --- Fetcher Function ---
const fetchPermintaan = async (
  page = 1,
  limit = 10,
): Promise<PaginatedPermintaanResponse> => {
  if (use_mock) {
    await delay(1000);
    return {
      data: [
        {
          idPermintaan: "5651f8cd-2e9a-4491-bbab-173c9b85e237",
          namaBarang: "Kaos merah (Mock)",
          kategori: "Kaos",
          jenisPermintaan: "RESI",
          ukuran: "XL",
          isUrgent: true,
          jumlahMinta: 50,
          tanggalMasukPermintaan: new Date().toISOString(),
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

  const response = await api.get<PaginatedPermintaanResponse>(
    "/stokgudang/permintaan",
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
export const useGetPermintaan = (page: number = 1) => {
  return useQuery<PaginatedPermintaanResponse, Error>({
    queryKey: ["permintaan-stok", page],
    queryFn: () => fetchPermintaan(page),
    meta: {
      onError: (error: Error) => {
        console.error("Gagal mengambil data permintaan:", error.message);
      },
    },
  });
};

/**
 * Infinite Query (Scroll)
 */
export const useGetPermintaanInfinite = () => {
  return useInfiniteQuery<PaginatedPermintaanResponse, Error>({
    queryKey: ["permintaan-stok", "infinite"],
    queryFn: ({ pageParam = 1 }) => fetchPermintaan(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.nextPage ?? undefined,
  });
};
