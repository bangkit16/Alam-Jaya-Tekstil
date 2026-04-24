"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

const use_mock = true;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const fetcher = async (params?: any) => {
  if (use_mock) {
    await delay(800);

    return [
      {
        idPesanan: "psn-001",
        status: "BELUM_DIKERJAKAN",
        kodeResi: "SJX57325271",
        namaToko: "Fearless Apparel",
        isUrgent: true,
        totalDesign: 2,

        design: [
          {
            idDesign: "dsg-001",
            namaDesign: "Tengkorak",
            gambarDesign: "https://via.placeholder.com/100",
            kategoriDesign: "hoodie",
            ukuran: "XL",
            jumlah: 1,

            produk: {
              idProduk: "prd-001",
              namaProduk: "Hoodie Hitam",
              gambarProduk: "https://via.placeholder.com/100",
              kategoriProduk: "hoodie",
              ukuran: "XL",
              jumlah: 1,
            },
          },
          {
            idDesign: "dsg-002",
            namaDesign: "Street Skull",
            gambarDesign: "https://via.placeholder.com/100",
            kategoriDesign: "hoodie",
            ukuran: "L",
            jumlah: 1,

            produk: {
              idProduk: "prd-002",
              namaProduk: "Hoodie Abu",
              gambarProduk: "https://via.placeholder.com/100",
              kategoriProduk: "hoodie",
              ukuran: "L",
              jumlah: 1,
            },
          },
        ],
      },

      {
        idPesanan: "psn-002",
        status: "MENUNGGU_STOK",
        kodeResi: "SJX88888888",
        namaToko: "Urban Wear",
        isUrgent: false,
        totalDesign: 1,

        design: [
          {
            idDesign: "dsg-003",
            namaDesign: "Minimal Logo",
            gambarDesign: "https://via.placeholder.com/100",
            kategoriDesign: "kaos",
            ukuran: "M",
            jumlah: 2,

            produk: {
              idProduk: "prd-003",
              namaProduk: "Kaos Putih",
              gambarProduk: "https://via.placeholder.com/100",
              kategoriProduk: "kaos",
              ukuran: "M",
              jumlah: 2,
            },
          },
        ],
      },
    ];
  }

  const res = await api.get("/stokresi/pesanan", { params });

  const data = res.data?.data || res.data;

  // 🔥 NORMALIZE biar FE aman
  return Array.isArray(data)
    ? data.map((item: any) => ({
        idPesanan: item.idPesanan,
        status: item.status,
        kodeResi: item.kodeResi,
        namaToko: item.namaToko,
        isUrgent: item.isUrgent,
        totalDesign: item.totalDesign,

        design: Array.isArray(item.design)
          ? item.design.map((d: any) => ({
              idDesign: d.idDesign,
              namaDesign: d.namaDesign,
              gambarDesign: d.gambarDesign,
              kategoriDesign: d.kategoriDesign,
              ukuran: d.ukuran,
              jumlah: d.jumlah,

              produk: d.produk
                ? {
                    idProduk: d.produk.idProduk,
                    namaProduk: d.produk.namaProduk,
                    gambarProduk: d.produk.gambarProduk,
                    kategoriProduk: d.produk.kategoriProduk,
                    ukuran: d.produk.ukuran,
                    jumlah: d.produk.jumlah,
                  }
                : null,
            }))
          : [],
      }))
    : [];
};

export const useGetPesanan = (params?: any) => {
  return useQuery({
    queryKey: ["pesanan", params],
    queryFn: () => fetcher(params),
  });
};
