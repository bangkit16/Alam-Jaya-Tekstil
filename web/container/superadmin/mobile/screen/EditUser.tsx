"use client";

import { useState, useEffect } from "react";
import { usePutUser } from "@/services/superadmin/usePutUser";

export default function EditUser({ setScreen, selectedUser }: any) {
  const [nama, setNama] = useState("");
  const [username, setUsername] = useState("");
  const [noHandphone, setNoHandphone] = useState("");
  const [role, setRole] = useState("");

  const { mutate, isPending } = usePutUser();

  useEffect(() => {
    if (selectedUser) {
      setNama(selectedUser.nama);
      setUsername(selectedUser.username);
      setNoHandphone(selectedUser.noHandphone);
      setRole(selectedUser.role);
    }
  }, [selectedUser]);

  const handleSubmit = () => {
    mutate(
      {
        id: selectedUser.id,
        data: {
          nama,
          username,
          noHandphone,
          role,
        },
      },
      {
        onSuccess: () => {
          setScreen("userManagement");
        },
      },
    );
  };

  return (
    <div className="p-4 space-y-3">
      <h1 className="text-lg font-semibold">Edit User</h1>

      <input
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        className="w-full border p-2 rounded-xl"
      />
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full border p-2 rounded-xl"
      />
      <input
        value={noHandphone}
        onChange={(e) => setNoHandphone(e.target.value)}
        className="w-full border p-2 rounded-xl"
      />
      <input
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full border p-2 rounded-xl"
      />

      <button
        onClick={handleSubmit}
        disabled={isPending}
        className="w-full bg-orange-500 text-white py-2 rounded-xl"
      >
        {isPending ? "Loading..." : "Update"}
      </button>

      <button
        onClick={() => setScreen("userManagement")}
        className="w-full bg-gray-200 py-2 rounded-xl"
      >
        Kembali
      </button>
    </div>
  );
}
