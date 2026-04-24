"use client";

export default function StokResiWeb({ handleLogout, session }) {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-semibold">Stok Resi</h1>
            <p className="text-sm text-gray-500">
              Welcome, {session?.user?.nama || "User"}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm"
          >
            Logout
          </button>
        </div>

        {/* CONTENT */}
        <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
          Halaman Stok Resi (Web)
        </div>
      </div>
    </div>
  );
}
