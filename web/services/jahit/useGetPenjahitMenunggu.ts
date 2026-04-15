import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Type Definitions
export interface PenjahitMenunggu {
  idProsesStokPotong: string;
  kodeStokPotongan: string;
  namaBarang: string;
  ukuran: string;
  jumlah: number;
  isUrgent: boolean;
  tanggalKirim: string;
}

// Fetcher Function
const fetchPenjahitMenunggu = async (): Promise<PenjahitMenunggu[]> => {
  if (use_mock) {
    await delay(800);
    return [
      {
        idProsesStokPotong: "4217492d-4153-4b8f-8d69-80bece04de24",
        kodeStokPotongan: "A002",
        namaBarang: "Hoodie Green Navy (Mock)",
        ukuran: "L",
        jumlah: 20,
        isUrgent: true,
        tanggalKirim: "2026-04-15T06:41:56.218Z",
      },
      {
        idProsesStokPotong: "4217492d-4153-4b8f-8d69-80bece04de24",
        kodeStokPotongan: "A002",
        namaBarang: "Hoodie Green Navy (Mock)",
        ukuran: "L",
        jumlah: 20,
        isUrgent: false,
        tanggalKirim: "2026-04-15T06:41:56.218Z",
      },
    ];
  }

  const response = await api.get<PenjahitMenunggu[]>("/penjahit/menunggu");
  return response.data;
};

// Exported Hook
export const useGetPenjahitMenunggu = () => {
  return useQuery<PenjahitMenunggu[], Error>({
    queryKey: ["penjahit", "menunggu"],
    queryFn: fetchPenjahitMenunggu,
    meta: {
      onError: (error: Error) => {
        console.error("Error fetching penjahit menunggu:", error.message);
        alert("Gagal mengambil daftar jahitan menunggu.");
      },
    },
  });
};
