import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";

const use_mock = false;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

type Payload = {
  nama: string;
  noHandphone: string;
  username: string;
  password: string;
  role: string;
};

export const usePostUser = () => {
  const queryClient = useQueryClient();

  const poster = async (payload: Payload) => {
    if (use_mock) {
      await delay(1000);

      // 🔥 DUMMY RESPONSE (SESUAI API)
      return {
        message: "User berhasil ditambahkan (mock)",
        data: {
          id: Date.now().toString(),
          ...payload,
        },
      };
    }

    const response = await api.post("/admin/add-user", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: poster,

    onSuccess: () => {
      // 🔥 refresh list user
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
