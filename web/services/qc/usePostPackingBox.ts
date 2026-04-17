import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios";

// Type Definitions
export interface PackingBody {
  idPenanggungJawabBox: string[];
  namaBox: string;
  idQc: string[];
}

// Fetcher
const postPackingBox = async (body: PackingBody) => {
  const response = await api.post("/qc/masukbox", body);
  return response.data;
};

// Hook
export const usePostPackingBox = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postPackingBox,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["qc", "masukbox"] });
      queryClient.invalidateQueries({ queryKey: ["qc", "selesai"] });
      alert(data.message || "Berhasil melakukan packing!");
    },
    onError: (error: any) => {
      alert(error?.response?.data?.message || "Gagal melakukan packing");
    },
  });
};
