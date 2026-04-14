import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// ✅ TYPE (biar aman & konsisten dengan backend)
type Proses = {
  idPermintaan: string;
  namaBarang: string;
  kodeKain: string;
  jumlahMinta: number;
  ukuran: string;
  isUrgent: boolean;
  pengecek: string;
  pemotong: string;
};

const fetcher = async (): Promise<Proses[]> => {
  if (use_mock) {
    await delay(1000);
    return [
      {
        idPermintaan: "a1b2c3d4-e5f6",
        namaBarang: "Kemeja Flanel Kotak (MOCK)",
        kodeKain: "FLN-001",
        jumlahMinta: 45,
        ukuran: "L",
        isUrgent: true,
        pengecek: "Budi Santoso",
        pemotong: "Andi Wijaya",
      },
      {
        idPermintaan: "b2c3d4e5-f6g7",
        namaBarang: "Celana Chino Slim Fit (MOCK)",
        kodeKain: "CHN-022",
        jumlahMinta: 30,
        ukuran: "M",
        isUrgent: false,
        pengecek: "Siti Aminah",
        pemotong: "Eko Prasetyo",
      },
      {
        idPermintaan: "c3d4e5f6-g7h8",
        namaBarang: "Kaos Oversize Hitam (MOCK)",
        kodeKain: "COT-099",
        jumlahMinta: 120,
        ukuran: "XL",
        isUrgent: false,
        pengecek: "Rina Rose",
        pemotong: "Dani Ramadhan",
      },
    ];
  }

  const response = await api.get("/potong/proses");
  return response.data;
};

export const useGetProses = () => {
  return useQuery<Proses[]>({
    queryKey: ["proses"], // ✅ WAJIB SAMA DENGAN INVALIDATE
    queryFn: fetcher,
  });
};
