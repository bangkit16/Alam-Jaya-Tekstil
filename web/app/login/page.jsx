"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";
import { api } from "@/lib/axios";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [roleUI, setRoleUI] = useState("");
  const { session, setSession } = useAuthStore();

  const redirectMap = {
    RESI: "/resi",
    STOK_RESI: "/stok-resi",
    POTONG: "/potong",
    STOK_POTONG: "/stok-potong",
    STOK_GUDANG: "/stok-gudang",
    JAHIT: "/penjahit",
    QC: "/qc",
    KURIR: "/kurir",
    SUPERADMIN: "/superadmin",
  };

  // 🔥 normalize lebih kebal (handle stok-resi, stok_resi, dll)
  const normalizeRole = (role) => {
    if (!role) return "";

    const cleaned = role.toLowerCase().replace(/[-_\s]/g, "");

    const map = {
      stokgudang: "STOK_GUDANG",
      stokpotong: "STOK_POTONG",
      stokresi: "STOK_RESI",
      superadmin: "SUPERADMIN",
    };

    return map[cleaned] || role.toUpperCase();
  };

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Username dan password wajib diisi");
      return;
    }

    try {
      const response = await api.post("auth/login", { username, password });

      const data = await response.data;

      if (!data?.accessToken) {
        throw new Error("Login gagal / token tidak ada");
      }

      console.log("ROLE BACKEND:", data.user.role);

      // simpan ke localStorage (tetap)
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("role", data.user.role.toLowerCase());
      localStorage.setItem("user", JSON.stringify(data.user));

      // 🔥 tambahan cookie (biar middleware gak redirect balik login)
      document.cookie = `accessToken=${data.accessToken}; path=/`;

      setSession({
        session: {
          id: data.user.id,
          user: data.user,
          createdAt: new Date().toISOString(),
        },
      });

      const role = normalizeRole(data.user.role);

      console.log("ROLE NORMALIZED:", role);

      if (!redirectMap[role]) {
        console.warn("ROLE TIDAK ADA DI MAP:", role);
      }

      router.push(redirectMap[role] || "/");
    } catch (error) {
      console.log("LOGIN ERROR:", error);
      alert("Login gagal, cek username / password atau server");
    }
  };

  const roles = [
    "resi",
    "stokresi",
    "potong",
    "stokpotong",
    "stokgudang",
    "jahit",
    "qc",
    "kurir",
  ].sort((a, b) => a.localeCompare(b));

  return (
    <div className="min-h-screen justify-center flex bg-linear-to-br from-gray-200 via-gray-300 to-gray-400">
      {/* LOGIN */}
      <div className="flex w-full md:w-1/2 items-center justify-center px-4">
        <div className="w-full max-w-sm md:max-w-md bg-white rounded-3xl shadow-2xl p-6 md:p-8">
          {/* HEADER */}
          <div className="mb-6">
            <Image
              src="/LOGO ALAM JAYA.jpeg"
              alt="Logo"
              width={250}
              height={100}
              priority
              className="mx-auto mb-6 h-auto w-auto"
              onClick={() => router.push("/")}
            />
          </div>

          {/* ROLE DROPDOWN */}
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-2">OPERATION ROLE</p>

            <div className="relative">
              <div className="flex items-center bg-gray-100 rounded-xl px-4 py-3 pr-12 focus-within:ring-2 focus-within:ring-orange-400">
                <span className="mr-3 text-gray-400">🧩</span>

                <div className="relative w-full">
                  <select
                    value={roleUI}
                    onChange={(e) => {
                      setRoleUI(e.target.value);
                      setUsername(e.target.value);
                    }}
                    className={`w-full bg-transparent pr-12 pl-1 text-sm outline-none appearance-none ${
                      !roleUI ? "text-gray-400" : "text-gray-700"
                    }`}
                  >
                    <option value="" disabled hidden>
                      Pilih
                    </option>

                    {roles.map((role) => (
                      <option key={role} value={role} className="py-2 text-sm">
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ARROW */}
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                ▼
              </div>
            </div>
          </div>

          {/* USERNAME */}
          <div className="mb-4">
            <div className="flex items-center bg-gray-100 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-orange-400">
              <span className="mr-3 text-gray-400">📧</span>
              <input
                type="text"
                value={username}
                placeholder="Username"
                className="bg-transparent w-full outline-none text-gray-800 text-sm"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="mb-5">
            <div className="flex items-center bg-gray-100 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-orange-400">
              <span className="mr-3 text-gray-400">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Password"
                className="bg-transparent w-full outline-none text-gray-800 text-sm"
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* FORGOT */}
          <div className="text-right text-xs text-orange-500 mb-6 cursor-pointer hover:underline">
            Forgot Password?
          </div>

          {/* BUTTON */}
          <button
            onClick={handleLogin}
            className="w-full bg-linear-to-r from-orange-400 to-amber-500 text-white py-3 rounded-xl text-sm font-semibold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition"
          >
            Sign In →
          </button>

          {/* FOOTER */}
          <div className="mt-6 bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-600 font-semibold">
              Production Management System
            </p>
            <p className="text-[11px] text-gray-500 mt-1 leading-relaxed"></p>
          </div>
        </div>
      </div>
    </div>
  );
}
