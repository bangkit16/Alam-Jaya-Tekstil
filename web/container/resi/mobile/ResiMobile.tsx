"use client";

export default function ResiMobile({ handleLogout }: any) {
  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold">Resi Mobile</h1>

      <button onClick={handleLogout} className="mt-4 text-red-500">
        Logout
      </button>
    </div>
  );
}
