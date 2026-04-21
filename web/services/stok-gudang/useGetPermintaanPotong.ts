import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// --- Type Definitions ---
export interface PermintaanPotong {
  idPermintaan: string;
  namaBarang: string;
  kategori: string;
  jenisPermintaan: string;
  ukuran: string;
  isUrgent: boolean;
  jumlahMinta: number;
  tanggalMasukPermintaan: string;
  status: "ACC_GUDANG" | "MENUNGGU_POTONG" | "MENUNGGU_QC" | string;
}

export interface MetaType {
  totalData: number;
  totalPages: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
}

export interface PaginatedPermintaanPotongResponse {
  data: PermintaanPotong[];
  meta: MetaType;
}

// --- Fetcher Function ---
const fetchPermintaanPotong = async (
  page = 1,
  limit = 10,
): Promise<PaginatedPermintaanPotongResponse> => {
  if (use_mock) {
    await delay(1000);
    return {
      data: [
        {
          idPermintaan: "mock-124",
          namaBarang: "Oversized Tee Black (Mock)",
          kategori: "T-Shirt",
          jenisPermintaan: "RESI",
          ukuran: "XL",
          isUrgent: true,
          jumlahMinta: 50,
          tanggalMasukPermintaan: new Date().toISOString(),
          status: "MENUNGGU_POTONG",
        },
        {
          idPermintaan: "mock-125",
          namaBarang: "Coach Jacket Vintage (Mock)",
          kategori: "Jacket",
          jenisPermintaan: "RESI",
          ukuran: "L",
          isUrgent: false,
          jumlahMinta: 15,
          tanggalMasukPermintaan: new Date().toISOString(),
          status: "PROSES_JAHIT",
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

  const response = await api.get<PaginatedPermintaanPotongResponse>(
    "/stokgudang/permintaanpotong",
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
export const useGetPermintaanPotong = (page: number = 1) => {
  return useQuery<PaginatedPermintaanPotongResponse, Error>({
    queryKey: ["permintaan-potong", page],
    queryFn: () => fetchPermintaanPotong(page),
    meta: {
      onError: (error: Error) => {
        console.error("Gagal mengambil data permintaan potong:", error.message);
      },
    },
  });
};

/**
 * Infinite Query (Scroll)
 */
export const useGetPermintaanPotongInfinite = (limit: number = 10) => {
  return useInfiniteQuery<PaginatedPermintaanPotongResponse, Error>({
    queryKey: ["permintaan-potong", "infinite"],
    queryFn: ({ pageParam = 1 }) => fetchPermintaanPotong(pageParam as number , limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.nextPage ?? undefined,
  });
};
