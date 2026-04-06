"use client";

import { useState } from "react";

export default function StockProduct({ setScreen }: any) {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const products = [
    "hoodie",
    "kaos",
    "singlet",
    "ts hoodie",
    "sweater",
    "longsleeve",
    "kemeja",
  ];

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center items-center p-4">
      {/* PHONE */}
      <div className="w-full max-w-sm h-[90vh] bg-white rounded-[40px] shadow-xl p-4 flex flex-col">
        {/* HEADER */}
        <div className="border border-gray-300 rounded-2xl py-2 text-center text-sm font-medium mb-4">
          {selectedProduct ? selectedProduct : "Stock Product"}
        </div>

        {/* ================= LIST ================= */}
        {!selectedProduct && (
          <div className="flex flex-col gap-4 mt-4">
            {products.map((item) => (
              <button
                key={item}
                onClick={() => setSelectedProduct(item)}
                className={`px-4 py-2 rounded-full border text-sm ${
                  item === "hoodie"
                    ? "bg-purple-500 text-white"
                    : "text-gray-600"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        )}

        {/* ================= DETAIL ================= */}
        {selectedProduct === "hoodie" && (
          <div className="flex flex-col gap-4 mt-2 text-sm">
            {/* TOTAL */}
            <div className="border border-gray-300 rounded-xl text-center py-3">
              <p className="text-xs text-gray-500">jumlah total</p>
              <h1 className="text-3xl font-bold text-gray-900">770</h1>
            </div>

            {/* WARNA SELECT */}
            <div className="flex items-center justify-between border border-gray-300 rounded-full overflow-hidden">
              <span className="px-3 text-gray-600">Hoodie biru</span>
              <span className="bg-purple-500 text-white px-4 py-1">120 ▼</span>
            </div>

            {/* SIZE */}
            <div className="border rounded-xl p-3 text-xs">
              <div className="flex justify-between mb-1">
                <span>ukuran</span>
                <span>jumlah</span>
              </div>

              {["XXL", "XL", "L", "M"].map((size) => (
                <div key={size} className="flex justify-between">
                  <span>{size}</span>
                  <span>30</span>
                </div>
              ))}
            </div>

            {/* LIST WARNA */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between border border-gray-300 rounded-full px-3 py-2">
                <span className="text-gray-600">Hoodie hitam</span>
                <span className="text-gray-600">250</span>
              </div>

              <div className="flex justify-between border border-gray-300 rounded-full px-3 py-2">
                <span className="text-gray-600">Hoodie putih</span>
                <span className="text-gray-600">400</span>
              </div>
            </div>
          </div>
        )}

        {/* BACK */}
        <div className="mt-auto">
          <button
            onClick={() =>
              selectedProduct ? setSelectedProduct(null) : setScreen("stock")
            }
            className="text-xs text-gray-500"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}
