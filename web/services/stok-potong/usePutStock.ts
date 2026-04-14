import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export const usePutStock = () => {
  return useMutation({
    mutationFn: async ({ id, penjahitId }: any) => {
      return api.put(`/stokpotong/datastok/${id}`, {
        idPenjahit: penjahitId,
      });
    },
  });
};
