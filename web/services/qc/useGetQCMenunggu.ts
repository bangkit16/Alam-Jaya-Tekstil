import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Type Definitions berdasarkan response API QC
export interface QCMenunggu {
  idQC: string;
  namaBarang: string;
  ukuran: string;
  namaPenjahit: string;
  kodeStokPotongan: string;
  jumlahSelesaiJahit: number;
  tanggalSelesaiJahit: string;
  isUrgent: boolean;
}

// Fetcher Function
const fetchQCMenunggu = async (): Promise<QCMenunggu[]> => {
  if (use_mock) {
    await delay(800);
    return [
      {
        idQC: "1857a001-33b7-4862-b717-4037b1823143",
        namaBarang: "Hoodie Green Navy (Mock)",
        ukuran: "L",
        namaPenjahit: "Budi Santoso",
        kodeStokPotongan: "A002",
        jumlahSelesaiJahit: 20,
        tanggalSelesaiJahit: "2026-04-15T08:17:44.914Z",
        isUrgent: true,
      },
    ];
  }

  const response = await api.get<QCMenunggu[]>("/qc/menunggu");
  return response.data;
};

// Exported Hook
export const useGetQCMenunggu = () => {
  return useQuery<QCMenunggu[], Error>({
    queryKey: ["qc", "menunggu"],
    queryFn: fetchQCMenunggu,
  });
};
