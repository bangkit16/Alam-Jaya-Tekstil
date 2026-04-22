"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import Pagination from "@/components/Pagination";
import useDebounce from "@/hooks/useDebounce";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const ROLE_OPTIONS = [
  "POTONG",
  "STOK_POTONG",
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

  const [loading, setLoading] = useState(false); // table
  const [actionLoading, setActionLoading] = useState(false); // submit/delete

  // 🔥 FETCH USER (FIX DOUBLE LOADING)
  const fetchUsers = async (isFromAction = false) => {
    try {
      if (!isFromAction) setLoading(true);

      const res = await api.get("/admin/list-user", {
        params: {
          page,
          search: debouncedSearch,
        },
      });

      const data = res.data?.data || res.data?.users || [];
      const metaData = res.data?.meta || null;

      setUsers(Array.isArray(data) ? data : []);
      setMeta(metaData);
    } catch (err) {
      console.log("ERROR GET USER:", err);
      setUsers([]);
    } finally {
      if (!isFromAction) setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, debouncedSearch]);

  // 🔥 SUBMIT
  const handleSubmit = async () => {
    if (
      !form.nama ||
      !form.noHandphone ||
      !form.username ||
      !form.password ||
      !form.role
    ) {
      return alert("Semua field wajib diisi");
    }

    try {
      setActionLoading(true);

      if (editId) {
        await api.put(`/admin/edit-user/${editId}`, form);
      } else {
        await api.post("/admin/add-user", form);
      }

      setForm({
        nama: "",
        noHandphone: "",
        username: "",
        password: "",
        role: "",
      });

      setEditId(null);

      await fetchUsers(true); // 🔥 FIX: tidak trigger loading table
    } catch (err) {
      console.log("ERROR SUBMIT:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // 🔥 DELETE
  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus user?")) return;

    try {
      setActionLoading(true);

      await api.delete(`/admin/delete-user/${id}`);

      await fetchUsers(true); // 🔥 FIX
    } catch (err) {
      console.log("ERROR DELETE:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // 🔥 EDIT
  const handleEdit = (user) => {
    setForm({
      nama: user.nama,
      noHandphone: user.noHandphone,
      username: user.username,
      password: "",
      role: user.role,
    });
    setEditId(user.id);
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Manajemen User</h2>

        <input
          placeholder="Search nama / username..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="bg-gray-100 border px-3 py-2 rounded-xl text-sm"
        />
      </div>

      {/* FORM */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 grid grid-cols-2 gap-2">
        <input
          placeholder="Nama"
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
          className="border px-3 py-2 rounded"
        />

        <input
          placeholder="No Handphone"
          value={form.noHandphone}
          onChange={(e) => setForm({ ...form, noHandphone: e.target.value })}
          className="border px-3 py-2 rounded"
        />

        <input
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="border px-3 py-2 rounded"
        />

        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border px-3 py-2 rounded"
        />

        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="border px-3 py-2 rounded col-span-2 bg-white"
        >
          <option value="">Pilih Role</option>

          {ROLE_OPTIONS.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>

        <button
          onClick={handleSubmit}
          disabled={actionLoading}
          className="col-span-2 bg-orange-500 text-white py-2 rounded"
        >
          {actionLoading ? "Menyimpan..." : editId ? "Update" : "Tambah User"}
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Nama</th>
              <th className="p-3">Username</th>
              <th className="p-3">Role</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4">
                  <div className="py-6 flex justify-center">
                    <LoadingSpinner />
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-3">{u.nama}</td>
                  <td className="p-3">{u.username}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(u)}
                      className="text-blue-500"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(u.id)}
                      disabled={actionLoading}
                      className="text-red-500"
                    >
                      {actionLoading ? "Hapus..." : "Hapus"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {meta && meta.totalPages > 1 && (
        <Pagination meta={meta} onPageChange={setPage} />
      )}

      {/* ACTION LOADING */}
      {actionLoading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}
