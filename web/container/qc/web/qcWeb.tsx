"use client";

export default function QCWeb({
  qcList,
  orders,
  handleGagal,
  handleLolos,
  handleLogout,
}: any) {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* NAVBAR */}
      <div className="sticky top-0 bg-white border-b px-6 py-3 flex justify-between">
        <h1 className="font-bold">QC Panel</h1>

        <button onClick={handleLogout} className="text-red-500 text-sm">
          Logout
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-6">
        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Stat title="QC" value={qcList.length} />
          <Stat
            title="Rework"
            value={orders.filter((o: any) => o.status === "rework").length}
          />
          <Stat
            title="Selesai"
            value={orders.filter((o: any) => o.status === "gudang").length}
          />
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-xs">
              <tr>
                <th className="p-3 text-left">Nama</th>
                <th className="p-3 text-left">Kode</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {qcList.map((o: any) => (
                <tr key={o.id} className="border-t">
                  <td className="p-3">{o.nama}</td>
                  <td className="p-3">{o.kodeBarang}</td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => handleGagal(o.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-xs"
                    >
                      Gagal
                    </button>
                    <button
                      onClick={() => handleLolos(o.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Lolos
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Stat({ title, value }: any) {
  return (
    <div className="bg-white p-4 rounded-xl border">
      <p className="text-xs text-gray-400">{title}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}
