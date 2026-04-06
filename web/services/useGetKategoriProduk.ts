import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/axios";

const use_mock = false;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const fetcher = async () => {
  if (use_mock) {
    await delay(1000);
    return [
      {
        id: "e7b578c2-f424-4d99-a52d-d9636c994ca3",
        name: "Hoodie (MOCK)",
        slug: "hoodie",
      },
      {
        id: "8a4ca27d-3aca-4e91-a856-362397a4208f",
        name: "Kaos",
        slug: "kaos",
      },
      {
        id: "396ec79e-de11-4654-90d3-31febf1af044",
        name: "Singlet",
        slug: "singlet",
      },
      {
        id: "f5c9293e-f054-40f4-a40c-79e5e989ef02",
        name: "TS Hoodie",
        slug: "ts-hoodie",
      },
      {
        id: "4b5dd6ad-f4c3-4595-8e4e-22dec973eb97",
        name: "Sweater",
        slug: "sweater",
      },
      {
        id: "c83441da-1671-47da-aa96-0e0ec24acfb7",
        name: "Longsleeve",
        slug: "longsleeve",
      },
      {
        id: "0bd772e2-6813-4ac2-a2f3-a936e8de96d8",
        name: "Kemeja",
        slug: "kemeja",
      },
    ];
  }

  const response = await api.get("/potong/kategori");
  return response.data;
};

export const useGetKategoriProduk = () => {
  return useQuery({
    queryKey: ["kategoris"],
    queryFn: fetcher,
  });
};
