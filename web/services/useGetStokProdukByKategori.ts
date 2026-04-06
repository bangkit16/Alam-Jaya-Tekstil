import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/axios";

const use_mock = false;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const fetcher = async (slug: string | null) => {
  if (use_mock) {
    await delay(1000);
    return [
      {
        id_stok_potong: "d4ddcffd-014a-4b98-9734-25c09c9df160",
        id_permintaan: "5cc47ddb-54b3-4bc8-a7e5-131e8ed7a591",
        nama_produk: "Jaket Kulit Vintage",
        kode_kain: "",
        kode_potongan: "",
        pengecek: "",
        jumlah_hasil: 0,
        ukuran: "M",
      },
      {
        id_stok_potong: "be291d33-3eab-4840-bf91-fef891d9936a",
        id_permintaan: "a5601177-c874-469c-b937-9e69a824c16d",
        nama_produk: "Kaos Polos Cotton Combed",
        kode_kain: "",
        kode_potongan: "",
        pengecek: "",
        jumlah_hasil: 0,
        ukuran: "L",
      },
    ];
  }

  const response = await api.get(`/potong/stokpotong/${slug}`);
  return response.data;
};

export const useGetStokProdukByKategori = (slug: string | null) => {
  return useQuery({
    queryKey: ["stoks", slug],
    queryFn: () => fetcher(slug),
    enabled: !!slug,
  });
};
