import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// --- Type Definitions ---
export interface KurirProses {
  idProsesStokPotong: string;
  namaBarang: string;
  ukuran: string;
  dikirimDari: string;
  dikirimKe: string;
  namaKurir: string;
  isUrgent: boolean;
  kodeStokPotongan: string;
  jumlahLolos: number;
  tanggalBerangkat: string;
}

// --- Fetcher Function ---
const fetchKurirProses = async (): Promise<KurirProses[]> => {
  if (use_mock) {
    await delay(800);
    return [
      {
        idProsesStokPotong: "4217492d-4153-4b8f-8d69-80bece04de24",
        namaBarang: "Hoodie Green Navy (Mock)",
        ukuran: "L",
        dikirimDari: "Stok Potong",
        dikirimKe: "Budi Santoso",
        namaKurir: "Joni Iskandar",
        isUrgent: false,
        kodeStokPotongan: "A002",
        jumlahLolos: 20,
        tanggalBerangkat: new Date().toISOString(),
      },
      {
        idProsesStokPotong: "4217492d-4153-4b8f-8d69-80bece04de24",
        namaBarang: "Hoodie Green Navy (Mock)",
        ukuran: "L",
        dikirimDari: "Stok Potong",
        dikirimKe: "Budi Santoso",
        namaKurir: "Joni Iskandar",
        isUrgent: true,
        kodeStokPotongan: "A002",
        jumlahLolos: 20,
        tanggalBerangkat: new Date().toISOString(),
      },
    ];
  }

  const { data } = await api.get<KurirProses[]>("/kurir/proses");
  return data;
};

// --- Exported Hook ---
export const useGetKurirProses = () => {
  return useQuery<KurirProses[], Error>({
    queryKey: ["kurir", "proses"],
    queryFn: fetchKurirProses,
  });
};
