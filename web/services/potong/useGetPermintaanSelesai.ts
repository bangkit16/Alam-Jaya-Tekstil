import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";


const use_mock = false; // ❗ WAJIB FALSE

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const fetcher = async () => {
  if (use_mock) {
    await delay(1000);
    return [];
  }

  const response = await api.get("/potong/selesai");

  // 🔥 mapping biar konsisten dengan FE kamu
  return response.data.map((item: any) => ({
    idPermintaan: item.idPermintaan,
    namaBarang: item.namaBarang,
    ukuran: item.ukuran,
    isUrgent: item.isUrgent,
    kodeKain: item.kodeKain,
    pemotong: item.pemotong,
    jumlahMinta: item.jumlahMinta,
    jumlahHasil: item.jumlahHasil,
  }));
};

export const useGetPermintaanSelesai = () => {
  return useQuery({
    queryKey: ["selesai"], // ❗ beda dari permintaan
    queryFn: fetcher,
    staleTime: 0, // biar selalu fresh
  });
};
