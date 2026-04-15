import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Type Definitions
export interface Kurir {
  id: string;
  nama: string;
}

// Fetcher Function
const fetchListKurir = async (): Promise<Kurir[]> => {
  if (use_mock) {
    await delay(500);
    return [
      { id: "1", nama: "Joni Iskandar (Mock)" },
      { id: "2", nama: "Eko Prasetyo (Mock)" },
    ];
  }

  const { data } = await api.get<Kurir[]>("/kurir/list-kurir");
  return data;
};

// Exported Hook
export const useGetListKurir = () => {
  return useQuery<Kurir[], Error>({
    queryKey: ["kurir", "list"],
    queryFn: fetchListKurir,
  });
};
