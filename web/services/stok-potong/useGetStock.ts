import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

// 🛠️ CONFIGURATION
const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// 🔥 TYPE DEFINITIONS
export type StockType = {
  idPermintaan: string;
  idStokPotong: string;
  namaBarang: string;
  ukuran: "M" | "L" | "XL" | "XXL";
  isUrgent: boolean;
  jumlahLolos: number;
  kodeStokPotongan: string;
  tanggalMasukPotong: string;
  status: string;
};

export type MetaType = {
  totalData: number;
  totalPages: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
};

export type PaginatedStockResponse = {
  data: StockType[];
  meta: MetaType;
};

// 📦 MOCK DATA SOURCE
const MOCK_DATA: StockType[] = [
  {
    idPermintaan: "e4e60f8e-87b1-4355-a715-efb198e5b8de",
    idStokPotong: "2b6d168f-541a-4f2b-b8e9-82e07fa5a8cc",
    namaBarang: "Sweater Merah",
    status: "KIRIM",
    ukuran: "L",
    isUrgent: true,
    kodeStokPotongan: "ASD123",
    jumlahLolos: 10,
    tanggalMasukPotong: "2026-04-15T04:17:10.775Z",
  },
  {
    idPermintaan: "4ceb9b55-f563-464e-972e-08e302e2f8bd",
    idStokPotong: "2cc857a5-157e-4c11-bb99-e6c2c3fe4704",
    namaBarang: "Hoodie Red",
    status: "KIRIM",
    ukuran: "M",
    isUrgent: true,
    kodeStokPotongan: "KAIN123-POLOS",
    jumlahLolos: 70,
    tanggalMasukPotong: "2026-04-16T08:16:46.182Z",
  },
  {
    idPermintaan: "e96523d4-af61-4d55-99c7-95ff2f9bd65f",
    idStokPotong: "2ce0eb52-26c8-4c49-8ca4-c4934c6d481e",
    namaBarang: "Hoodie Putih Merah",
    status: "KIRIM",
    ukuran: "L",
    isUrgent: true,
    kodeStokPotongan: "KAINBUS123-123",
    jumlahLolos: 30,
    tanggalMasukPotong: "2026-04-17T03:12:53.023Z",
  },
  {
    idPermintaan: "e750f194-94ef-46d2-8bda-159a0133e2f6",
    idStokPotong: "57a78a30-bc0d-49b4-a797-c3f1ba45a27b",
    namaBarang: "Hoodie Green Navy",
    status: "KIRIM",
    ukuran: "L",
    isUrgent: false,
    kodeStokPotongan: "KODE-POTO",
    jumlahLolos: 10,
    tanggalMasukPotong: "2026-04-15T06:27:53.341Z",
  },
  {
    idPermintaan: "374e5811-19dc-4fd6-a62e-ca0553a5f6ec",
    idStokPotong: "60d3b89e-002b-4462-8d8e-602f4f5478f1",
    namaBarang: "Hoodie White",
    status: "KIRIM",
    ukuran: "XL",
    isUrgent: false,
    kodeStokPotongan: "AD-123",
    jumlahLolos: 40,
    tanggalMasukPotong: "2026-04-17T03:40:08.372Z",
  },
  {
    idPermintaan: "bb603abe-ca84-492f-b934-56e5bd5a01ca",
    idStokPotong: "7c762e77-44e4-45a8-88c0-cf5702f07dbc",
    namaBarang: "Hoodie Biru Laut",
    status: "KIRIM",
    ukuran: "XXL",
    isUrgent: true,
    kodeStokPotongan: "BMNAS-Hood",
    jumlahLolos: 19,
    tanggalMasukPotong: "2026-04-17T03:17:55.501Z",
  },
];

// 🚀 FETCHER FUNCTION
const fetcher = async (page = 1 , limit:number = 10): Promise<PaginatedStockResponse> => {
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

  const response = await api.get(`/stokpotong/datastok`, { params: { page , limit } });

  const result = response.data?.data || [];
  const meta = response.data?.meta;

  // 🔥 MAPPING
  const mappedData = result.map((item: any) => ({
    idPermintaan: item.idPermintaan,
    idStokPotong: item.idStokPotong,
    namaBarang: item.namaBarang,
    ukuran: item.ukuran,
    isUrgent: !!item.isUrgent,
    jumlahLolos: item.jumlahLolos || 0,
    kodeStokPotongan: item.kodeStokPotongan,
    tanggalMasukPotong: item.tanggalMasukPotong,
    status: item.status,
  }));

  return {
    data: mappedData,
    meta: meta,
  };
};

// 🎣 HOOKS

/**
 * Standard Query (Single Page)
 */
export const useGetStock = (page: number = 1 , limit: number = 3) => {
  return useQuery({
    queryKey: ["stokpotong", "stok" , page],
    queryFn: () => fetcher(page , limit),
  });
};

/**
 * Infinite Query (Load More)
 */
export const useGetStockInfinite = () => {
  return useInfiniteQuery({
    queryKey: ["stokpotong", "stok", "infinite"],
    queryFn: ({ pageParam = 1 }) => fetcher(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.nextPage ?? undefined,
  });
};
