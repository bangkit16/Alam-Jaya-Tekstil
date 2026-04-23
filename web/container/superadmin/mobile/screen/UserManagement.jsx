"use client";

import { useGetUsers } from "@/services/superadmin/useGetUsers";

export default function UserManagement({ setScreen, handleLogout }) {
  const { data: users = [], isLoading } = useGetUsers();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-orange-50 p-4">
      <h1 className="text-xl font-semibold mb-4">Super Admin</h1>

      {/* CARD */}
      <div className="bg-white rounded-2xl shadow p-4 space-y-3">
        <button
          onClick={() => setScreen("addUser")}
          className="w-full px-4 py-3 rounded-xl bg-orange-500 text-white"
        >
          + Tambah User
        </button>

        {isLoading && <p>Loading...</p>}

        {!isLoading &&
          users.map((user) => (
            <div
              key={user.id}
              className="border rounded-xl p-3 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{user.nama}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={
                    () => setScreen("editUser", user) // kirim data
                  }
                  className="text-xs bg-gray-200 px-2 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => setScreen("deleteUser", user)}
                  className="text-xs bg-red-100 text-red-500 px-2 py-1 rounded"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 w-full bg-red-500 text-white py-3 rounded-xl"
      >
        Logout
      </button>
    </div>
  );
}
