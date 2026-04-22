// services/resi/usePostMintaDesign.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";

const use_mock = true;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

type Payload = {
  nama: string;
  kategori: string;
  jumlah: number;
  catatan?: string;
};

export const usePostMintaDesign = () => {
  const qc = useQueryClient();

  const poster = async (data: Payload) => {
    if (use_mock) {
      await delay(600);

      return {
        message: "Berhasil request design (mock)",
        data,
      };
    }

    const res = await api.post("/resi/minta-design", data);
    return res.data;
  };

  return useMutation({
    mutationFn: poster,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["resi-design-masuk"] });
    },
  });
};
