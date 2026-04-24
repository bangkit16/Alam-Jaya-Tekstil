// useGetListPenerimaBox.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export const useGetListPenerimaBox = () => {
  return useQuery({
    queryKey: ["penerima-box"],
    queryFn: async () => {
      const res = await api.get("/stokresi/list-penerima-box");
      return res.data?.data || res.data;
    },
  });
};
