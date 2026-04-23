"use client";

import { useEffect, useState } from "react";
import { ClipboardList, CheckCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { useGetPesanan } from "@/services/resi/useGetPesanan";
import { usePostPesanan } from "@/services/resi/usePostPesanan";
import { useGetStokDesign } from "@/services/resi/useGetStokDesign";

type TabType = "menunggu" | "selesai";

export default function ResiWeb({ handleLogout }: any) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabType>("menunggu");

  const [nama, setNama] = useState("");
  const [jumlah, setJumlah] = useState(0);
  const [kode, setKode] = useState("K001");

  // 🔥 SERVICES
  const { data } = useGetPesanan();
  const { mutate: postPesanan } = usePostPesanan();
  const { data: stokData } = useGetStokDesign();

  const orders = data?.data || [];

  useEffect(() => {
    if (localStorage.getItem("role")?.toLowerCase() !== "resi") {
      router.push("/login");
    }
  }, []);

  // 🔥 ADD ORDER (pakai service)
  const handleAdd = () => {
    if (!nama || jumlah <= 0) return;

    postPesanan({
      nama,
      jumlah,
      kodeDesign: kode,
    });

    setNama("");
    setJumlah(0);
  };

  const menunggu = orders.filter((o: any) => o.status !== "selesai");
  const selesai = orders.filter((o: any) => o.status === "selesai");

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r p-5 flex flex-col shadow-sm">
        <h1 className="font-semibold mb-6">Resi Panel</h1>

        <button
          onClick={() => setActiveTab("menunggu")}
          className={`flex items-center gap-2 px-3 py-2 rounded mb-2 ${
            activeTab === "menunggu"
              ? "bg-orange-500 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          <ClipboardList size={16} />
          Menunggu
        </button>

        <button
          onClick={() => setActiveTab("selesai")}
          className={`flex items-center gap-2 px-3 py-2 rounded ${
            activeTab === "selesai"
              ? "bg-green-500 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          <CheckCircle size={16} />
          Selesai
        </button>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-2 text-red-500"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6 space-y-6">
        {/* FORM */}
        <div className="bg-white p-5 rounded-xl shadow max-w-md">
          <h2 className="text-sm font-semibold mb-4">Create Order</h2>

          <input
            placeholder="Nama Barang"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-3 text-sm"
          />

          <select
            value={kode}
            onChange={(e) => setKode(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-3 text-sm"
          >
            <option value="K001">K001</option>
            <option value="K002">K002</option>
          </select>

          <input
            type="number"
            placeholder="Jumlah"
            value={jumlah}
            onChange={(e) => setJumlah(Number(e.target.value))}
            className="w-full border px-3 py-2 rounded mb-4 text-sm"
          />

          <button
            onClick={handleAdd}
            className="w-full bg-orange-500 text-white py-2 rounded"
          >
            Tambah Order
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Nama</th>
                <th className="p-3">Kode</th>
                <th className="p-3">Jumlah</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {(activeTab === "menunggu" ? menunggu : selesai).map((o: any) => (
                <tr key={o.id} className="border-t">
                  <td className="p-3">{o.nama}</td>
                  <td className="p-3">{o.kodeDesign}</td>
                  <td className="p-3">{o.jumlah}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        o.status === "selesai"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {o.status}
                    </span>
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
