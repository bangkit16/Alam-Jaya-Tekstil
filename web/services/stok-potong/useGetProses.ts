import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

// 🔥 TYPE (BIAR CONSISTENT DI COMPONENT)
export type ProsesType = {
  idStokBarang: string;
  idStokPotong: string; // 🔥 WAJIB
  namaBarang: string;
  ukuran: "M" | "L" | "XL" | "XXL";
  jumlahHasil: number;
};

const fetcher = async (): Promise<ProsesType[]> => {
  const res = await api.get("/stokpotong/proses");

  console.log("DATA PROSES RAW:", res.data);

  let result = [];

  if (Array.isArray(res.data)) {
    result = res.data;
  } else if (Array.isArray(res.data?.data)) {
    result = res.data.data;
  }

  // 🔥 MAPPING (INI KUNCI)
  return result.map((item: any) => ({
    idStokBarang: item.idStokBarang || item.id_stok_barang,

    // 🔥 JANGAN fallback sembarangan
    idStokPotong: item.idStokPotong || item.id_stok_potong,

    namaBarang: item.namaBarang || item.nama_barang,

    ukuran: item.ukuran,

    jumlahHasil: item.jumlahHasil || item.jumlah_hasil || 0,
  }));
};

export const useGetProses = () => {
  return useQuery({
    queryKey: ["stok-potong-proses"],
    queryFn: fetcher,
  });
};
