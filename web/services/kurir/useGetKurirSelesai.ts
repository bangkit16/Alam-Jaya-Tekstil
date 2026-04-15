import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Type Definitions
export interface KurirSelesaiResponse {
  idProsesStokPotong: string;
  namaBarang: string;
  dikirimDari: string;
  dikirimKe: string;
  namaKurir: string;
  jumlah: number;
  tanggalBerangkat: string;
  tanggalSampai: string;
  status: "SELESAI_PENGIRIMAN";
}

// Fetcher Function
const fetchKurirSelesai = async (): Promise<KurirSelesaiResponse[]> => {
  if (use_mock) {
    await delay(800);
    return [
      {
        idProsesStokPotong: "4217492d-4153-4b8f-8d69-80bece04de24",
        namaBarang: "Hoodie Green Navy (Mock)",
        dikirimDari: "Stok Potong",
        dikirimKe: "Penjahit (Budi Santoso)",
        namaKurir: "Joni Iskandar",
        jumlah: 20,
        tanggalBerangkat: "2026-04-15T06:14:25.315Z",
        tanggalSampai: "2026-04-15T06:41:56.218Z",
        status: "SELESAI_PENGIRIMAN",
      },
    ];
  }

  const response = await api.get<KurirSelesaiResponse[]>("/kurir/selesai");
  return response.data;
};

// Exported Hook
export const useGetKurirSelesai = () => {
  return useQuery<KurirSelesaiResponse[], Error>({
    queryKey: ["kurir", "selesai"],
    queryFn: fetchKurirSelesai,
    placeholderData: (previousData) => previousData,
    retry: 1,
    meta: {
      onError: (error: Error) => {
        console.error("Gagal mengambil data kurir selesai:", error.message);
        alert("Terjadi kesalahan saat memuat data pengiriman.");
      },
    },
  });
};
