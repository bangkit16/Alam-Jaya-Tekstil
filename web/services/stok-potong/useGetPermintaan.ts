import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

// 🛠️ CONFIGURATION
const use_mock = false; // Set ke true untuk testing
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// 🔥 TYPE DEFINITIONS
export type MenungguType = {
  idPermintaan: string;
  idStokBarang: string;
  idStokPotong: string;
  namaBarang: string;
  ukuran: "M" | "L" | "XL" | "XXL";
  kodeKain: string;
  isUrgent: boolean;
  pemotong: string[];
  jumlahHasil: number;
  tanggalSelesaiPotong: string;
};

export type MetaType = {
  totalData: number;
  totalPages: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
};

export type PaginatedResponse = {
  data: MenungguType[];
  meta: MetaType;
};

// 📦 MOCK DATA SOURCE
const MOCK_DATA: MenungguType[] = [
  {
    idPermintaan: "4bf09418-b3e6-4982-b523-c82eb1b0cd2b",
    idStokBarang: "STK-001",
    idStokPotong: "63b467e8-eb30-4026-adcd-42f83091e914",
    namaBarang: "Kaos Jogging",
    ukuran: "L",
    kodeKain: "JOG123",
    pemotong: ["Siti Aminah", "Rahmat Hidayat"],
    jumlahHasil: 70,
    tanggalSelesaiPotong: "2026-04-20T02:05:55.127Z",
    isUrgent: false,
  },
  {
    idPermintaan: "5a21ac4d-1674-4319-bafd-7dc31a62b5b8",
    idStokBarang: "STK-002",
    idStokPotong: "3969a09d-8d5f-44d1-b049-be39f9a67533",
    namaBarang: "Singlet Yellow Gray",
    ukuran: "XL",
    kodeKain: "YGR123",
    pemotong: ["Rahmat Hidayat"],
    jumlahHasil: 12,
    tanggalSelesaiPotong: "2026-04-17T08:48:57.025Z",
    isUrgent: false,
  },
  {
    idPermintaan: "6ead3f08-4f44-4424-ba63-053884aefe37",
    idStokBarang: "STK-003",
    idStokPotong: "f89175ac-a600-44ea-9bd0-8c91816bc283",
    namaBarang: "Singlet Merah Jambu",
    ukuran: "XL",
    kodeKain: "MJB123",
    pemotong: ["Siti Aminah", "Rahmat Hidayat"],
    jumlahHasil: 80,
    tanggalSelesaiPotong: "2026-04-20T01:46:32.648Z",
    isUrgent: true,
  },
  {
    idPermintaan: "e65c6c65-3033-4581-b599-8a67d611e48a",
    idStokBarang: "STK-004",
    idStokPotong: "e6851668-5483-4eee-8252-e6440d493e4b",
    namaBarang: "Kaos Olahraga",
    ukuran: "L",
    kodeKain: "OLAH123",
    pemotong: ["Rahmat Hidayat"],
    jumlahHasil: 100,
    tanggalSelesaiPotong: "2026-04-20T01:47:20.012Z",
    isUrgent: false,
  },
];

// 🚀 FETCHER FUNCTION
const fetcher = async (page = 1): Promise<PaginatedResponse> => {
  if (use_mock) {
    await delay(1000); // Simulasi loading network

    // Logika simulasi paginasi sederhana untuk mock
    const itemsPerPage = 2;
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const slicedData = MOCK_DATA.slice(start, end);

    return {
      data: slicedData,
      meta: {
        totalData: MOCK_DATA.length,
        totalPages: Math.ceil(MOCK_DATA.length / itemsPerPage),
        currentPage: page,
        nextPage: end < MOCK_DATA.length ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    };
  }

  // JIKA REAL API
  const response = await api.get(`/stokpotong/menunggu`, { params: { page , limit:2 } });

  const result = response.data?.data || [];
  const meta = response.data?.meta;

  return {
    data: result.map((item: any) => ({
      ...item,
      pemotong: item.pemotong || [],
    })),
    meta: meta,
  };
};

// 🎣 HOOKS
export const useGetPermintaanStokPotong = (page: number = 1) => {
  return useQuery({
    queryKey: ["stokpotong" , "menunggu" , page],
    queryFn: () => fetcher(page),
  });
};

export const useGetPermintaanStokPotongInfinite = () => {
  return useInfiniteQuery({
    queryKey: ["stokpotong", "menunggu", "infinite"],
    queryFn: ({ pageParam = 1 }) => fetcher(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.nextPage ?? undefined,
  });
};
