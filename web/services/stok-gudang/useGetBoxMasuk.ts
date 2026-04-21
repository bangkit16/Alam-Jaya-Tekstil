import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// --- Type Definitions ---
export interface StokPotonganMasuk {
  idQC: string;
  namaBarang: string;
  ukuran: string;
  jumlah: number;
  tanggalSelesaiQC: string;
  kodeStokPotongan: string;
  isUrgent: boolean;
}

export interface BoxMasuk {
  idBox: string;
  namaBox: string;
  namaPenanggungJawab: string;
  kodeBox: string;
  tanggalMasukStok: string;
  stokPotongan: StokPotonganMasuk[];
}

export interface MetaType {
  totalData: number;
  totalPages: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
}

export interface PaginatedBoxMasukResponse {
  data: BoxMasuk[];
  meta: MetaType;
}

// --- Fetcher Function ---
const fetchBoxMasuk = async (
  page = 1,
  limit = 10,
): Promise<PaginatedBoxMasukResponse> => {
  if (use_mock) {
    await delay(1000);
    return {
      data: [
        {
          idBox: "c88a5689-2b91-47b1-b22f-a2225b4cbe60",
          namaBox: "BOX-HOODIE-001 (Mock)",
          namaPenanggungJawab: "Gani Wijaya",
          kodeBox: "BOX-260413-O278-46",
          tanggalMasukStok: "2026-04-13T08:15:55.079Z",
          stokPotongan: [
            {
              idQC: "5bbca475-6296-4858-aa00-eeda5aaae40d",
              namaBarang: "Hoodie Green Navy",
              ukuran: "L",
              jumlah: 15,
              tanggalSelesaiQC: "2026-04-13T06:57:11.384Z",
              kodeStokPotongan: "AD-0123-A1",
              isUrgent: false,
            },
          ],
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

  const response = await api.get<PaginatedBoxMasukResponse>(
    "/stokgudang/boxmasuk",
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
export const useGetBoxMasuk = (page: number = 1) => {
  return useQuery<PaginatedBoxMasukResponse, Error>({
    queryKey: ["box-masuk", page],
    queryFn: () => fetchBoxMasuk(page),
    meta: {
      onError: (error: Error) => {
        console.error("Gagal mengambil data box masuk:", error.message);
      },
    },
  });
};

/**
 * Infinite Query (Scroll)
 */
export const useGetBoxMasukInfinite = () => {
  return useInfiniteQuery<PaginatedBoxMasukResponse, Error>({
    queryKey: ["box-masuk", "infinite"],
    queryFn: ({ pageParam = 1 }) => fetchBoxMasuk(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.nextPage ?? undefined,
  });
};
