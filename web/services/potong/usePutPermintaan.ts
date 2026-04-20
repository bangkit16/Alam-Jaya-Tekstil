import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios";

export const usePutPermintaan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: any) => {
      return await api.put(`/potong/menunggu/${id}`, data); // ✅ WAJIB ADA ID
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["potong" , "menunggu"] });
      queryClient.invalidateQueries({ queryKey: ["potong" , "proses"] });
    },
  });
};
