// usePutTerimaBox.ts
import { api } from "@/lib/axios";

export const putTerimaBox = async (idBox: string) => {
  const res = await api.put(`/stokresi/boxmasuk/${idBox}`);
  return res.data;
};
