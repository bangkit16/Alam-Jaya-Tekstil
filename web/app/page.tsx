"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);

  // 🎯 Tangkap event install PWA
  useEffect(() => {
    const handler = (e: any) => {
      console.log("PWA READY 🔥");
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // 🎯 Handle klik install
  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      setDeferredPrompt(null);
      setShowInstall(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 px-4">
      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl text-center w-full max-w-sm p-6 sm:p-10 border border-white/40">
        {/* GLOW EFFECT */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-400/20 blur-3xl rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-400/20 blur-3xl rounded-full" />

        {/* TITLE */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
          Sistem Produksi
        </h1>

        {/* SUBTITLE */}
        <p className="text-gray-500 text-sm mb-6">Alam Jaya Tekstil</p>

        {/* BUTTON LOGIN */}
        <button
          onClick={() => router.push("/login")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition active:scale-95 shadow-md"
        >
          Masuk ke Sistem
        </button>

        {/* 🔥 BUTTON INSTALL PWA (FIX FINAL) */}
        {deferredPrompt ? (
          // ✅ REAL INSTALL BUTTON
          <button
            onClick={handleInstall}
            className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition active:scale-95 shadow-md"
          >
            Install Aplikasi
          </button>
        ) : (
          // ✅ FALLBACK BUTTON (SELALU MUNCUL)
          <button
            onClick={() =>
              alert("Gunakan Chrome → klik ⋮ → Add to Home Screen")
            }
            className="w-full mt-3 border border-blue-600 text-blue-600 py-2.5 rounded-lg font-medium transition active:scale-95"
          >
            Install Aplikasi
          </button>
        )}

        {/* FOOTER */}
        <p className="text-[11px] text-gray-400 mt-6">
          © 2026 Alam Jaya Tekstil
        </p>
      </div>
    </div>
  );
}
