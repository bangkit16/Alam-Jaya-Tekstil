import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios"; // ⚠️ SESUAIKAN PATH INI

// 🔥 TYPE (biar rapi & aman)
export type MenungguType = {
  idPermintaan: string;
  idStokBarang: string;
  idStokPotong: string; // 🔥 WAJIB
  namaBarang: string;
  ukuran: "M" | "L" | "XL" | "XXL";
  kodeKain: string;
  pemotong: string[];
  jumlahHasil: number;
  tanggalSelesaiPotong: string;
};

const fetcher = async (): Promise<MenungguType[]> => {
  const response = await api.get("/stokpotong/menunggu");

  console.log("ISI DATA RAW:", response.data);

  let result: any[] = [];

  // 🔥 HANDLE FORMAT RESPONSE
  if (Array.isArray(response.data)) {
    result = response.data;
  } else if (Array.isArray(response.data?.data)) {
    result = response.data.data;
  }

  // 🔥 MAPPING WAJIB (ANTI undefined ID)
  return result.map((item: any) => ({
    idPermintaan: item.idPermintaan,

    idStokBarang:
      item.idStokBarang ||
      item.id_stok_barang || // fallback snake_case
      item.id ||
      "",

    idStokPotong: item.idStokPotong || item.id_stok_potong || item.idStokBarang,

    namaBarang: item.namaBarang,
    ukuran: item.ukuran,
    kodeKain: item.kodeKain,
    pemotong: item.pemotong || [],
    jumlahHasil: item.jumlahHasil,
    tanggalSelesaiPotong: item.tanggalSelesaiPotong,
  }));
};

// 🔥 HOOK
export const useGetPermintaanStokPotong = () => {
  return useQuery({
    queryKey: ["stok-potong-menunggu"],
    queryFn: fetcher,
  });
};
