import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

// 🛠️ CONFIGURATION
const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// 🔥 TYPE DEFINITIONS
export type ProsesType = {
  idPermintaan: string;
  idStokPotong: string;
  namaBarang: string;
  ukuran: "M" | "L" | "XL" | "XXL";
  isUrgent: boolean;
  kodeKain: string;
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

export type PaginatedProsesResponse = {
  data: ProsesType[];
  meta: MetaType;
};

// 📦 MOCK DATA SOURCE
const MOCK_DATA: ProsesType[] = [
  {
    idPermintaan: "07b23186-2457-46d0-9f79-4e664e077af2",
    idStokPotong: "b9e2c3e9-73bb-43c8-9692-6965c7521ab0",
    namaBarang: "Singlet Biru",
    ukuran: "L",
    isUrgent: true,
    kodeKain: "1",
    pemotong: ["Rahmat Hidayat"],
    jumlahHasil: 10,
    tanggalSelesaiPotong: "2026-04-17T08:37:57.462Z",
  },
  {
    idPermintaan: "5a21ac4d-1674-4319-bafd-7dc31a62b5b8",
    idStokPotong: "3969a09d-8d5f-44d1-b049-be39f9a67533",
    namaBarang: "Singlet Yellow Gray",
    ukuran: "XL",
    isUrgent: false,
    kodeKain: "YGR123",
    pemotong: ["Rahmat Hidayat"],
    jumlahHasil: 12,
    tanggalSelesaiPotong: "2026-04-17T08:48:57.025Z",
  },
  {
    idPermintaan: "74a9148c-2b2c-48b5-8f0e-1261e19eb337",
    idStokPotong: "a8590f06-6237-4d9f-9830-b833390b5e49",
    namaBarang: "Hoodie Green Navy",
    ukuran: "L",
    isUrgent: false,
    kodeKain: "KODE-123",
    pemotong: ["Siti Aminah"],
    jumlahHasil: 5,
    tanggalSelesaiPotong: "2026-04-17T07:59:50.770Z",
  },
  {
    idPermintaan: "e65c6c65-3033-4581-b599-8a67d611e48a",
    idStokPotong: "e6851668-5483-4eee-8252-e6440d493e4b",
    namaBarang: "Kaos Olahraga",
    ukuran: "L",
    isUrgent: false,
    kodeKain: "OLAH123",
    pemotong: ["Rahmat Hidayat"],
    jumlahHasil: 100,
    tanggalSelesaiPotong: "2026-04-20T01:47:20.012Z",
  },
  {
    idPermintaan: "e7942486-7c57-4fea-b585-569b20ed323a",
    idStokPotong: "37c3633a-3ba3-4585-8138-e1fb68aa70ee",
    namaBarang: "Kaos Merah Jambu",
    ukuran: "XL",
    isUrgent: true,
    kodeKain: "ASD123",
    pemotong: ["Rahmat Hidayat", "Siti Aminah"],
    jumlahHasil: 12,
    tanggalSelesaiPotong: "2026-04-14T06:57:36.664Z",
  },
  {
    idPermintaan: "e906dc20-e83d-4250-8c4e-17f850135b2b",
    idStokPotong: "af7f0842-2583-4df0-94eb-6582baf5daa1",
    namaBarang: "Kaos Branded",
    ukuran: "XL",
    isUrgent: true,
    kodeKain: "KOSA90",
    pemotong: ["Rahmat Hidayat"],
    jumlahHasil: 25,
    tanggalSelesaiPotong: "2026-04-17T07:50:13.113Z",
  },
];

// 🚀 FETCHER FUNCTION
const fetcher = async (page = 1, limit = 8): Promise<PaginatedProsesResponse> => {
  if (use_mock) {
    await delay(1000);
    const itemsPerPage = 3;
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

  const response = await api.get(`/stokpotong/proses`, { params: { page , limit } });

  const result = response.data?.data || [];
  const meta = response.data?.meta;

  // 🔥 MAPPING (KONSISTENSI PROPERTY)
  const mappedData = result.map((item: any) => ({
    idPermintaan: item.idPermintaan || item.id_permintaan,
    idStokPotong: item.idStokPotong || item.id_stok_potong,
    namaBarang: item.namaBarang || item.nama_barang,
    ukuran: item.ukuran,
    isUrgent: item.isUrgent ?? false,
    kodeKain: item.kodeKain,
    pemotong: item.pemotong || [],
    jumlahHasil: item.jumlahHasil || 0,
    tanggalSelesaiPotong: item.tanggalSelesaiPotong,
  }));

  return {
    data: mappedData,
    meta: meta,
  };
};

// 🎣 HOOKS

/**
 * Standard Query (Page 1 Only / Dashboard view)
 */
export const useGetProses = (page: number = 1 , limit: number = 4) => {
  return useQuery({
    queryKey: ["stokpotong", "proses" , page],
    queryFn: () => fetcher(page , limit),
  });
};

/**
 * Infinite Query (Scroll / Load More)
 */
export const useGetProsesInfinite = () => {
  return useInfiniteQuery({
    queryKey: ["stokpotong", "proses", "infinite"],
    queryFn: ({ pageParam = 1 }) => fetcher(pageParam as number ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.nextPage ?? undefined,
  });
};
