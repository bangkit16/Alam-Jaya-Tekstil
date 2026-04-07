import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const fetcher = async () => {
  if (use_mock) {
    await delay(1000);
    return [
      {
        id_stok_potong: "1892107f-5a30-4994-bddf-095ccc885d52",
        id_permintaan: "ae6074b2-9606-4fc5-93a6-649aa008353c",
        ukuran: "M",
        is_urgent: false,
        nama_produk: "Hoodie Jumper",
        jumlah_lolos: 48,
        jumlah_permintaan: 50,
        kode_potongan: "CUT-HJ-001",
        kode_kain: "COTTON-FLEECE-BLK",
        pengecek: "Andi",
        penjahit: "budi",
        admin: "susi",
        tanggal_kirim: "2025-05-20T07:30:00.000Z",
      },
      {
        id_stok_potong: "d4ddcffd-014a-4b98-9734-25c09c9df160",
        id_permintaan: "5cc47ddb-54b3-4bc8-a7e5-131e8ed7a591",
        ukuran: "L",
        is_urgent: true,
        nama_produk: "Jaket Kulit Vintage",
        jumlah_lolos: 25,
        jumlah_permintaan: 25,
        kode_potongan: "CUT-JKV-022",
        kode_kain: "LEATHER-PREM-BRN",
        pengecek: "Riko",
        penjahit: "Iwan",
        admin: "susi",
        tanggal_kirim: "2025-05-22T09:00:00.000Z",
      },
      {
        id_stok_potong: "72f1a9b8-c3d4-4e5f-8g9h-0123456789ab",
        id_permintaan: "9b8a7c6d-5e4f-3g2h-1i0j-k9l8m7n6o5p4",
        ukuran: "XL",
        is_urgent: false,
        nama_produk: "Kaos Polos Oversize",
        jumlah_lolos: 95,
        jumlah_permintaan: 100,
        kode_potongan: "CUT-KPO-105",
        kode_kain: "COMBED-30S-WHT",
        pengecek: "Santi",
        penjahit: "Joko",
        admin: "susi",
        tanggal_kirim: "2025-05-25T13:45:00.000Z",
      },
    ];
  }

  const response = await api.get("/potong/stokkirim");
  return response.data;
};

export const useGetStokKirim = () => {
  return useQuery({
    queryKey: ["stokkirims"],
    queryFn: fetcher,
  });
};
