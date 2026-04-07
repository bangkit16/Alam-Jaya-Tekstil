import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios"; // Axios instance kamu

type prosesProsesType = {
  kode_potongan: string;
  jumlah_lolos: number;
  pengecek: string;
};

type MutationParams = {
  id: string; // ID yang diambil dari URL atau state luar
  data: prosesProsesType; // Data dari form
};

const use_mock = false;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const fetcher = async ({ id, data }: MutationParams) => {
  if (use_mock) {
    await delay(1000);
    console.log(`Mock Update proses ID ${id} dengan data:`, data);
    return { success: true };
  }

  const response = await api.put(`/potong/proses/${id}`, data);
  return response.data;
};

export const usePutProses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetcher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prosess"] });
      queryClient.invalidateQueries({ queryKey: ["stoks"] });
      console.log("Data proses berhasil disimpan");
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
