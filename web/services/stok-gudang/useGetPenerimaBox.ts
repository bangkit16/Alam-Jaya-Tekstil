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

  const response = await api.get("/stokgudang/list-penerima-box");
  return response.data;
};

export const useGetPenerimaBox = () => {
  return useQuery({
    queryKey: ["penerimaBox"],
    queryFn: fetcher,
  });
};
