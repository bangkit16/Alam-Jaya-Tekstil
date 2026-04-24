"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";

const use_mock = true;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const usePostPermintaanProduk = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      if (use_mock) {
        await delay(800);

        console.log("MOCK SEND:", payload);

        return {
          success: true,
          message: "Permintaan berhasil dikirim",
        };
      }

      const res = await api.post("/stokresi/permintaanproduk", payload);

      return res.data;
    },
  });
};
