import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Type Definitions
export interface PermintaanPotong {
  idPermintaan: string;
  namaBarang: string;
  kategori: string;
  jenisPermintaan: string;
  ukuran: string;
  isUrgent: boolean;
  jumlahMinta: number;
  tanggalMasukPermintaan: string;
  status: "ACC_GUDANG" | "MENUNGGU_POTONG" | "MENUNGGU_QC" | string;
}

// Fetcher Function
const fetchPermintaanPotong = async (): Promise<PermintaanPotong[]> => {
  if (use_mock) {
    await delay(1000);
    return [
      {
        idPermintaan: "mock-124",
        namaBarang: "Oversized Tee Black",
        kategori: "T-Shirt",
        jenisPermintaan: "RESI",
        ukuran: "XL",
        isUrgent: true,
        jumlahMinta: 50,
        tanggalMasukPermintaan: new Date().toISOString(),
        status: "MENUNGGU_POTONG",
      },
      {
        idPermintaan: "mock-125",
        namaBarang: "Coach Jacket Vintage",
        kategori: "Jacket",
        jenisPermintaan: "RESI",
        ukuran: "L",
        isUrgent: false,
        jumlahMinta: 15,
        tanggalMasukPermintaan: new Date().toISOString(),
        status: "PROSES_JAHIT",
      },
      {
        idPermintaan: "mock-126",
        namaBarang: "Crewneck Misty Grey",
        kategori: "Sweater",
        jenisPermintaan: "RESI",
        ukuran: "M",
        isUrgent: false,
        jumlahMinta: 30,
        tanggalMasukPermintaan: new Date().toISOString(),
        status: "MENUNGGU_POTONG",
      },
      {
        idPermintaan: "mock-127",
        namaBarang: "Cargo Pants Olive",
        kategori: "Pants",
        jenisPermintaan: "RESI",
        ukuran: "32",
        isUrgent: true,
        jumlahMinta: 25,
        tanggalMasukPermintaan: new Date().toISOString(),
        status: "QC_PASSED",
      },
      {
        idPermintaan: "mock-128",
        namaBarang: "Hoodie Zipper Maroon",
        kategori: "Hoodie",
        jenisPermintaan: "RESI",
        ukuran: "S",
        isUrgent: false,
        jumlahMinta: 10,
        tanggalMasukPermintaan: new Date().toISOString(),
        status: "MENUNGGU_POTONG",
      },
    ];
  }

  const response = await api.get<PermintaanPotong[]>(
    "/stokgudang/permintaanpotong",
  );
  return response.data;
};

// Exported Hook
export const useGetPermintaanPotong = () => {
  return useQuery<PermintaanPotong[], Error>({
    queryKey: ["permintaan-potong"],
    queryFn: fetchPermintaanPotong,
    meta: {
      onError: (error: Error) => {
        console.error("Gagal mengambil data permintaan potong:", error.message);
        alert("Terjadi kesalahan saat memuat data permintaan potong.");
      },
    },
  });
};
