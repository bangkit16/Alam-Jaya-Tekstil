// useGetKategori.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export const useGetKategori = () => {
  return useQuery({
    queryKey: ["kategori"],
    queryFn: async () => {
      const res = await api.get("/stokresi/list-kategori");
      return res.data?.data || res.data;
    },
  });
};
