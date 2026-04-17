import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

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

const fetcher = async (): Promise<StockType[]> => {
  const res = await api.get("/stokpotong/datastok");

  console.log("DATA STOCK RAW:", res.data);

  let result = [];

  if (Array.isArray(res.data)) {
    result = res.data;
  } else if (Array.isArray(res.data?.data)) {
    result = res.data.data;
  }

  return result.map((item: any) => ({
    idPermintaan: item.idPermintaan,

    // ✅ FIX UTAMA
    idStokPotong: item.idStokPotong,

    namaBarang: item.namaBarang,
    ukuran: item.ukuran,
    isUrgent: item.isUrgent,
    jumlahLolos: item.jumlahLolos,
    kodeStokPotongan: item.kodeStokPotongan,
    tanggalMasukPotong: item.tanggalMasukPotong,

    status: item.status,
  }));
};

export const useGetStock = () => {
  return useQuery({
    queryKey: ["stok-potong-stock"],
    queryFn: fetcher,
  });
};
