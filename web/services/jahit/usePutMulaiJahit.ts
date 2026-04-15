import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Type Definitions
interface MulaiJahitResponse {
  message: string;
  status: string;
}

// Fetcher Function
const putMulaiJahit = async (
  idProsesStokPotong: string,
): Promise<MulaiJahitResponse> => {
  if (use_mock) {
    await delay(800);
    return {
      message: "Pekerjaan menjahit dimulai (Mock)",
      status: "PROSES_JAHIT",
    };
  }

  const response = await api.put<MulaiJahitResponse>(
    `/penjahit/menunggu/${idProsesStokPotong}`,
  );
  return response.data;
};

// Exported Hook
export const usePutMulaiJahit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => putMulaiJahit(id),
    onSuccess: (data) => {
      // Refresh list menunggu agar data yang sudah diproses hilang dari daftar
      queryClient.invalidateQueries({ queryKey: ["penjahit", "menunggu"] });
      queryClient.invalidateQueries({ queryKey: ["penjahit", "proses"] });
      console.log(data.message);
      alert("Berhasil: Pekerjaan telah dimulai.");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Gagal memulai pekerjaan.";
      console.error("Error starting work:", msg);
      alert(msg);
    },
  });
};
