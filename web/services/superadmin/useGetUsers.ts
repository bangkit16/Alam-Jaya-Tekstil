import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const fetcher = async () => {
  if (use_mock) {
    await delay(1000);

    // 🔥 DUMMY USER (SESUAI API KAMU)
    return [
      {
        id: "1",
        nama: "Ahmad Subarjo",
        noHandphone: "08123456789",
        username: "ahmad_s",
        role: "POTONG",
      },
      {
        id: "2",
        nama: "Budi Santoso",
        noHandphone: "08234567890",
        username: "budi_s",
        role: "QC",
      },
      {
        id: "3",
        nama: "Siti Aminah",
        noHandphone: "08345678901",
        username: "siti_a",
        role: "JAHIT",
      },
      {
        id: "4",
        nama: "Andi Wijaya",
        noHandphone: "08456789012",
        username: "andi_w",
        role: "KURIR",
      },
    ];
  }

  const response = await api.get("/admin/list-user");

  // 🔥 HANDLE RESPONSE API
  const data = response.data?.data || response.data?.users || response.data;

  return Array.isArray(data) ? data : [];
};

export const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetcher,
  });
};
