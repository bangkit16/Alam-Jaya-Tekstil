import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";

const use_mock = false;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  const deleter = async (id: string) => {
    if (use_mock) {
      await delay(800);

      // 🔥 DUMMY RESPONSE (BIAR CONSISTENT)
      return {
        message: "User berhasil dihapus (mock)",
        id,
      };
    }

    const response = await api.delete(`/admin/delete-user/${id}`);
    return response.data;
  };

  return useMutation({
    mutationFn: deleter,

    onSuccess: () => {
      // 🔥 refresh data users
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
