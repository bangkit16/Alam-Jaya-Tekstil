// services/resi/usePostPesanan.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";

const use_mock = true;

type Payload = {
  nama: string;
  jumlah: number;
  kodeDesign: string;
};

export const usePostPesanan = () => {
  const qc = useQueryClient();

  const poster = async (data: Payload) => {
    if (use_mock) {
      return {
        message: "Pesanan dibuat (mock)",
        data,
      };
    }

    const res = await api.post("/resi/pesanan", data);
    return res.data;
  };

  return useMutation({
    mutationFn: poster,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["resi-pesanan"] });
    },
  });
};
