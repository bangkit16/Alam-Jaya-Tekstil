import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export interface PutMintaPotongResponse {
  message: string;
  status: string;
}

const updateMintaPotong = async (
  idPermintaan: string,
): Promise<PutMintaPotongResponse> => {
  if (use_mock) {
    await delay(1000);
    return {
      message: "Permintaan berhasil dipindahkan ke potong (Mock)",
      status: "MENUNGGU_POTONG",
    };
  }

  const response = await api.put<PutMintaPotongResponse>(
    `/stokgudang/permintaan/${idPermintaan}`,
  );
  return response.data;
};

export const usePutMintaPotong = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMintaPotong,
    onSuccess: (data) => {
      // Refresh data list permintaan agar status berubah di UI
      queryClient.invalidateQueries({ queryKey: ["permintaan-potong"] });
      queryClient.invalidateQueries({ queryKey: ["permintaan-stok"] });
      queryClient.invalidateQueries({ queryKey: ["permintaans"] });
      alert(data.message);
    },
    onError: (error: any) => {
      const msg =
        error.response?.data?.message || "Gagal memproses permintaan potong";
      alert("Error: " + msg);
    },
  });
};
