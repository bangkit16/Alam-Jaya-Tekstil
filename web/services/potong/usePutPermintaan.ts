import { useMutation } from "@tanstack/react-query";
import { api } from "../../lib/axios";

export const usePutPermintaan = () => {
  return useMutation({
    mutationFn: async ({ id, data }: any) => {
      return await api.put(`/potong/menunggu/${id}`, data); // ✅ WAJIB ADA ID
    },
  });
};
