"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

const use_mock = true;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const fetcher = async (params?: any) => {
  if (use_mock) {
    await delay(800);

    return [
      {
        idPermintaan: "req-001",
        namaProduk: "Hoodie Green Navy",
        jumlah: 20,
        ukuran: "L",
        kategori: "Hoodie",
        isUrgent: true,
        status: "MENUNGGU",
      },
      {
        idPermintaan: "req-002",
        namaProduk: "Kaos Hitam",
        jumlah: 50,
        ukuran: "M",
        kategori: "Kaos",
        isUrgent: false,
        status: "PROSES",
      },
    ];
  }

  const res = await api.get("/stokresi/permintaanproduk", { params });

  const data = res.data?.data || res.data;

  return Array.isArray(data) ? data : [];
};

export const useGetPermintaanProduk = (params?: any) => {
  return useQuery({
    queryKey: ["permintaan-produk", params],
    queryFn: () => fetcher(params),
  });
};
