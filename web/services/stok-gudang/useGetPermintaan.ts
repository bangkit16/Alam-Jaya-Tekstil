import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Type Definitions
export interface PermintaanBarang {
  idPermintaan: string;
  namaBarang: string;
  kategori: string;
  jenisPermintaan: string;
  ukuran: string;
  isUrgent: boolean;
  jumlahMinta: number;
  tanggalMasukPermintaan: string;
}

// Fetcher Function
const fetchPermintaan = async (): Promise<PermintaanBarang[]> => {
  if (use_mock) {
    await delay(1000);
    return [
      {
        idPermintaan: "5651f8cd-2e9a-4491-bbab-173c9b85e237",
        namaBarang: "Kaos merah (Mock)",
        kategori: "Kaos",
        jenisPermintaan: "RESI",
        ukuran: "XL",
        isUrgent: true,
        jumlahMinta: 50,
        tanggalMasukPermintaan: new Date().toISOString(),
      },
    ];
  }

  const response = await api.get<PermintaanBarang[]>("/stokgudang/permintaan");
  return response.data;
};

// Exported Hook
export const useGetPermintaan = () => {
  return useQuery<PermintaanBarang[], Error>({
    queryKey: ["permintaan-stok"],
    queryFn: fetchPermintaan,
    meta: {
      onError: (error: Error) => {
        console.error("Gagal mengambil data permintaan:", error.message);
        alert("Terjadi kesalahan saat mengambil data.");
      },
    },
  });
};
