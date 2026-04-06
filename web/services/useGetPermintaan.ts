import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/axios";

const use_mock = false;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const fetcher = async () => {
  if (use_mock) {
    await delay(1000);
    return [
      {
        id_permintaan: "bfe25650-7bf2-4114-9139-e6e25d360087",
        nama_produk: "Kaos Polos Cotton Combed (MOCK)",
        jumlah: 100,
        ukuran: "L",
        user_id: "9a1a315d-da0e-4764-9ff8-5d519cd9cb2e",
        is_urgent: true,
      },
      {
        id_permintaan: "26beb0b1-922f-41a6-912b-96c6cfc33e72",
        nama_produk: "Hoodie Jumper (MOCK)",
        jumlah: 50,
        ukuran: "M",
        user_id: "9a1a315d-da0e-4764-9ff8-5d519cd9cb2e",
        is_urgent: false,
      },
      {
        id_permintaan: "95ad39b7-e71c-4bc8-b5b3-973b7cb1b278",
        nama_produk: "Jaket Kulit Vintage (MOCK)",
        jumlah: 10,
        ukuran: "M",
        user_id: "9a1a315d-da0e-4764-9ff8-5d519cd9cb2e",
        is_urgent: false,
      },
      {
        id_permintaan: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2g3h4i5j",
        nama_produk: "Celana Chino Slim Fit (MOCK)",
        jumlah: 30,
        ukuran: "32",
        user_id: "9a1a315d-da0e-4764-9ff8-5d519cd9cb2e",
        is_urgent: false,
      },
      {
        id_permintaan: "z9y8x7w6-v5u4-3t2s-1r0q-p9o8n7m6l5k4",
        nama_produk: "Kemeja Flanel Kotak (MOCK)",
        jumlah: 25,
        ukuran: "XL",
        user_id: "9a1a315d-da0e-4764-9ff8-5d519cd9cb2e",
        is_urgent: true,
      },
    ];
  }

  const response = await api.get("/potong/permintaan");
  return response.data;
};

export const useGetPermintaan = () => {
  return useQuery({
    queryKey: ["permintaans"],
    queryFn: fetcher,
  });
};
