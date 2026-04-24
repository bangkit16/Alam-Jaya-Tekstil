import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";

type PayloadItem = {
  idDesign: string;
  idProduk: string;
  jumlahProduk: number;
};

export const usePutKirim = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: PayloadItem[];
    }) => {
      const res = await api.put(
        `/stokresi/kirim/${id}`,
        payload, // 🔥 WAJIB SESUAI SWAGGER
      );

      return res.data;
    },

    onSuccess: () => {
      // refresh data pesanan
      queryClient.invalidateQueries({ queryKey: ["pesanan"] });
    },
  });
};
