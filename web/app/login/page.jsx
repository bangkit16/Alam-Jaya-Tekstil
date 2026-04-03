"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === "potong" && password === "123") {
      localStorage.setItem("role", "potong");
      router.push("/dashboard");
    } else {
      alert("Login gagal");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      
      <div className="w-full max-w-sm bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-5 sm:p-7">
        
        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Sistem Produksi
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Alam Jaya Tekstil
          </p>
        </div>

        {/* TITLE */}
        <h2 className="text-base font-semibold mb-5 text-center text-gray-700">
          Login
        </h2>

        {/* INPUT USERNAME */}
        <div className="mb-3">
          <label className="text-xs text-gray-600">Username</label>
          <input
            type="text"
            placeholder="Masukkan username"
            className="w-full mt-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* INPUT PASSWORD */}
        <div className="mb-5">
          <label className="text-xs text-gray-600">Password</label>
          <input
            type="password"
            placeholder="Masukkan password"
            className="w-full mt-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition active:scale-95"
        >
          Masuk
        </button>

        {/* FOOTER */}
        <p className="text-center text-[10px] text-gray-400 mt-5">
          © 2026 Alam Jaya Tekstil
        </p>
      </div>
    </div>
  );
}