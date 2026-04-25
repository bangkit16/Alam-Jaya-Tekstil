"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

const use_mock = true; // 🔥 ganti false kalau mau pakai API

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const fetcher = async (params?: any) => {
  if (use_mock) {
    await delay(800);

    // 🔥 DUMMY SESUAI RESPONSE API STOK RESI
    return [
      {
        idBox: "box-001",
        namaBox: "BOX A",
        namaPenanggungJawab: "Sari Wahyuni",
        kodeBox: "BOX-001",
        tanggalMasukGudang: "2026-04-20T10:20:30Z",
        stokPotongan: [
          {
            idQC: "qc-001",
            namaBarang: "Hoodie Green Black",
            ukuran: "L",
            jumlah: 20,
            tanggalSelesaiQC: "2026-04-20T09:00:00Z",
            kodeStokPotongan: "KAIN-123",
            isUrgent: true,
          },
          {
            idQC: "qc-002",
            namaBarang: "Hoodie Black",
            ukuran: "M",
            jumlah: 15,
            tanggalSelesaiQC: "2026-04-20T08:00:00Z",
            kodeStokPotongan: "KAIN-124",
            isUrgent: false,
          },
        ],
      },
      {
        idBox: "box-002",
        namaBox: "BOX B",
        namaPenanggungJawab: "Budi Santoso",
        kodeBox: "BOX-002",
        tanggalMasukGudang: "2026-04-21T11:00:00Z",
        stokPotongan: [
          {
            idQC: "qc-003",
            namaBarang: "Kaos Putih",
            ukuran: "XL",
            jumlah: 30,
            tanggalSelesaiQC: "2026-04-21T09:30:00Z",
            kodeStokPotongan: "KAIN-200",
            isUrgent: false,
          },
        ],
      },
    ];
  }

  const response = await api.get("/stokresi/databox", { params });

  const data = response.data?.data || response.data;

  return Array.isArray(data) ? data : [];
};

export const useGetDataBox = (params?: any) => {
  return useQuery({
    queryKey: ["data-box", params],
    queryFn: () => fetcher(params),
  });
};
