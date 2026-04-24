"use client";

import { useDeleteUser } from "@/services/superadmin/useDeleteUser";

export default function DeleteUser({ setScreen, selectedUser }: any) {
  const { mutate, isPending } = useDeleteUser();

  const handleDelete = () => {
    mutate(selectedUser.id, {
      onSuccess: () => {
        setScreen("userManagement");
      },
    });
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-red-500 font-semibold">Hapus User</h1>

      <p>Yakin hapus {selectedUser?.nama}?</p>

      <button
        onClick={handleDelete}
        disabled={isPending}
        className="w-full bg-red-500 text-white py-2 rounded-xl"
      >
        {isPending ? "Loading..." : "Hapus"}
      </button>

      <button
        onClick={() => setScreen("userManagement")}
        className="w-full bg-gray-200 py-2 rounded-xl"
      >
        Batal
      </button>
    </div>
  );
}
