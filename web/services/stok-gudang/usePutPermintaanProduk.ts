import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// --- 1. Type Definitions ---

export interface PutPermintaanProdukPayload {
  idPenanggungJawab: string;
  idBox: string[];
}

export interface PutPermintaanProdukResponse {
  message: string;
  status: string;
}

// --- 2. Fetcher Function ---

/**
 * @param id - UUID dari permintaan produk yang akan diupdate
 * @param payload - Data body berupa idPenanggungJawabBox dan array idBox
 */
export const putPermintaanProduk = async (
  id: string,
  payload: PutPermintaanProdukPayload,
): Promise<PutPermintaanProdukResponse> => {
  if (use_mock) {
    await delay(800);
    return {
      message: "Stok potongan hasil QC berhasil masuk box (Mock)",
      status: "KIRIM_RESI",
    };
  }

  const response = await api.put<PutPermintaanProdukResponse>(
    `/stokgudang/permintaanproduk/${id}`,
    payload,
  );
  return response.data;
};

// --- 3. Exported Hook (Mutation) ---

export const usePutPermintaanProduk = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: PutPermintaanProdukPayload;
    }) => putPermintaanProduk(id, payload),

    onSuccess: (data) => {
      // Invalidate queries yang berhubungan dengan stok gudang agar data tetap fresh
      queryClient.invalidateQueries({ queryKey: ["permintaan-stok"] });
      queryClient.invalidateQueries({ queryKey: ["databox-stok"] });

      // Alert sesuai instruksi arsitektur kode
      alert(data.message);
    },

    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        "Terjadi kesalahan saat mengupdate data";
      console.error("Mutation Error:", error);
      alert(errorMessage);
    },
  });
};
