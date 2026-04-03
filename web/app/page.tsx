"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl text-center w-full max-w-sm p-6 sm:p-10">
        
        {/* TITLE */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
          Sistem Produksi
        </h1>

        {/* SUBTITLE */}
        <p className="text-gray-500 text-sm mb-5">
          Alam Jaya Tekstil
        </p>

        {/* BUTTON */}
        <button
          onClick={() => router.push("/login")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition active:scale-95"
        >
          Masuk ke Sistem
        </button>

        {/* FOOTER */}
        <p className="text-[11px] text-gray-400 mt-5">
          © 2026 Alam Jaya Tekstil
        </p>
      </div>
    </div>
  );
}