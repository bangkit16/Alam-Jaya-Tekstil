"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import Pagination from "@/components/Pagination";
import useDebounce from "@/hooks/useDebounce";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const ROLE_OPTIONS = [
  "POTONG",
  "STOK_POTONG",
  "STOK_RESI",
  "KURIR",
  "JAHIT",
  "QC",
  "STOK_GUDANG",
  "SUPERADMIN",
  "RESI",
  "PRINT",
];

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [form, setForm] = useState({
    nama: "",
    noHandphone: "",
    username: "",
    password: "",
    role: "",
  });

  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = async (isFromAction = false) => {
    try {
      if (!isFromAction) setLoading(true);

      const res = await api.get("/admin/list-user", {
        params: { page, search: debouncedSearch },
      });

      setUsers(res.data?.data || res.data?.users || []);
      setMeta(res.data?.meta || null);
    } catch (err) {
      console.log(err);
      setUsers([]);
    } finally {
      if (!isFromAction) setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, debouncedSearch]);

  const resetForm = () => {
    setForm({
      nama: "",
      noHandphone: "",
      username: "",
      password: "",
      role: "",
    });
    setEditId(null);
  };

  const handleSubmit = async () => {
    if (
      !form.nama ||
      !form.noHandphone ||
      !form.username ||
      !form.password ||
      !form.role
    )
      return alert("Semua field wajib diisi");

    try {
      setActionLoading(true);

      if (editId) {
        await api.put(`/admin/edit-user/${editId}`, form);
      } else {
        await api.post("/admin/add-user", form);
      }

      resetForm();
      setShowModal(false);
      await fetchUsers(true);
    } catch (err) {
      console.log(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus user?")) return;

    try {
      setActionLoading(true);
      await api.delete(`/admin/delete-user/${id}`);
      await fetchUsers(true);
    } catch (err) {
      console.log(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (user) => {
    setForm({
      nama: user.nama,
      noHandphone: user.noHandphone,
      username: user.username,
      password: "",
      role: user.role,
    });
    setEditId(user.id);
    setShowModal(true);
  };

  const roleColor = (role) => {
    switch (role) {
      case "SUPERADMIN":
        return "bg-red-100 text-red-600";
      case "QC":
        return "bg-purple-100 text-purple-600";
      case "KURIR":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="p-4">
      {/* HEADER */}
      <div className="flex flex-col gap-3 mb-4">
        <h2 className="text-xl font-semibold">Manajemen User</h2>

        {/* SEARCH + BUTTON */}
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          {/* SEARCH */}
          <div className="relative flex-1">
            <input
              placeholder="Cari nama / username..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 
        focus:outline-none focus:ring-2 focus:ring-orange-400 
        focus:border-orange-400 text-sm shadow-sm"
            />

            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>

          {/* BUTTON ADD USER */}
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl text-sm whitespace-nowrap transition"
          >
            + User
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Nama</th>
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="py-6 text-center">
                  <LoadingSpinner />
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-400">
                  Tidak ada user
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{u.nama}</td>
                  <td className="p-3">{u.username}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${roleColor(
                        u.role,
                      )}`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(u)}
                      className="text-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="text-red-500"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {meta && meta.totalPages > 1 && (
        <Pagination meta={meta} onPageChange={setPage} />
      )}

      {/* MODAL FORM */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl animate-fadeIn">
            {/* HEADER */}
            <div className="flex justify-between items-center px-5 py-4 border-b">
              <h3 className="font-semibold text-gray-700">
                {editId ? "Edit User" : "Tambah User"}
              </h3>

              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >
                ✕
              </button>
            </div>

            {/* BODY */}
            <div className="p-5 space-y-3">
              <input
                placeholder="Nama"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                className="border px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-orange-400"
              />

              <input
                placeholder="No HP"
                value={form.noHandphone}
                onChange={(e) =>
                  setForm({ ...form, noHandphone: e.target.value })
                }
                className="border px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-orange-400"
              />

              <input
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="border px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-orange-400"
              />

              <input
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="border px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-orange-400"
              />

              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="border px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-orange-400"
              >
                <option value="">Pilih Role</option>
                {ROLE_OPTIONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* FOOTER */}
            <div className="flex gap-2 p-5 border-t">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition"
              >
                {actionLoading ? "Menyimpan..." : editId ? "Update" : "Tambah"}
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border rounded-lg hover:bg-gray-100"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {actionLoading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}
