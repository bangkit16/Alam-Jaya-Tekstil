import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// --- Type Definitions ---
export interface StokPotongan {
  idQC: string;
  namaBarang: string;
  ukuran: string;
  jumlah: number;
  tanggalSelesaiQC: string;
  kodeStokPotongan: string;
  isUrgent: boolean;
}

export interface DataBox {
  idBox: string;
  namaBox: string;
  namaPenerimaBox: string;
  kodeBox: string;
  tanggalMasukGudang: string;
  stokPotongan: StokPotongan[];
}

export interface MetaType {
  totalData: number;
  totalPages: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
}

export interface PaginatedDataBoxResponse {
  data: DataBox[];
  meta: MetaType;
}

// --- Fetcher Function ---
const fetchDatabox = async (
  page = 1,
  limit = 10,
): Promise<PaginatedDataBoxResponse> => {
  if (use_mock) {
    await delay(1000);
    const mockItem: DataBox = {
      idBox: "mock-uuid",
      namaBox: "BOX-MOCK-001",
      namaPenerimaBox: "Mock User",
      kodeBox: "BOX-MOCK-123",
      tanggalMasukGudang: new Date().toISOString(),
      stokPotongan: [
        {
          idQC: "qc-mock",
          namaBarang: "Hoodie Green Navy (Mock)",
          ukuran: "L",
          jumlah: 15,
          tanggalSelesaiQC: new Date().toISOString(),
          kodeStokPotongan: "MOCK-001",
          isUrgent: true,
        },
      ],
    };

    return {
      data: [mockItem],
      meta: {
        totalData: 2,
        totalPages: 1,
        currentPage: page,
        nextPage: null,
        prevPage: null,
      },
    };
  }

  const response = await api.get<PaginatedDataBoxResponse>(
    "/stokgudang/databox",
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
export const useGetDatabox = (page: number = 1 , limit: number = 4) => {
  return useQuery<PaginatedDataBoxResponse, Error>({
    queryKey: ["databox-stok", page],
    queryFn: () => fetchDatabox(page , limit),
    meta: {
      onError: (error: Error) => {
        console.error("Gagal mengambil data box:", error.message);
      },
    },
  });
};

/**
 * Infinite Query (Scroll)
 */
export const useGetDataboxInfinite = (limit: number = 5) => {
  return useInfiniteQuery<PaginatedDataBoxResponse, Error>({
    queryKey: ["databox-stok", "infinite"],
    queryFn: ({ pageParam = 1 }) => fetchDatabox(pageParam as number, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.nextPage ?? undefined,
  });
};
