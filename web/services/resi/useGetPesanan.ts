// services/resi/useGetPesanan.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

const use_mock = true;

export const useGetPesanan = () => {
  const fetcher = async () => {
    if (use_mock) {
      return {
        data: [
          {
            id: 1,
            nama: "Hoodie Putih Smith",
            jumlah: 25,
            status: "urgent",
          },
        ],
      };
    }

    const res = await api.get("/resi/pesanan");
    return res.data;
  };

  return useQuery({
    queryKey: ["resi-pesanan"],
    queryFn: fetcher,
  });
};
