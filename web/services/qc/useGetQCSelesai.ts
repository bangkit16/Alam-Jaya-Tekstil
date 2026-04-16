import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Type Definitions
export interface StokPotonganSelesai {
  idQC: string;
  namaBarang: string;
  ukuran: string;
  jumlah: number;
  tanggalSelesaiQC: string;
  kodeStokPotongan: string;
  isUrgent: boolean;
}

export interface QCSelesaiBox {
  idBox: string;
  namaBox: string;
  namaPenanggungJawab: string;
  kodeBox: string;
  tanggalMasukStok: string;
  stokPotongan: StokPotonganSelesai[];
}

// Fetcher Function
const fetchQCSelesai = async (): Promise<QCSelesaiBox[]> => {
  if (use_mock) {
    await delay(800);
    return [
      {
        idBox: "9080cc32-9a25-4704-a7c2-6f22d05cf71e",
        namaBox: "BOX-001 (Mock)",
        namaPenanggungJawab: "Sari Wahyuni",
        kodeBox: "BOX-260416-HM5U-92",
        tanggalMasukStok: "2026-04-16T02:30:08.593Z",
        stokPotongan: [
          {
            idQC: "63666fd9-2327-4fea-9cfd-bd256e02b4fc",
            namaBarang: "Sweater Merah",
            ukuran: "L",
            jumlah: 5,
            tanggalSelesaiQC: "2026-04-16T01:56:36.154Z",
            kodeStokPotongan: "ASD123",
            isUrgent: true,
          },
        ],
      },
    ];
  }

  const response = await api.get<QCSelesaiBox[]>("/qc/selesai");
  return response.data;
};

// Exported Hook
export const useGetQCSelesai = () => {
  return useQuery<QCSelesaiBox[], Error>({
    queryKey: ["qc", "selesai"],
    queryFn: fetchQCSelesai,
  });
};
