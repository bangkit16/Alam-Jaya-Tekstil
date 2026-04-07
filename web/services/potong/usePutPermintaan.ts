import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios"; // Axios instance kamu

type prosesPermintaanType = {
  kode_kain: string;
  pemotong: string;
  pengecek: string;
};

type MutationParams = {
  id: string; // ID yang diambil dari URL atau state luar
  data: prosesPermintaanType; // Data dari form
};

const use_mock = false;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const fetcher = async ({ id, data }: MutationParams) => {
  if (use_mock) {
    await delay(1000);
    console.log(`Mock Update ID ${id} dengan data:`, data);
    return { success: true };
  }

  const response = await api.put(`/potong/permintaan/${id}`, data);
  return response.data;
};

export const usePutPermintaan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetcher,
    // Kaidah Penting: Setelah sukses, beri tahu React Query agar ambil data terbaru (Refetch)
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permintaans"] });
      queryClient.invalidateQueries({ queryKey: ["prosess"] });
      // alert("Pesanan berhasil dibuat!");
      console.log("Data permintaan berhasil disimpan");
    },
    onError: (error) => {
      console.log(error);
      alert("Gagal menyimpan: " + error.message);
    },
  });
};
