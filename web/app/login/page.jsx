"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { useGetPermintaan } from "@/services/useGetPermintaan";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginPage() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [roleUI, setRoleUI] = useState("resi");
  // const { session } = useSession();

  const { data, isLoading } = useGetPermintaan();
  const { session, setSession, clearSession } = useAuthStore();

  console.log(data);

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
        localStorage.setItem("role", data.user.role);

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
          POTONG: "/dashboard",
          JAHIT: "/jahit",
          QC: "/qc",
        };

        router.push(redirectMap[data.user.role] || "/");

        return; // ⛔ STOP kalau server berhasil
      }

      throw new Error("Server response not OK");
    } catch (error) {
      console.log("SERVER FAILED → FALLBACK TO DUMMY LOGIN");

      // =========================
      // 🧪 DUMMY LOGIN (fallback)
      // =========================
      const dummyUsers = {
        resi: "RESI",
        admin: "ADMIN",
        potong: "POTONG",
        jahit: "JAHIT",
        qc: "QC",
      };

      if (password === "123" && dummyUsers[username]) {
        const role = dummyUsers[username];

        localStorage.setItem("accessToken", "dummy-token");
        localStorage.setItem("role", role.toLowerCase());

        console.log("DUMMY LOGIN SUCCESS:", role);

        switch (role) {
          case "RESI":
            router.push("/resi");
            break;
          case "ADMIN":
            router.push("/admin");
            break;
          case "POTONG":
            router.push("/dashboard");
            break;
          case "JAHIT":
            router.push("/penjahit");
            break;
          case "QC":
            router.push("/qc");
            break;
          default:
            break;
        }
      } else {
        alert("Login gagal (dummy / server)");
      }
    }
  };

  if (!mounted) return null;

  const roles = ["resi", "admin", "potong", "jahit", "qc"];

  return (
    <div className="min-h-screen flex bg-linear-to-br from-[#0f172a] via-[#1e3a8a] to-[#6d28d9]">
      {/* LEFT DESKTOP */}
      <div className="hidden md:flex flex-col justify-center w-1/2 px-16 text-white">
        <h1 className="text-4xl font-bold mb-4">
          The Ethereal <br /> Architect of Scale.
        </h1>
        <p className="text-gray-300 max-w-md">
          Manage your textile ecosystem with precision.
        </p>
      </div>

      {/* LOGIN */}
      <div className="flex w-full md:w-1/2 items-center justify-center px-3 md:px-6">
        <div className="w-full max-w-85 md:max-w-md bg-white rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl p-5 md:p-8">
          {/* TITLE */}
          <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-1">
            Login System
          </h2>
          <p className="text-xs md:text-sm text-gray-400 mb-4 md:mb-6">
            Access your dashboard
          </p>
          <p className="text-xs md:text-sm text-gray-400 mb-4 md:mb-6">
            {session?.user?.role}
          </p>

          {/* ROLE */}
          <div className="mb-3 md:mb-4">
            <p className="text-[10px] md:text-xs text-gray-400 mb-2">
              OPERATION ROLE
            </p>

            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setRoleUI(role);
                    setUsername(role);
                  }}
                  className={`px-2.5 md:px-3 py-1 rounded-full text-[11px] md:text-sm ${
                    roleUI === role
                      ? "bg-linear-to-r from-indigo-500 to-purple-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* USERNAME */}
          <div className="mb-3 md:mb-4">
            <div className="flex items-center bg-gray-100 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3">
              <span className="mr-2 text-gray-400 text-sm">📧</span>
              <input
                type="text"
                value={username}
                placeholder="Username"
                className="bg-transparent w-full outline-none text-gray-800 text-xs md:text-sm"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="mb-3 md:mb-4">
            <div className="flex items-center bg-gray-100 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3">
              <span className="mr-2 text-gray-400 text-sm">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Password"
                className="bg-transparent w-full outline-none text-gray-800 text-xs md:text-sm"
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400"
              >
                {mounted &&
                  (showPassword ? <EyeOff size={16} /> : <Eye size={16} />)}
              </button>
            </div>
          </div>

          {/* FORGOT */}
          <div className="text-right text-[11px] md:text-sm text-indigo-500 mb-4 md:mb-6">
            Forgot Password?
          </div>

          {/* BUTTON */}
          <button
            onClick={handleLogin}
            className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white py-2.5 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold shadow-lg"
          >
            Sign In →
          </button>

          {/* FOOTER */}
          <div className="mt-4 md:mt-6 text-center text-[10px] md:text-xs text-gray-400">
            Demo: potong / admin / resi / jahit / qc <br />
            Password: 123
          </div>
        </div>
      </div>
    </div>
  );
}
