import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const fetcher = async () => {
  const response = await api.get("/potong/menunggu");
  return response.data;
};

export const useGetPermintaan = () => {
  return useQuery({
    queryKey: ["permintaans"],
    queryFn: fetcher,
  });
};
