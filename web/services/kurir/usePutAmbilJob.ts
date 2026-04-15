import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// --- Type Definitions ---
interface AmbilJobPayload {
  idProsesStokPotong: string;
  idKurir: string;
}

interface AmbilJobResponse {
  message: string;
  status: string;
}

// --- Fetcher Function ---
const putAmbilJob = async (
  payload: AmbilJobPayload,
): Promise<AmbilJobResponse> => {
  if (use_mock) {
    await delay(800);
    return {
      message: "Stok potongan berhasil di proses (Mock)",
      status: "PROSES_KURIR",
    };
  }

  const { data } = await api.put<AmbilJobResponse>(
    `/kurir/menunggu/${payload.idProsesStokPotong}`,
    { idKurir: payload.idKurir },
  );
  return data;
};

// --- Exported Hook ---
export const usePutAmbilJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: putAmbilJob,
    onSuccess: (data) => {
      // Invalidate query agar list 'menunggu' refresh otomatis
      queryClient.invalidateQueries({ queryKey: ["kurir", "menunggu"] });
      queryClient.invalidateQueries({ queryKey: ["kurir", "proses"] });
      alert(data.message);
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Gagal memproses job";
      console.error("Mutation Error:", error);
      alert(msg);
    },
  });
};
