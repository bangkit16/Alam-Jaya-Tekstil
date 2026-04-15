import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios";

export interface PostMintaPotongPayload {
  namaBarang: string;
  kategori: string;
  ukuran: string;
  isUrgent: boolean;
  jumlahMinta: number;
}

export interface PostMintaPotongResponse {
  message: string;
  status: string;
}

const postMintaPotong = async (
  payload: PostMintaPotongPayload,
): Promise<PostMintaPotongResponse> => {
  const response = await api.post<PostMintaPotongResponse>(
    "/stokgudang/permintaanpotong",
    payload,
  );
  return response.data;
};

export const usePostMintaPotong = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postMintaPotong,
    onSuccess: (data) => {
      // Refresh list agar data yang baru dibuat muncul
      queryClient.invalidateQueries({ queryKey: ["permintaan-potong"] });
      alert(data.message);
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Gagal mengirim permintaan";
      alert("Error: " + msg);
    },
  });
};
