// useGetRiwayatPesanan.ts

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

const use_mock = true;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const fetcher = async () => {
  // ================= MOCK =================
  if (use_mock) {
    await delay(800);

    return [
      {
        idPesanan: "rwy-001",
        kodeResi: "JX123456789",
        namaToko: "Fearless Apparel",
        isUrgent: true,
        totalDesign: 2,
        status: "DIKIRIM KE PRESS",
        design: [
          {
            idDesign: "dsg-001",
            namaDesign: "Tengkorak",
            gambarDesign: "https://via.placeholder.com/100",
            kategoriDesign: "hoodie",
            ukuran: "L",
            jumlah: 1,
            produk: {
              idProduk: "prd-001",
              namaProduk: "Hoodie Hitam",
              gambarProduk: "https://via.placeholder.com/100",
              kategoriProduk: "hoodie",
              ukuran: "L",
              jumlah: 1,
            },
          },
          {
            idDesign: "dsg-002",
            namaDesign: "Typography",
            gambarDesign: "https://via.placeholder.com/100",
            kategoriDesign: "kaos",
            ukuran: "M",
            jumlah: 1,
            produk: {
              idProduk: "prd-002",
              namaProduk: "Kaos Putih",
              gambarProduk: "https://via.placeholder.com/100",
              kategoriProduk: "kaos",
              ukuran: "M",
              jumlah: 1,
            },
          },
        ],
      },
    ];
  }

  // ================= API =================
  const res = await api.get("/stokresi/riwayatpesanan");

  const data = res.data?.data || res.data;

  return Array.isArray(data) ? data : [];
};

export const useGetRiwayatPesanan = (params?: any) => {
  return useQuery({
    queryKey: ["riwayat-pesanan", params],
    queryFn: fetcher,
  });
};
