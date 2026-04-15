import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export interface SelesaiJahitPayload {
  id: string;
  jumlahSelesaiJahit: number;
  catatan?: string;
}

export interface SelesaiJahitResponse {
  message: string;
  status: string;
}

const putSelesaiJahit = async (
  payload: SelesaiJahitPayload,
): Promise<SelesaiJahitResponse> => {
  const { id, ...body } = payload;
  if (use_mock) {
    await delay(500);
    return {
      message: "Data jahit berhasil diselesaikan",
      status: "PROSES_KURIR",
    };
  }
  const response = await api.put<SelesaiJahitResponse>(
    `/penjahit/proses/${id}`,
    body,
  );
  return response.data;
};

export const usePutSelesaiJahit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putSelesaiJahit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["penjahit", "proses"] });
      queryClient.invalidateQueries({ queryKey: ["penjahit", "selesai"] });
      alert("Pekerjaan selesai dan diteruskan ke Kurir.");
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Gagal menyelesaikan pekerjaan");
    },
  });
};
