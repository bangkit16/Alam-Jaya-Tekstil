import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export interface DikerjakanResponse {
  message: string;
  statusJahit: string;
  status: string;
}

const putDikerjakan = async (id: string): Promise<DikerjakanResponse> => {
  if (use_mock) {
    await delay(500);
    return {
      message: "Potongan sedang dijahit",
      statusJahit: "DIKERJAKAN",
      status: "PROSES_JAHIT",
    };
  }
  const response = await api.put<DikerjakanResponse>(
    `/penjahit/proses/dikerjakan/${id}`,
  );
  return response.data;
};

export const usePutDikerjakan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putDikerjakan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["penjahit", "proses"] });
    },
    onError: (error: any) => {
      alert(
        error.response?.data?.message || "Gagal mengubah status ke dikerjakan",
      );
    },
  });
};
