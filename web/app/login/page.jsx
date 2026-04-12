"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginPage() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [roleUI, setRoleUI] = useState("");
  const { setSession } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async () => {
    console.log("TRY LOGIN:", username, password);

    try {
      const response = await fetch("https://api-alam.vercel.app/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("role", data.user.role.toLowerCase());

        setSession({
          session: {
            id: data.user.id,
            user: data.user,
            createdAt: new Date().toISOString(),
          },
        });

        const redirectMap = {
          RESI: "/resi",
          POTONG: "/potong",
          STOK_POTONG: "/stok-potong",
          STOK_GUDANG: "/stok-gudang",
          JAHIT: "/jahit",
          QC: "/qc",
          KURIR: "/kurir",
        };

        router.push(redirectMap[data.user.role] || "/");
        return;
      }

      throw new Error("Server response not OK");
    } catch (error) {
      console.log("FALLBACK LOGIN");

      const dummyUsers = {
        resi: "RESI",
        potong: "POTONG",
        stokpotong: "STOK_POTONG",
        stokgudang: "STOK_GUDANG",
        jahit: "JAHIT",
        qc: "QC",
        kurir: "KURIR",
      };

      if (password === "123" && dummyUsers[username]) {
        const role = dummyUsers[username];

        localStorage.setItem("accessToken", "dummy-token");
        localStorage.setItem("role", role.toLowerCase());

        setSession({
          session: {
            id: "dummy-id",
            user: {
              id: "dummy-id",
              name: username,
              role: role.toLowerCase(),
              email: `${username}@dummy.com`,
            },
            createdAt: new Date().toISOString(),
          },
        });

        setTimeout(() => {
          switch (role) {
            case "RESI":
              router.push("/resi");
              break;
            case "POTONG":
              router.push("/potong");
              break;
            case "STOK_POTONG":
              router.push("/stok-potong");
              break;
            case "STOK_GUDANG":
              router.push("/stok-gudang");
              break;
            case "JAHIT":
              router.push("/penjahit");
              break;
            case "QC":
              router.push("/qc");
              break;
            case "KURIR":
              router.push("/kurir");
              break;
          }
        }, 100);
      } else {
        alert("Login gagal");
      }
    }
  };

  if (!mounted) return null;

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
    <div className="min-h-screen flex bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400">
      {/* LEFT */}
      <div className="hidden md:flex flex-col justify-center w-1/2 px-16">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            Textile System
          </h1>
          <p className="text-gray-600">
            Manage your workflow, stock, and production in one place.
          </p>

          <div className="mt-8 bg-white rounded-2xl p-4 shadow-md">
            <p className="text-sm text-gray-500">System Status</p>
            <p className="text-lg font-semibold text-green-500">● Online</p>
          </div>
        </div>
      </div>

      {/* LOGIN */}
      <div className="flex w-full md:w-1/2 items-center justify-center px-4">
        <div className="w-full max-w-sm md:max-w-md bg-white rounded-3xl shadow-2xl p-6 md:p-8">
          {/* HEADER */}
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              Alam Jaya Tekstil 👋
            </h2>
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
                {mounted &&
                  (showPassword ? <EyeOff size={18} /> : <Eye size={18} />)}
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
            className="w-full bg-gradient-to-r from-orange-400 to-amber-500 text-white py-3 rounded-xl text-sm font-semibold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition"
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
