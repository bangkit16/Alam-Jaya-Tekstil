// useGetListPenanggungJawabBox.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export const useGetListPenanggungJawabBox = () => {
  return useQuery({
    queryKey: ["penanggung-jawab-box"],
    queryFn: async () => {
      const res = await api.get("/stokresi/list-penanggung-jawab-box");
      return res.data?.data || res.data;
    },
  });
};
