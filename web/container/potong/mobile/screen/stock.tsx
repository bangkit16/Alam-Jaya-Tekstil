"use client";

export default function Stock({ setScreen }: any) {
  return (
    <div className="min-h-screen bg-gray-200 flex justify-center items-center p-4">
      {/* PHONE FRAME */}
      <div className="w-full max-w-sm h-[90vh] bg-white rounded-[40px] shadow-xl p-4 flex flex-col">
        {/* HEADER */}
        <div className="border rounded-2xl py-2 text-center text-gray-900 text-sm font-medium mb-6">
          View Stock
        </div>

        {/* MENU */}
        <div className="flex flex-col items-center gap-6 mt-10">
          {/* STOCK BAHAN (ACTIVE) */}
          <button
            onClick={() => setScreen("stockBahan")}
            className="px-6 py-2 rounded-full bg-purple-500 text-white text-sm shadow"
          >
            Stock Bahan
          </button>

          {/* STOCK PRODUCT */}
          <button
            onClick={() => setScreen("stockProduct")}
            className="px-6 py-2 rounded-full border text-sm text-gray-600"
          >
            Stock Product
          </button>
        </div>

        {/* SPACER */}
        <div className="flex-1" />

        {/* BACK */}
        <button
          onClick={() => setScreen("home")}
          className="text-xs text-gray-500"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
