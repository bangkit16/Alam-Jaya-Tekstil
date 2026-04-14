import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export type PenjahitType = {
  id: string;
  nama: string;
};

const fetcher = async (): Promise<PenjahitType[]> => {
  const res = await api.get("/stokpotong/list-penjahit");

  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.data?.data)) return res.data.data;

  return [];
};

export const useGetPenjahit = () => {
  return useQuery({
    queryKey: ["stok-potong-penjahit"],
    queryFn: fetcher,
  });
};
