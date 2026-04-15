import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export const usePutStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, penjahitId }: any) => {
      return api.put(`/stokpotong/datastok/${id}`, {
        idPenjahit: penjahitId,
      });
    },
    onSuccess: () => {
      // 🔥 refresh data stock
      queryClient.invalidateQueries({
        queryKey: ["stok-potong-stock"],
      });
    },
  });
};
