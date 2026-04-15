import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export interface MulaiQCResponse {
  message: string;
  status: string;
}

const putMulaiQC = async (idQC: string): Promise<MulaiQCResponse> => {
  if (use_mock) {
    await delay(500);
    return {
      message: "Stok potongan berhasil di proses",
      status: "PROSES_QC",
    };
  }

  const response = await api.put<MulaiQCResponse>(`/qc/menunggu/${idQC}`);
  return response.data;
};

export const usePutMulaiQC = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: putMulaiQC,
    onSuccess: () => {
      // Refresh data antrean QC agar item yang sudah diproses hilang dari list
      queryClient.invalidateQueries({ queryKey: ["qc", "menunggu"] });
      // Kamu juga bisa meng-invalidate query "qc proses" jika sudah ada halamannya
      queryClient.invalidateQueries({ queryKey: ["qc", "proses"] });
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Gagal memulai proses QC.");
    },
  });
};
