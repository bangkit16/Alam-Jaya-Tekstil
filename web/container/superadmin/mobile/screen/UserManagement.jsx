"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Package } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import useDebounce from "@/hooks/useDebounce";

export default function UserManagement({ setScreen }) {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/list-user", {
        params: {
          page,
          search: debouncedSearch,
          limit: 4,
        },
      });

      setUsers(res.data?.data || res.data?.users || []);
      setMeta(res.data?.meta || null);
    } catch (err) {
      console.log(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, debouncedSearch]);

  const roleColor = (role) => {
    switch (role) {
      case "SUPERADMIN":
        return "bg-red-100 text-red-600";
      case "QC":
        return "bg-purple-100 text-purple-600";
      case "KURIR":
        return "bg-blue-100 text-blue-600";
      case "JAHIT":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* HEADER */}
      <div className="mx-4 mt-4 mb-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-2xl p-4 shadow-md">
        <p className="text-xs opacity-90">Manajemen</p>
        <p className="font-semibold text-sm">User Sistem</p>
      </div>

      {/* SEARCH + BUTTON */}
      <div className="px-4 mb-3 space-y-2">
        <input
          placeholder="Cari user..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full px-4 py-2 rounded-xl border text-sm focus:ring-2 focus:ring-orange-400"
        />

        {/* 🔥 TAMBAH USER (PINDAHAN DARI FAB) */}
        <button
          onClick={() => setScreen("addUser")}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl text-sm font-medium transition"
        >
          + Tambah User
        </button>
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-auto px-4 space-y-3 pb-24">
        {loading ? (
          <div className="flex justify-center py-10">
            <LoadingSpinner />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <div className="bg-orange-100 text-orange-500 p-4 rounded-full mb-4">
              <Package size={28} />
            </div>
            <p className="font-semibold text-gray-500 mb-1">Tidak ada user</p>
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-sm text-gray-800">
                    {user.nama}
                  </p>
                  <p className="text-xs text-gray-400">{user.username}</p>

                  <span
                    className={`inline-block mt-1 text-[10px] px-2 py-1 rounded-full ${roleColor(
                      user.role,
                    )}`}
                  >
                    {user.role}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setScreen("editUser", user)}
                    className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setScreen("deleteUser", user)}
                    className="text-xs px-3 py-1 rounded-full bg-red-50 text-red-500"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        {/* PAGINATION */}
        {meta && meta.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 pt-4">
            <button
              disabled={!meta.prevPage}
              onClick={() => setPage(meta.prevPage)}
              className="px-3 py-1 text-xs bg-gray-100 rounded disabled:opacity-40"
            >
              Prev
            </button>

            <span className="text-xs text-gray-500">
              {meta.currentPage} / {meta.totalPages}
            </span>

            <button
              disabled={!meta.nextPage}
              onClick={() => setPage(meta.nextPage)}
              className="px-3 py-1 text-xs bg-gray-100 rounded disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* BACK */}
      <div className="p-4 border-t bg-white">
        <button
          onClick={() => setScreen("home")}
          className="w-full py-3 rounded-xl bg-gray-100 text-gray-700 text-sm"
        >
          ← Kembali
        </button>
      </div>
    </div>
  );
}
