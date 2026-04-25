import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";

type PayloadItem = {
  idDesign: string;
  idProduk: string;
  jumlahProduk: number;
};

export const usePutMenungguStok = () => {
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: PayloadItem[];
    }) => {
      const res = await api.put(
        `/stokresi/pesanan/menunggusstok/${id}`,
        payload,
      );

      return res.data;
    },
  });
};
