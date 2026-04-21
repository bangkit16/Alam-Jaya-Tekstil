import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// --- Type Definitions ---
export interface StokPotonganSelesai {
  idQC: string;
  namaBarang: string;
  ukuran: string;
  jumlah: number;
  tanggalSelesaiQC: string;
  kodeStokPotongan: string;
  isUrgent: boolean;
}

export interface QCSelesaiBox {
  idBox: string;
  namaBox: string;
  namaPenanggungJawab: string;
  kodeBox: string;
  tanggalMasukStok: string;
  stokPotongan: StokPotonganSelesai[];
}

export interface MetaType {
  totalData: number;
  totalPages: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
}

export interface PaginatedQCSelesaiResponse {
  data: QCSelesaiBox[];
  meta: MetaType;
}

// --- Fetcher Function ---
const fetchQCSelesai = async (
  page = 1,
  limit = 10,
): Promise<PaginatedQCSelesaiResponse> => {
  if (use_mock) {
    await delay(800);
    return {
      data: [
        {
          idBox: "9080cc32-9a25-4704-a7c2-6f22d05cf71e",
          namaBox: "BOX-001 (Mock)",
          namaPenanggungJawab: "Sari Wahyuni",
          kodeBox: "BOX-260416-HM5U-92",
          tanggalMasukStok: "2026-04-16T02:30:08.593Z",
          stokPotongan: [
            {
              idQC: "63666fd9-2327-4fea-9cfd-bd256e02b4fc",
              namaBarang: "Sweater Merah",
              ukuran: "L",
              jumlah: 5,
              tanggalSelesaiQC: "2026-04-16T01:56:36.154Z",
              kodeStokPotongan: "ASD123",
              isUrgent: true,
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

  const response = await api.get<PaginatedQCSelesaiResponse>("/qc/selesai", {
    params: { page, limit },
  });

  return response.data;
};

// --- Exported Hooks ---

/**
 * Standard Query (Single Page)
 */
export const useGetQCSelesai = (page: number = 1 , limit: number = 4) => {
  return useQuery<PaginatedQCSelesaiResponse, Error>({
    queryKey: ["qc", "selesai", page],
    queryFn: () => fetchQCSelesai(page , limit),
  });
};

/**
 * Infinite Query (Scroll)
 */
export const useGetQCSelesaiInfinite = () => {
  return useInfiniteQuery<PaginatedQCSelesaiResponse, Error>({
    queryKey: ["qc", "selesai", "infinite"],
    queryFn: ({ pageParam = 1 }) => fetchQCSelesai(pageParam as number , 6),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.nextPage ?? undefined,
  });
};
