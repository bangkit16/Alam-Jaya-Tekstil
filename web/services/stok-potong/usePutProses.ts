import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export const usePutProses = () => {
  return useMutation({
    mutationFn: async ({ id, payload }: any) => {
      return api.put(`/stokpotong/proses/${id}`, payload);
    },
  });
};
