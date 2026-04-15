import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Type Definitions
export interface PenjahitProses {
  idProsesStokPotong: string;
  namaBarang: string;
  ukuran: string;
  jumlahLolos: number;
  kodeStokPotongan: string;
  tanggalMulaiJahit: string;
  isUrgent: boolean;
  status: "DIKERJAKAN" | "SELESAI" | "JEDA";
}

// Fetcher Function
const fetchPenjahitProses = async (): Promise<PenjahitProses[]> => {
  if (use_mock) {
    await delay(800);
    return [
      {
        idProsesStokPotong: "4217492d-4153-4b8f-8d69-80bece04de24",
        namaBarang: "Hoodie Green Navy (Mocking)",
        ukuran: "L",
        jumlahLolos: 20,
        kodeStokPotongan: "A002",
        tanggalMulaiJahit: "2026-04-15T07:19:48.250Z",
        isUrgent: false,
        status: "DIKERJAKAN",
      },
      {
        idProsesStokPotong: "4217492d-4153-4b8f-8d69-80bece04de24",
        namaBarang: "Hoodie Green Navy (Mocking)",
        ukuran: "L",
        jumlahLolos: 20,
        kodeStokPotongan: "A002",
        tanggalMulaiJahit: "2026-04-15T07:19:48.250Z",
        isUrgent: true,
        status: "JEDA",
      },
      {
        idProsesStokPotong: "4217492d-4153-4b8f-8d69-80bece04de24",
        namaBarang: "Hoodie Green Navy (Mocking)",
        ukuran: "L",
        jumlahLolos: 20,
        kodeStokPotongan: "A002",
        tanggalMulaiJahit: "2026-04-15T07:19:48.250Z",
        isUrgent: false,
        status: "DIKERJAKAN",
      },
    ];
  }

  const response = await api.get<PenjahitProses[]>("/penjahit/proses");
  return response.data;
};

// Exported Hook
export const useGetPenjahitProses = () => {
  return useQuery<PenjahitProses[], Error>({
    queryKey: ["penjahit", "proses"],
    queryFn: fetchPenjahitProses,
    meta: {
      onError: (error: Error) => {
        console.error("Error fetching penjahit proses:", error.message);
        alert("Gagal mengambil daftar pekerjaan yang sedang diproses.");
      },
    },
  });
};
