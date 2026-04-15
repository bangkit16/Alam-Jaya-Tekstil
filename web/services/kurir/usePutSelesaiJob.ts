import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios";

const use_mock = false;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// --- Type Definitions ---
interface SelesaiJobResponse {
  message: string;
  status: string;
}

// --- Fetcher Function ---
// Ubah argumen langsung menjadi string 'id' agar sesuai keinginanmu
const putSelesaiJob = async (id: string): Promise<SelesaiJobResponse> => {
  if (use_mock) {
    await delay(800);
    return {
      message: "Job telah diselesaikan! (Mock)",
      status: "SELESAI",
    };
  }

  const { data } = await api.put<SelesaiJobResponse>(`/kurir/proses/${id}`);
  return data;
};

// --- Exported Hook ---
export const usePutSelesaiJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => putSelesaiJob(id), // Menerima string ID langsung
    onSuccess: (data) => {
      // Invalidate target yang berkaitan
      queryClient.invalidateQueries({ queryKey: ["kurir", "proses"] });
      queryClient.invalidateQueries({ queryKey: ["kurir", "selesai"] });

      alert(data.message);
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Gagal menyelesaikan job";
      console.error("Mutation Error:", error);
      alert(msg);
    },
  });
};
