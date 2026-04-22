// services/resi/useGetDesignMasuk.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

const use_mock = true;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const useGetDesignMasuk = () => {
  const fetcher = async () => {
    if (use_mock) {
      await delay(500);

      return {
        data: [
          {
            id: 1,
            nama: "Hoodie Hitam Russ",
            kategori: "Hoodie",
            jumlah: 25,
            status: "menunggu",
          },
        ],
      };
    }

    const res = await api.get("/resi/design-masuk");
    return res.data;
  };

  return useQuery({
    queryKey: ["resi-design-masuk"],
    queryFn: fetcher,
  });
};
