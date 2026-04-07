import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const fetcher = async () => {
  if (use_mock) {
    await delay(1000);
    return [
      {
        id_permintaan: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
        nama_produk: "Kemeja Flanel Kotak (MOCK)",
        kode_kain: "FLN-001",
        jumlah: 45,
        ukuran: "L",
        user_id: "64fcf01e-94d5-4ee8-91f2-18fea8bfe78a",
        is_urgent: true,
        pengecek: "Budi Santoso",
        pemotong: "Andi Wijaya",
      },
      {
        id_permintaan: "b2c3d4e5-f6g7-8h9i-0j1k-l2m3n4o5p6q7",
        nama_produk: "Celana Chino Slim Fit (MOCK)",
        kode_kain: "CHN-022",
        jumlah: 30,
        ukuran: "M",
        user_id: "64fcf01e-94d5-4ee8-91f2-18fea8bfe78a",
        is_urgent: false,
        pengecek: "Siti Aminah",
        pemotong: "Eko Prasetyo",
      },
      {
        id_permintaan: "c3d4e5f6-g7h8-9i0j-k1l2-m3n4o5p6q7r8",
        nama_produk: "Kaos Oversize Hitam (MOCK)",
        kode_kain: "COT-099",
        jumlah: 120,
        ukuran: "XL",
        user_id: "64fcf01e-94d5-4ee8-91f2-18fea8bfe78a",
        is_urgent: false,
        pengecek: "Rina Rose",
        pemotong: "Dani Ramadhan",
      },
    ];
  }

  const response = await api.get("/potong/proses");
  return response.data;
};

export const useGetProses = () => {
  return useQuery({
    queryKey: ["prosess"],
    queryFn: fetcher,
  });
};
