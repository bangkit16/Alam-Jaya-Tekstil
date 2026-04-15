import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// --- Type Definitions ---
export interface KurirMenunggu {
  idProsesStokPotong: string;
  namaBarang: string;
  ukuran: string;
  dikirimDari: string;
  dikirimKe: string;
  isUrgent: boolean;
  kodeStokPotongan: string;
  jumlahLolos: number;
}

// --- Fetcher Function ---
const fetchKurirMenunggu = async (): Promise<KurirMenunggu[]> => {
  if (use_mock) {
    await delay(800);
    return [
      {
        idProsesStokPotong: "4217492d-4153-4b8f-8d69-80bece04de24",
        namaBarang: "Hoodie Green Navy (Mock)",
        ukuran: "L",
        dikirimDari: "Stok Potong",
        dikirimKe: "Budi Santoso",
        isUrgent: false,
        kodeStokPotongan: "A002",
        jumlahLolos: 20,
      },
      {
        idProsesStokPotong: "4217492d-4153-4b8f-8d69-80bece04de24",
        namaBarang: "Hoodie Green Navy (Mock)",
        ukuran: "L",
        dikirimDari: "Stok Potong",
        dikirimKe: "Budi Santoso",
        isUrgent: true,
        kodeStokPotongan: "A002",
        jumlahLolos: 20,
      },
    ];
  }

  const { data } = await api.get<KurirMenunggu[]>("/kurir/menunggu");
  return data;
};

// --- Exported Hook ---
export const useGetKurirMenunggu = () => {
  return useQuery<KurirMenunggu[], Error>({
    queryKey: ["kurir", "menunggu"],
    queryFn: fetchKurirMenunggu,
    retry: 1,
    // Error handling sederhana sesuai template
    meta: {
      onError: (error: Error) => {
        console.error("Gagal mengambil data kurir menunggu:", error.message);
        alert("Terjadi kesalahan saat memuat data.");
      },
    },
  });
};
