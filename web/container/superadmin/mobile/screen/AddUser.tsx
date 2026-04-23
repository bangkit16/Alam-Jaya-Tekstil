"use client";

import { useState } from "react";
import { usePostUser } from "@/services/superadmin/usePostUser";

export default function AddUser({ setScreen }: any) {
  const [nama, setNama] = useState("");
  const [username, setUsername] = useState("");
  const [noHandphone, setNoHandphone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const { mutate, isPending } = usePostUser();

  const handleSubmit = () => {
    mutate(
      {
        nama,
        username,
        noHandphone,
        password,
        role,
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
      <h1 className="text-lg font-semibold">Tambah User</h1>

      <input
        placeholder="Nama"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        className="w-full border p-2 rounded-xl"
      />

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full border p-2 rounded-xl"
      />

      <input
        placeholder="No Handphone"
        value={noHandphone}
        onChange={(e) => setNoHandphone(e.target.value)}
        className="w-full border p-2 rounded-xl"
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-2 rounded-xl"
      />

      <input
        placeholder="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full border p-2 rounded-xl"
      />

      <button
        onClick={handleSubmit}
        disabled={isPending}
        className="w-full bg-orange-500 text-white py-2 rounded-xl"
      >
        {isPending ? "Loading..." : "Simpan"}
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
