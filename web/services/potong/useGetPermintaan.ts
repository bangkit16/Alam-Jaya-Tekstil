import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const fetcher = async (page: number) => {
  const response = await api.get("/potong/menunggu", { params: { page , limit : 4} });
  return response.data;
};

export const useGetPermintaan = (page: number = 1) => {
  return useQuery({
    queryKey: ["potong", "menunggu", page],
    queryFn: () => fetcher(page),
  });
};
