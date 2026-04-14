import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Type Definitions
export interface PutBoxMasukPayload {
  idPenerimaBox: string;
}

export interface PutBoxMasukResponse {
  message: string;
  status: string;
}

// Fetcher Function
const updateBoxMasuk = async (params: {
  idBox: string;
  payload: PutBoxMasukPayload;
}): Promise<PutBoxMasukResponse> => {
  if (use_mock) {
    await delay(1000);
    return {
      message: "Stok potongan berhasil di proses (Mock)",
      status: "ACC_GUDANG",
    };
  }

  const response = await api.put<PutBoxMasukResponse>(
    `/stokgudang/boxmasuk/${params.idBox}`,
    params.payload,
  );
  return response.data;
};

// Exported Hook
export const usePutBoxMasuk = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBoxMasuk,
    onSuccess: (data) => {
      // Invalidate queries agar list Box Masuk terupdate otomatis
      queryClient.invalidateQueries({ queryKey: ["box-masuk"] });
      queryClient.invalidateQueries({ queryKey: ["databox-stok"] });

      console.log("Success:", data.message);
      alert("Berhasil: " + data.message);
    },
    onError: (error: any) => {
      const errorMsg =
        error.response?.data?.message || "Gagal memproses box masuk";
      console.error("Mutation Error:", errorMsg);
      alert("Error: " + errorMsg);
    },
  });
};
