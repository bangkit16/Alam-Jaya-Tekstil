import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Type Definitions
export interface StokPotongan {
  idQC: string;
  namaBarang: string;
  ukuran: string;
  jumlah: number;
  tanggalSelesaiQC: string;
  kodeStokPotongan: string;
  isUrgent: boolean;
}

export interface DataBox {
  idBox: string;
  namaBox: string;
  namaPenerimaBox: string;
  kodeBox: string;
  tanggalMasukGudang: string;
  stokPotongan: StokPotongan[];
}

// Fetcher Function
const fetchDatabox = async (): Promise<DataBox[]> => {
  if (use_mock) {
    await delay(1000);
    return [
      {
        idBox: "mock-uuid",
        namaBox: "BOX-MOCK-001",
        namaPenerimaBox: "Mock User",
        kodeBox: "BOX-MOCK-123",
        tanggalMasukGudang: new Date().toISOString(),
        stokPotongan: [
          {
            idQC: "qc-mock",
            namaBarang: "Hoodie Green Navy (Mock)",
            ukuran: "L",
            jumlah: 15,
            tanggalSelesaiQC: new Date().toISOString(),
            kodeStokPotongan: "MOCK-001",
            isUrgent: true,
          },
          {
            idQC: "qc-mock2",
            namaBarang: "Kaos Merah Jambu (Mock)",
            ukuran: "XL",
            jumlah: 20,
            tanggalSelesaiQC: new Date().toISOString(),
            kodeStokPotongan: "MOCK-002",
            isUrgent: false,
          },
        ],
      },
    ];
  }

  const response = await api.get<DataBox[]>("/stokgudang/databox");
  return response.data;
};

// Exported Hook
export const useGetDatabox = () => {
  return useQuery<DataBox[], Error>({
    queryKey: ["databox-stok"],
    queryFn: fetchDatabox,
    meta: {
      onError: (error: Error) => {
        console.error("Gagal mengambil data box:", error.message);
        alert("Terjadi kesalahan saat mengambil data box.");
      },
    },
  });
};
