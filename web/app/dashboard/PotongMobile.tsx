"use client";

import { useState } from "react";
import { Package, Briefcase, Bell } from "lucide-react";

export default function PotongMobile(props: any) {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedBahan, setSelectedBahan] = useState("tinta");

  const [search, setSearch] = useState("");

  const {
    filteredOrders,
    activeTab,
    setActiveTab,
    setSelectedOrder,
    setModalType,
    handleLogout,
  } = props;

  const [screen, setScreen] = useState<
    "home" | "stock" | "stockBahan" | "stockProduct"
  >("home");

  // =========================
  // HOME
  // =========================
  if (screen === "home") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#6d28d9] flex justify-center items-center p-4">
        <div className="w-full max-w-sm rounded-[40px] bg-white/95 backdrop-blur-xl p-5 shadow-2xl">
          {/* PROFILE */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl p-4 mb-5 shadow-lg">
            <h2 className="font-semibold text-sm">ADIT NDONG</h2>
            <p className="text-xs opacity-80">Divisi Potong</p>
          </div>

          {/* TITLE */}
          <div className="mb-4">
            <h3 className="text-gray-700 text-sm font-semibold">Main Menu</h3>
            <p className="text-xs text-gray-400">
              Pilih aktivitas kamu hari ini
            </p>
          </div>

          {/* MENU GRID (🔥 UPGRADE BESAR) */}
          <div className="grid grid-cols-3 gap-3">
            {/* STOCK */}
            <button
              onClick={() => setScreen("stock")}
              className="flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-2xl p-4 shadow-lg hover:scale-105 transition"
            >
              <Package size={26} />
              <span className="text-xs mt-2">Stock</span>
            </button>

            {/* JOBS */}
            <button className="flex flex-col items-center justify-center bg-white border rounded-2xl p-4 shadow hover:scale-105 transition">
              <Briefcase size={26} />
              <span className="text-xs mt-2 text-gray-600">Jobs</span>
            </button>

            {/* REPORT */}
            <button className="flex flex-col items-center justify-center bg-white border rounded-2xl p-4 shadow hover:scale-105 transition">
              <Bell size={26} />
              <span className="text-xs mt-2 text-gray-600">Report</span>
            </button>
          </div>

          {/* QUICK INFO */}
          <div className="mt-5 bg-gray-50 rounded-xl p-3 text-xs text-gray-500">
            <p>📦 12 Order Menunggu</p>
            <p>✂️ 5 Sedang Diproses</p>
          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="mt-4 w-full text-center text-xs text-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // STOCK MENU
  // =========================
  if (screen === "stock") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#6d28d9] flex justify-center items-center p-4">
        <div className="w-full max-w-sm h-[90vh] bg-white/95 backdrop-blur-xl rounded-[40px] p-5 shadow-2xl flex flex-col">
          {/* HEADER */}
          <div className="mb-5">
            <h2 className="text-lg font-bold text-gray-800">Stock Center</h2>
            <p className="text-xs text-gray-400">Kelola bahan & produk</p>
          </div>

          {/* HERO CARD */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl p-4 mb-5 shadow-lg">
            <p className="text-xs opacity-80">Overview</p>
            <h3 className="text-lg font-semibold">Inventory Ready</h3>
            <p className="text-xs opacity-80 mt-1">
              Semua stok dalam kondisi aman
            </p>
          </div>

          {/* MENU UTAMA */}
          <div className="flex flex-col gap-4 flex-1">
            {/* STOCK BAHAN */}
            <button
              onClick={() => setScreen("stockBahan")}
              className="flex items-center justify-between bg-white border p-4 rounded-2xl shadow hover:shadow-md transition"
            >
              <div>
                <h3 className="font-semibold">Stock Bahan</h3>
                <p className="text-xs opacity-80">Tinta, kain, pet</p>
              </div>

              <span className="text-xl">→</span>
            </button>

            {/* STOCK PRODUCT */}
            <button
              onClick={() => setScreen("stockProduct")}
              className="flex items-center justify-between bg-white border p-4 rounded-2xl shadow"
            >
              <div>
                <h3 className="font-semibold text-gray-800">Stock Product</h3>
                <p className="text-xs text-gray-400">Hoodie, kaos, dll</p>
              </div>

              <span className="text-xl text-gray-400">→</span>
            </button>

            {/* EXTRA SPACE BIAR FULL */}
            <div className="flex-1" />

            {/* QUICK INFO */}
            <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500">
              <p>📦 120 Produk tersedia</p>
              <p>🧵 3 jenis bahan aktif</p>
            </div>
          </div>

          {/* BACK */}
          <button
            onClick={() => setScreen("home")}
            className="mt-4 text-xs text-gray-500 text-center"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // STOCK BAHAN
  // =========================
  if (screen === "stockBahan") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#6d28d9] flex justify-center items-center p-4">
        <div className="w-full max-w-sm h-[90vh] bg-white/95 backdrop-blur-xl rounded-[40px] p-5 shadow-2xl flex flex-col">
          {/* HEADER */}
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-800">Stock Bahan</h2>
            <p className="text-xs text-gray-400">Monitoring bahan produksi</p>
          </div>

          {/* TAB */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
            {["tinta", "kain", "pet"].map((item) => (
              <button
                key={item}
                onClick={() => setSelectedBahan(item)}
                className={`flex-1 py-2 text-xs rounded-lg capitalize transition ${
                  selectedBahan === item
                    ? "bg-white shadow text-gray-800"
                    : "text-gray-500"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* CHART CARD */}
          <div className="bg-white border rounded-2xl p-4 shadow mb-4">
            <div className="flex items-center gap-4">
              {/* PIE (fake) */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-yellow-300 via-green-400 to-white border"></div>

              {/* LEGEND */}
              <div className="text-xs space-y-1">
                <p className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-gray-200 inline-block"></span>
                  Putih : 10
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 inline-block"></span>
                  Hijau : 9
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-yellow-400 inline-block"></span>
                  Kuning : 5
                </p>
              </div>
            </div>
          </div>

          {/* LIST CARD */}
          <div className="bg-white border rounded-2xl p-4 shadow flex-1 overflow-y-auto space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border rounded"></div>
              <div>
                <p className="text-sm font-medium">PRT-108</p>
                <p className="text-xs text-gray-400">putih</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-yellow-400 rounded"></div>
              <div>
                <p className="text-sm font-medium">PRT-111</p>
                <p className="text-xs text-gray-400">kuning</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-yellow-400 rounded"></div>
              <div>
                <p className="text-sm font-medium">PRT-119</p>
                <p className="text-xs text-gray-400">kuning</p>
              </div>
            </div>
          </div>

          {/* BACK */}
          <button
            onClick={() => setScreen("stock")}
            className="mt-4 text-xs text-gray-500 text-center"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // STOCK PRODUCT
  // =========================
  if (screen === "stockProduct") {
    const products = [
      "hoodie",
      "kaos",
      "singlet",
      "ts hoodie",
      "sweater",
      "longsleeve",
      "kemeja",
    ];

    const filteredProducts = products.filter((item) =>
      item.toLowerCase().includes(search.toLowerCase()),
    );
    if (selectedProduct === "hoodie") {
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#6d28d9] flex justify-center items-center p-4">
          <div className="w-full max-w-sm h-[90vh] bg-white/95 backdrop-blur-xl rounded-[40px] p-5 shadow-2xl flex flex-col space-y-4">
            {/* HEADER */}
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-800">Stock Product</h2>
              <p className="text-xs text-gray-400">Pilih jenis produk</p>
            </div>

            {/* SEARCH */}
            <div className="mb-4">
              <div className="flex items-center bg-gray-100 rounded-xl px-3 py-2">
                <span className="text-gray-400 mr-2">🔍</span>
                <input
                  type="text"
                  placeholder="Cari produk..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent outline-none text-sm w-full"
                />
              </div>
            </div>

            {/* TOTAL */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl p-4 text-center shadow">
              <p className="text-xs opacity-80">Jumlah Total</p>
              <h1 className="text-4xl font-bold">770</h1>
            </div>

            {/* WARNA AKTIF */}
            <div className="bg-white border rounded-2xl p-3 shadow flex justify-between items-center">
              <span className="text-sm font-medium">Hoodie Biru</span>
              <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs">
                120
              </span>
            </div>

            {/* SIZE */}
            <div className="bg-white border rounded-2xl p-4 shadow text-sm">
              <div className="grid grid-cols-2 gap-2">
                <p>XXL</p>
                <p>30</p>
                <p>XL</p>
                <p>30</p>
                <p>L</p>
                <p>30</p>
                <p>M</p>
                <p>30</p>
              </div>
            </div>

            {/* LIST WARNA */}
            <div className="flex-1 overflow-y-auto space-y-3">
              <div className="bg-white border rounded-xl px-4 py-2 flex justify-between shadow">
                <span>Hoodie Hitam</span>
                <span className="font-semibold">250</span>
              </div>

              <div className="bg-white border rounded-xl px-4 py-2 flex justify-between shadow">
                <span>Hoodie Putih</span>
                <span className="font-semibold">400</span>
              </div>
            </div>

            {/* BACK */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="text-xs text-gray-500 text-center"
            >
              ← Back
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#6d28d9] flex justify-center items-center p-4">
        <div className="w-full max-w-sm h-[90vh] bg-white/95 backdrop-blur-xl rounded-[40px] p-5 shadow-2xl flex flex-col">
          {/* HEADER */}
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-800">Stock Product</h2>
            <p className="text-xs text-gray-400">Pilih jenis produk</p>
          </div>

          {/* LIST */}
          <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
            {filteredProducts.map((item) => (
              <button
                key={item}
                onClick={() => setSelectedProduct(item)}
                className="flex items-center justify-between bg-white border rounded-2xl p-4 shadow hover:shadow-md transition"
              >
                <div>
                  <p className="font-medium capitalize text-gray-800">{item}</p>
                  <p className="text-xs text-gray-400">Lihat detail stock</p>
                </div>

                <span className="text-gray-400">→</span>
              </button>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <p className="text-center text-xs text-gray-400 mt-4">
              Produk tidak ditemukan
            </p>
          )}

          {/* BACK */}
          <button
            onClick={() => setScreen("stock")}
            className="mt-4 text-xs text-gray-500 text-center"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }
  return null;
}
