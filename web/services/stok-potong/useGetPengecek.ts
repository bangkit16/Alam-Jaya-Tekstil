import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export type PengecekType = {
  id: string;
  nama: string;
};

const fetcher = async (): Promise<PengecekType[]> => {
  const res = await api.get("/stokpotong/list-pengecek");

  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.data?.data)) return res.data.data;

  return [];
};

export const useGetPengecek = () => {
  return useQuery({
    queryKey: ["stok-potong-pengecek"],
    queryFn: fetcher,
  });
};
