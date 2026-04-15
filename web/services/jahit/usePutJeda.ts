import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export interface JedaResponse {
  message: string;
  statusJahit: string;
  status: string;
}

const putJeda = async (id: string): Promise<JedaResponse> => {
  if (use_mock) {
    await delay(500);
    return {
      message: "Potongan sedang dijeda",
      statusJahit: "JEDA",
      status: "JEDA_JAHIT",
    };
  }
  const response = await api.put<JedaResponse>(`/penjahit/proses/jeda/${id}`);
  return response.data;
};

export const usePutJeda = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putJeda,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["penjahit", "proses"] });
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Gagal menjeda pekerjaan");
    },
  });
};
