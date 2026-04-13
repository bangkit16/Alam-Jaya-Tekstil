import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const fetcher = async () => {
  if (use_mock) {
    await delay(500);
    return [
      { id: "1", nama: "Budi" },
      { id: "2", nama: "Siti" },
      { id: "3", nama: "Dimas" },
    ];
  }

  const response = await api.get("/potong/list-pemotong");
  return response.data;
};

export const useGetPemotong = () => {
  return useQuery({
    queryKey: ["pemotong"],
    queryFn: fetcher,
  });
};
