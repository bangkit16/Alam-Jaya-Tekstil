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
    POTONG: "/potong",
    STOK_POTONG: "/stok-potong",
    STOK_GUDANG: "/stok-gudang",
    JAHIT: "/penjahit",
    QC: "/qc",
    KURIR: "/kurir",
  };
  
  // const sessionLog = async () => {
  //   try {
  //     const response = await api.get("auth/session");
  //     const data = await response.data;
  //     // if (data) {
  //     //   setSession({
  //     //     session: {
  //     //       id: data.user.id,
  //     //       user: data.user,
  //     //       createdAt: new Date().toISOString(),
  //     //     },
  //     //   });
  //     // }
  //     if (data) router.push(redirectMap[data.user.role.toLowerCase()] || "/");
  //   } catch (error) {
  //     return;
  //     // router.push("/login");
  //   }
  // };

  // sessionLog();

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Username dan password wajib diisi");
      return;
    }

    try {
      const response = await api.post("auth/login", { username, password });

      const data = await response.data;

      // console.log(response.data);
      // return;
      if (!response) {
        throw new Error(data.message || "Login gagal");
      }

      // simpan token & role
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("role", data.user.role.toLowerCase());

      setSession({
        session: {
          id: data.user.id,
          user: data.user,
          createdAt: new Date().toISOString(),
        },
      });

      // redirect map (SUDAH pakai /penjahit)

      router.push(redirectMap[data.user.role.toUpperCase()] || "/");
    } catch (error) {
      console.log("LOGIN ERROR:", error);
      alert("Login gagal, cek username / password atau server");
    }
  };

  const roles = [
    "resi",
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
            {/* <h2 className="text-xl md:text-2xl text-center font-bold text-gray-800">
              Alam Jaya Tekstil 👋
            </h2> */}
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

          {/* FOOTER (UPDATED) */}
          <div className="mt-6 bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-600 font-semibold">
              Production Management System
            </p>
            <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
              {/* Sistem ini digunakan untuk mengelola alur produksi tekstil mulai
              dari resi, potong, jahit, QC, hingga distribusi barang secara
              terintegrasi dalam satu platform. */}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
