import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios";

type prosesProsesType = {
  kodeKain: string;
  jumlahHasil: number;
  idPemotong: string[];
};

type MutationParams = {
  id: string;
  data: prosesProsesType;
};

const use_mock = false;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const fetcher = async ({ id, data }: MutationParams) => {
  if (use_mock) {
    await delay(1000);
    console.log(`Mock Update proses ID ${id} dengan data:`, data);
    return { success: true };
  }

  // ✅ endpoint sesuai swagger
  const response = await api.put(`/potong/proses/${id}`, data);
  return response.data;
};

export const usePutProses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetcher,

    onSuccess: () => {
      // ✅ REFRESH DATA YANG TERKAIT
      queryClient.invalidateQueries({ queryKey: ["proses"] });
      queryClient.invalidateQueries({ queryKey: ["selesai"] });

      console.log("Data berhasil dipindah ke selesai");
    },

    onError: (error) => {
      console.log("Error PUT proses:", error);
    },
  });
};
