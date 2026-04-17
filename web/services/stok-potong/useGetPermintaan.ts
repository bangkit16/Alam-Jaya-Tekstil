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
  isUrgent: boolean;
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
  return result.map((item: MenungguType) => ({
    idPermintaan: item.idPermintaan,

    idStokBarang:
      item.idStokBarang ,

    idStokPotong: item.idStokPotong ,

    namaBarang: item.namaBarang,
    ukuran: item.ukuran,
    isUrgent: item.isUrgent,
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
