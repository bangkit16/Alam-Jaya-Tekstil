import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Type Definitions
export interface QCMasukBox {
  idQC: string;
  namaBarang: string;
  ukuran: string;
  isUrgent: boolean;
  kodeStokPotongan: string;
  namaPenjahit: string;
  jumlahLolos: number;
  tanggalSelesaiQC: string;
}

// Fetcher Function
const fetchQCMasukBox = async (): Promise<QCMasukBox[]> => {
  if (use_mock) {
    await delay(800);
    return [
      {
        idQC: "7a1d4d20-3b94-43ea-b23b-d4bc99cf4753",
        namaBarang: "Hoodie Green Navy (Mock)",
        ukuran: "L",
        isUrgent: false,
        kodeStokPotongan: "KODE-POTO",
        namaPenjahit: "Budi Santoso",
        jumlahLolos: 10,
        tanggalSelesaiQC: "2026-04-16T01:53:34.293Z",
      },
      {
        idQC: "7a1d4d20-3b94-43ea-b23b-d4bc99cf4753",
        namaBarang: "Hoodie Green Navy (Mock)",
        ukuran: "L",
        isUrgent: true,
        kodeStokPotongan: "KODE-POTO",
        namaPenjahit: "Budi Santoso",
        jumlahLolos: 10,
        tanggalSelesaiQC: "2026-04-16T01:53:34.293Z",
      },
    ];
  }

  try {
    const response = await api.get<QCMasukBox[]>("/qc/masukbox", {
      headers: {
        accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching QC Masuk Box:", error);
    throw new Error("Gagal mengambil data box.");
  }
};

// Exported Hook
export const useGetQCMasukBox = () => {
  return useQuery<QCMasukBox[], Error>({
    queryKey: ["qc", "masukbox"],
    queryFn: fetchQCMasukBox,
  });
};
