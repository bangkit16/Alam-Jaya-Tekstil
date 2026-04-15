import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const fetcher = async () => {
  if (use_mock) {
    await delay(500);
    return [
      {
        id: "68fd05e0-a309-4472-badb-0a90183fe169",
        slug: "hoodie",
        namaKategori: "Hoodie",
      },
      {
        id: "e7057dbf-e511-4cf9-bbd0-a79dfdb49779",
        slug: "kaos",
        namaKategori: "Kaos",
      },
      {
        id: "37d75a6f-d470-4e8a-8edf-ef78bbdbf38e",
        slug: "singlet",
        namaKategori: "Singlet",
      },
      {
        id: "c5f19d26-e602-4279-a833-407b454c171c",
        slug: "ts-hoodieKategori",
        namaKategori: "TS Hoodie",
      },
      {
        id: "e2f20500-8a3f-47f9-a8de-3d27125b9da4",
        slug: "sweater",
        namaKategori: "Sweater",
      },
      {
        id: "133d0e8c-4bb2-47cc-b969-deaf51ab0966",
        slug: "longsleeve",
        namaKategori: "Longsleeve",
      },
      {
        id: "fe8f164d-4621-4470-bc7c-b69ac62528cc",
        slug: "kemeja",
        namaKategori: "Kemeja",
      },
    ];
  }

  const response = await api.get("/stokgudang/list-kategori");
  return response.data;
};

export const useGetKategori = () => {
  return useQuery({
    queryKey: ["kategori"],
    queryFn: fetcher,
  });
};
