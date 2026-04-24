"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

const use_mock = true;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const fetcher = async () => {
  if (use_mock) {
    await delay(1000);

    return [
      {
        idBox: "box-001",
        namaBox: "BOX KAOS MERAH",
        namaPenanggungJawab: "Sari Wahyuni",
        kodeBox: "BOX-240420-A",
        tanggalMasukStok: "2026-04-20T12:29:40Z",
        stokPotongan: [
          {
            idQC: "qc-001",
            namaBarang: "Hoodie Putih Merah",
            ukuran: "L",
            jumlah: 12,
            tanggalSelesaiQC: "2026-04-20T12:10:04Z",
            kodeStokPotongan: "KAINBUS123",
            isUrgent: true,
          },
          {
            idQC: "qc-002",
            namaBarang: "Kaos Hitam",
            ukuran: "M",
            jumlah: 8,
            tanggalSelesaiQC: "2026-04-20T11:00:00Z",
            kodeStokPotongan: "KAINBUS124",
            isUrgent: false,
          },
        ],
      },
      {
        idBox: "box-002",
        namaBox: "BOX KAOS DAN SINGLET",
        namaPenanggungJawab: "Budi Santoso",
        kodeBox: "BOX-240420-B",
        tanggalMasukStok: "2026-04-21T09:15:00Z",
        stokPotongan: [
          {
            idQC: "qc-003",
            namaBarang: "Singlet Abu",
            ukuran: "XL",
            jumlah: 20,
            tanggalSelesaiQC: "2026-04-21T08:30:00Z",
            kodeStokPotongan: "KAINBUS125",
            isUrgent: false,
          },
        ],
      },
      {
        idBox: "box-003",
        namaBox: "BOX SWEATER",
        namaPenanggungJawab: "Ahmad Subarjo",
        kodeBox: "BOX-240420-C",
        tanggalMasukStok: "2026-04-22T10:00:00Z",
        stokPotongan: [
          {
            idQC: "qc-004",
            namaBarang: "Sweater Navy",
            ukuran: "S",
            jumlah: 5,
            tanggalSelesaiQC: "2026-04-22T09:30:00Z",
            kodeStokPotongan: "KAINBUS126",
            isUrgent: true,
          },
        ],
      },
    ];
  }

  const response = await api.get("/stokresi/boxmasuk");

  const data = response.data?.data || response.data;

  return Array.isArray(data) ? data : [];
};

export const useGetBoxMasuk = () => {
  return useQuery({
    queryKey: ["box-masuk"],
    queryFn: fetcher,
  });
};
