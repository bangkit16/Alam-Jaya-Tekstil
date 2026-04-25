import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

const use_mock = true;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const fetcher = async (id: string) => {
  if (use_mock) {
    await delay(800);

    return {
      idPermintaan: "07b21386-2457-46d0-9f79-4e664e077af2",
      namaBarang: "Singlet Biru",
      kategori: "Singlet",
      jenisPermintaan: "GUDANG",
      ukuran: "L",
      isUrgent: true,
      jumlah: 20,
      tanggalMasukPermintaan: "2026-04-17T08:37:57.462Z",

      logPermintaan: [
        {
          tanggal: "17 Apr 2026, 15:37",
          keterangan: "Permintaan potong berhasil dibuat",
          status: "MENUNGGU_POTONG",
        },
        {
          tanggal: "17 Apr 2026, 15:38",
          keterangan: "Permintaan potong sedang diproses oleh Divisi Potong",
          status: "PROSES_POTONG",
        },
        {
          tanggal: "17 Apr 2026, 16:35",
          keterangan:
            "Pekerjaan potong selesai oleh Rahmat Hidayat (0813xxxxxxx), hasil: 10 pcs",
          status: "MENUNGGU_STOK_POTONG",
        },
        {
          tanggal: "17 Apr 2026, 16:35",
          keterangan: "Menunggu pengecekan hasil potong di Divisi Stok Potong",
          status: "PROSES_STOK_POTONG",
        },
      ],
    };
  }

  const res = await api.get(`/stokresi/tracking/${id}`);

  const data = res.data?.data || res.data;

  // 🔥 NORMALIZE (biar aman di FE)
  return {
    idPermintaan: data?.idPermintaan,
    namaBarang: data?.namaBarang,
    kategori: data?.kategori,
    jenisPermintaan: data?.jenisPermintaan,
    ukuran: data?.ukuran,
    isUrgent: data?.isUrgent,
    jumlah: data?.jumlah || data?.jumlahMinta,
    tanggalMasukPermintaan: data?.tanggalMasukPermintaan,

    logPermintaan: Array.isArray(data?.logPermintaan) ? data.logPermintaan : [],
  };
};

export const useGetTracking = (id: string) => {
  return useQuery({
    queryKey: ["tracking", id],
    queryFn: () => fetcher(id),
    enabled: !!id,
  });
};
