// services/resi/useGetStokDesign.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

const use_mock = true;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const useGetStokDesign = () => {
  const fetcher = async () => {
    if (use_mock) {
      await delay(400);

      return {
        data: [
          {
            kode: "DS001",
            nama: "Hoodie Hitam Russ",
            stok: 20,
          },
        ],
      };
    }

    const res = await api.get("/resi/stok-design");
    return res.data;
  };

  return useQuery({
    queryKey: ["resi-stok-design"],
    queryFn: fetcher,
  });
};
