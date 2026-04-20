import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export const usePutProses = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: any) => {
      return api.put(`/stokpotong/proses/${id}`, payload);
    },
    onSuccess : () => {
      queryClient.invalidateQueries({
        queryKey: ["stokpotong" ,"stok" , "infinite"],
      });
      queryClient.invalidateQueries({
        queryKey: ["stokpotong" ,"proses" , "infinite"],
      });
    },
  });
};
