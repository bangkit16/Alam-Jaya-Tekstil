import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Type Definitions
export interface PenjahitSelesai {
  idProsesStokPotong: string;
  namaBarang: string;
  kodeStokPotongan: string;
  ukuran: string;
  jumlahSelesai: number;
  isUrgent: boolean;
  tanggalSelesai: string;
  catatan: string | null;
}

// Fetcher Function
const fetchPenjahitSelesai = async (): Promise<PenjahitSelesai[]> => {
  if (use_mock) {
    await delay(800);
    return [
      {
        idProsesStokPotong: "4217492d-4153-4b8f-8d69-80bece04de24",
        namaBarang: "Hoodie Green Navy (Mock)",
        kodeStokPotongan: "A002",
        ukuran: "L",
        jumlahSelesai: 20,
        isUrgent: false,
        tanggalSelesai: "2026-04-15T08:17:44.914Z",
        catatan: "Kain kurang",
      },
      {
        idProsesStokPotong: "4217492d-4153-4b8f-8d69-80bece04de24",
        namaBarang: "Hoodie Green Navy (Mock)",
        kodeStokPotongan: "A002",
        ukuran: "L",
        jumlahSelesai: 20,
        isUrgent: true,
        tanggalSelesai: "2026-04-15T08:17:44.914Z",
        catatan: "Kain kurang",
      },
    ];
  }

  const response = await api.get<PenjahitSelesai[]>("/penjahit/selesai");
  return response.data;
};

// Exported Hook
export const useGetPenjahitSelesai = () => {
  return useQuery<PenjahitSelesai[], Error>({
    queryKey: ["penjahit", "selesai"],
    queryFn: fetchPenjahitSelesai,
    meta: {
      onError: (error: Error) => {
        console.error("Error fetching history jahit:", error.message);
        alert("Gagal mengambil riwayat jahitan selesai.");
      },
    },
  });
};
