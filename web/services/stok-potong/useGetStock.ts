import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export type StockType = {
  idPermintaan: string;
  idStokPotong: string;
  namaBarang: string;
  ukuran: "M" | "L" | "XL" | "XXL";
  jumlahLolos: number;
  kodeStokPotongan: string;
  tanggalMasukPotong: string;

  // ✅ TAMBAH INI
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
    idStokPotong: item.idStokPotong || item.id_stok_potong || item.id,

    namaBarang: item.namaBarang || item.nama_barang,
    ukuran: item.ukuran,

    jumlahLolos: item.jumlahLolos || item.jumlah_lolos || 0,
    kodeStokPotongan: item.kodeStokPotongan,
    tanggalMasukPotong: item.tanggalMasukPotong,

    // ✅ TAMBAH INI (PENTING BANGET)
    status: item.status,
  }));
};

export const useGetStock = () => {
  return useQuery({
    queryKey: ["stok-potong-stock"],
    queryFn: fetcher,
  });
};
