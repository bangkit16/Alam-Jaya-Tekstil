"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { useGetPermintaan } from "@/services/potong/useGetPermintaan";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginPage() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [roleUI, setRoleUI] = useState("resi");
  const { session, setSession } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async () => {
    console.log("TRY LOGIN:", username, password);

    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();

        console.log("SERVER LOGIN SUCCESS:", data);

        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("role", data.user.role.toLowerCase());

        setSession({
          session: {
            id: data.user.id, // atau session id dari backend
            user: data.user,
            createdAt: new Date().toISOString(),
          },
        });

        const redirectMap = {
          RESI: "/resi",
          ADMIN: "/admin",
          POTONG: "/potong",
          STOK_POTONG: "/stok-potong",
          JAHIT: "/jahit",
          QC: "/qc",
          KURIR: "/kurir",
        };

        router.push(redirectMap[data.user.role] || "/");

        return; // ⛔ STOP kalau server berhasil
      }

      throw new Error("Server response not OK");
    } catch (error) {
      console.error("Error logging in:", error);
      console.log("SERVER FAILED → FALLBACK TO DUMMY LOGIN");

      // =========================
      // 🧪 DUMMY LOGIN (fallback)
      // =========================
      const dummyUsers = {
        resi: "RESI",
        admin: "ADMIN",
        potong: "POTONG",
        stokpotong: "STOK_POTONG",
        jahit: "JAHIT",
        qc: "QC",
        kurir: "KURIR",
      };

      if (password === "123" && dummyUsers[username]) {
        const role = dummyUsers[username];

        localStorage.setItem("accessToken", "dummy-token");
        localStorage.setItem("role", role.toLowerCase());

        // 🔥 WAJIB: SET SESSION
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

        console.log("DUMMY LOGIN SUCCESS:", role);

        setTimeout(() => {
          switch (role) {
            case "RESI":
              router.push("/resi");
              break;
            case "ADMIN":
              router.push("/admin");
              break;
            case "POTONG":
              router.push("/potong");
              break;
            case "STOK_POTONG":
              router.push("/stok-potong");
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
        }, 100); // 🔥 anti bug
      } else {
        alert("Login gagal (dummy / server)");
      }
    }
  };

  if (!mounted) return null;

  const roles = [
    "resi",
    "admin",
    "potong",
    "stokpotong",
    "jahit",
    "qc",
    "kurir",
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400">
      {/* LEFT DESKTOP */}
      <div className="hidden md:flex flex-col justify-center w-1/2 px-16">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            Textile System
          </h1>
          <p className="text-gray-600">
            Manage your workflow, stock, and production in one place.
          </p>

          {/* decorative card */}
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
              Welcome Back 👋
            </h2>
            <p className="text-xs md:text-sm text-gray-400">
              Login to continue
            </p>
          </div>

          {/* ROLE */}
          <div className="mb-4">
            <p className="text-[10px] md:text-xs text-gray-400 mb-2">
              OPERATION ROLE
            </p>

            <div className="grid grid-cols-3 gap-2">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setRoleUI(role);
                    setUsername(role);
                  }}
                  className={`py-1.5 rounded-full text-xs text-center transition ${
                    roleUI === role
                      ? "bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* USERNAME */}
          <div className="mb-4">
            <div className="flex items-center bg-gray-100 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-orange-400">
              <span className="mr-2 text-gray-400">📧</span>
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
          <div className="mb-4">
            <div className="flex items-center bg-gray-100 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-orange-400">
              <span className="mr-2 text-gray-400">🔒</span>
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

          {/* FOOTER */}
          <div className="mt-6 bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-[11px] text-gray-500">Demo Accounts</p>
            <p className="text-xs text-gray-700 font-medium mt-1">
              potong · admin · resi · jahit · qc
            </p>
            <p className="text-[11px] text-gray-400 mt-1">Password: 123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
