import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export const usePutMenunggu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.put(`/stokpotong/menunggu/${id}`);
      return res.data;
    },

    onSuccess: () => {
      // 🔥 refresh data menunggu
      queryClient.invalidateQueries({
        queryKey: ["stok-potong-menunggu"],
      });
      queryClient.invalidateQueries({
        queryKey: ["stok-potong-proses"],
      });
    },
  });
};
