import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Type Definitions
export interface StokPotonganMasuk {
  idQC: string;
  namaBarang: string;
  ukuran: string;
  jumlah: number;
  tanggalSelesaiQC: string;
  kodeStokPotongan: string;
  isUrgent: boolean;
}

export interface BoxMasuk {
  idBox: string;
  namaBox: string;
  namaPenanggungJawab: string;
  kodeBox: string;
  tanggalMasukStok: string;
  stokPotongan: StokPotonganMasuk[];
}

// Fetcher Function
const fetchBoxMasuk = async (): Promise<BoxMasuk[]> => {
  if (use_mock) {
    await delay(1000);
    return [
      {
        idBox: "c88a5689-2b91-47b1-b22f-a2225b4cbe60",
        namaBox: "BOX-HOODIE-001 (Mock)",
        namaPenanggungJawab: "Gani Wijaya",
        kodeBox: "BOX-260413-O278-46",
        tanggalMasukStok: "2026-04-13T08:15:55.079Z",
        stokPotongan: [
          {
            idQC: "5bbca475-6296-4858-aa00-eeda5aaae40d",
            namaBarang: "Hoodie Green Navy",
            ukuran: "L",
            jumlah: 15,
            tanggalSelesaiQC: "2026-04-13T06:57:11.384Z",
            kodeStokPotongan: "AD-0123-A1",
            isUrgent: false,
          },
          {
            idQC: "5bmkh475-6296-4858-aa00-eeda5aaae40d",
            namaBarang: "Hoodie Green Navy",
            ukuran: "L",
            jumlah: 15,
            tanggalSelesaiQC: "2026-04-13T06:57:11.384Z",
            kodeStokPotongan: "AD-0123-A1",
            isUrgent: false,
          },
        ],
      },
      {
        idBox: "pleqa5689-2b91-47b1-b22f-a2225mkjhe60",
        namaBox: "BOX-HOODIE-001 (Mock)",
        namaPenanggungJawab: "Gani Wijaya",
        kodeBox: "BOX-260413-O278-46",
        tanggalMasukStok: "2026-04-13T08:15:55.079Z",
        stokPotongan: [
          {
            idQC: "5bbca475-6296-4858-aa00-eeda5aaae40d",
            namaBarang: "Hoodie Green Navy",
            ukuran: "L",
            jumlah: 15,
            tanggalSelesaiQC: "2026-04-13T06:57:11.384Z",
            kodeStokPotongan: "AD-0123-A1",
            isUrgent: false,
          },
        ],
      },
      {
        idBox: "pleqa5689-2b91-47b1-b22f-a2225mkjhe60",
        namaBox: "BOX-HOODIE-001 (Mock)",
        namaPenanggungJawab: "Gani Wijaya",
        kodeBox: "BOX-260413-O278-46",
        tanggalMasukStok: "2026-04-13T08:15:55.079Z",
        stokPotongan: [
          {
            idQC: "5bbca475-6296-4858-aa00-eeda5aaae40d",
            namaBarang: "Hoodie Green Navy",
            ukuran: "L",
            jumlah: 15,
            tanggalSelesaiQC: "2026-04-13T06:57:11.384Z",
            kodeStokPotongan: "AD-0123-A1",
            isUrgent: false,
          },
        ],
      },
    ];
  }

  const response = await api.get<BoxMasuk[]>("/stokgudang/boxmasuk");
  return response.data;
};

// Exported Hook
export const useGetBoxMasuk = () => {
  return useQuery<BoxMasuk[], Error>({
    queryKey: ["box-masuk"],
    queryFn: fetchBoxMasuk,
    meta: {
      onError: (error: Error) => {
        console.error("Gagal mengambil data box masuk:", error.message);
        alert("Terjadi kesalahan saat mengambil data box masuk.");
      },
    },
  });
};
