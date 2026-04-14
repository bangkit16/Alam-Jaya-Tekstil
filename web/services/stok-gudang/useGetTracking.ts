import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Type Definitions
export interface LogPermintaan {
  tanggal: string;
  keterangan: string;
  status: string;
}

export interface TrackingDetail {
  idPermintaan: string;
  namaBarang: string;
  kategori: string;
  jenisPermintaan: string;
  ukuran: string;
  isUrgent: boolean;
  jumlahMinta: number;
  tanggalMasukPermintaan: string;
  logPermintaan: LogPermintaan[];
}

// Fetcher Function
const fetchTracking = async (id: string): Promise<TrackingDetail> => {
  if (use_mock) {
    await delay(1000);
    return {
      idPermintaan: id,
      namaBarang: "Hoodie Green Navy (Mock)",
      kategori: "Hoodie",
      jenisPermintaan: "RESI",
      ukuran: "L",
      isUrgent: false,
      jumlahMinta: 20,
      tanggalMasukPermintaan: "2026-04-13T04:57:45.478Z",
      logPermintaan: [
        {
          tanggal: "13 Apr 2026, 11.57",
          keterangan: "Permintaan produk berhasil dibuat",
          status: "MENUNGGU_GUDANG",
        },
      ],
    };
  }

  const response = await api.get<TrackingDetail>(`/stokgudang/tracking/${id}`);
  return response.data;
};

// Exported Hook
export const useGetTracking = (id: string) => {
  return useQuery<TrackingDetail, Error>({
    queryKey: ["tracking-detail", id],
    queryFn: () => fetchTracking(id),
    enabled: !!id, // Hanya fetch jika ID tersedia
    meta: {
      onError: (error: Error) => {
        console.error("Gagal mengambil data tracking:", error.message);
      },
    },
  });
};
