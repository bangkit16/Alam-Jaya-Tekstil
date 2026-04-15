import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Type Definitions
export interface QCProses {
  idQC: string;
  namaBarang: string;
  ukuran: string;
  namaPenjahit: string;
  kodeStokPotongan: string;
  jumlahSelesaiJahit: number;
  tanggalSelesaiJahit: string;
  tanggalMulaiQC: string;
  isUrgent: boolean;
}

// Mock Data
const mockData: QCProses[] = [
  {
    idQC: "7a1d4d20-3b94-43ea-b23b-d4bc99cf4753",
    namaBarang: "Hoodie Green Navy (Mock)",
    ukuran: "L",
    namaPenjahit: "Budi Santoso",
    kodeStokPotongan: "KODE-POTO",
    jumlahSelesaiJahit: 15,
    tanggalSelesaiJahit: "2026-04-15T09:16:56.032Z",
    tanggalMulaiQC: "2026-04-15T16:27:47.122Z",
    isUrgent: false,
  },
];

// Fetcher Function
const fetchQCProses = async (): Promise<QCProses[]> => {
  if (use_mock) {
    await delay(800);
    return mockData;
  }

  try {
    const response = await api.get<QCProses[]>("/qc/proses", {
      headers: {
        accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching QC Proses:", error);
    throw new Error("Gagal mengambil data QC Proses.");
  }
};

// Exported Hook
export const useGetQCProses = () => {
  return useQuery<QCProses[], Error>({
    queryKey: ["qc","proses"],
    queryFn: fetchQCProses,
    // Menambahkan staleTime atau refetch logic jika diperlukan di masa depan
  });
};