import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Type Definitions
export interface PutQCBody {
  idPengecek: string[];
  jumlahLolos: number;
  jumlahPermak: number;
  jumlahReject: number;
  jumlahTurunSize: number;
  jumlahKotor: number;
}

export interface PutQCResponse {
  message: string;
  status: string;
}

// Fetcher
const putQCProses = async ({
  idQC,
  body,
}: {
  idQC: string;
  body: PutQCBody;
}): Promise<PutQCResponse> => {
  if (use_mock) {
    await delay(800);
    return { message: "Mock: Berhasil simpan", status: "MASUK_BOX" };
  }
  const response = await api.put<PutQCResponse>(`/qc/proses/${idQC}`, body);
  return response.data;
};

// Hook
export const usePutQCProses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: putQCProses,
    onSuccess: (data) => {
      // Invalidate list agar data yang sudah di-QC hilang dari daftar "Proses"
      queryClient.invalidateQueries({ queryKey: ["qc", "proses"] });
      queryClient.invalidateQueries({ queryKey: ["qc", "masukbox"] });
      alert(data.message);
    },
    onError: (error) => {
      console.error(error);
      alert("Gagal memperbarui data QC");
    },
  });
};
