import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";

const use_mock = false;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

type Payload = {
  nama: string;
  noHandphone: string;
  username: string;
  password?: string; // 🔥 optional saat edit
  role: string;
};

export const usePutUser = () => {
  const queryClient = useQueryClient();

  const putter = async ({ id, data }: { id: string; data: Payload }) => {
    if (use_mock) {
      await delay(1000);

      // 🔥 DUMMY RESPONSE
      return {
        message: "User berhasil diupdate (mock)",
        data: {
          id,
          ...data,
        },
      };
    }

    const response = await api.put(`/admin/edit-user/${id}`, data);
    return response.data;
  };

  return useMutation({
    mutationFn: putter,

    onSuccess: () => {
      // 🔥 refresh users
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
