"use client";

import { useEffect, useState } from "react";
import { getData } from "@/services/getData";
import { useRouter } from "next/navigation";
import { Package, Briefcase, Bell } from "lucide-react";

type Hasil = {
  s: number;
  m: number;
  l: number;
  xl: number;
  total: number;
};

type Order = {
  id: number;
  nama: string;
  status: string;
  pemotong?: string;
  kodeBarang?: string;
  hasil?: Hasil;
};

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const [activeTab, setActiveTab] = useState("menunggu");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalType, setModalType] = useState<"proses" | "selesai" | null>(null);

  const [namaPemotong, setNamaPemotong] = useState("");
  const [hasil, setHasil] = useState<Hasil>({
    s: 0,
    m: 0,
    l: 0,
    xl: 0,
    total: 0,
  });

  const [kodeBarang, setKodeBarang] = useState("");

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const res: any = await getData("/api/orders");

      const initialData = res.data.map((item: Order) => ({
        ...item,
        status: item.status || "menunggu",
      }));

      setOrders(initialData);
      setLoading(false);
    };

    fetchData();
  }, []);

  const updateOrder = (updated: Order) => {
    setOrders((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item)),
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  const filteredOrders = orders.filter((item) => item.status === activeTab);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      {/* CONTAINER (HP STYLE) */}
      <div className="w-full max-w-sm bg-white rounded-[40px] p-4 shadow-xl">
        {/* PROFILE CARD */}
        <div className="border rounded-2xl p-4 mb-4">
          <div className="flex gap-3 items-center">
            <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-xs rounded-md">
              FOTO
            </div>

            <div>
              <h2 className="font-semibold text-gray-800">ADIT NDONG</h2>
              <p className="text-xs text-gray-500">Divisi Potong</p>
              <p className="text-xs text-gray-400">00189021</p>
            </div>
          </div>
        </div>

        {/* MENU ICON */}
        <div className="border rounded-2xl p-4 mb-4">
          <div className="flex justify-around text-center">
            <div className="flex flex-col items-center gap-1">
              <div className="bg-gray-100 p-3 rounded-xl">
                <Package size={20} />
              </div>
              <span className="text-xs text-gray-600">Stock</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="bg-gray-100 p-3 rounded-xl">
                <Briefcase size={20} />
              </div>
              <span className="text-xs text-gray-600">Jobs</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="bg-gray-100 p-3 rounded-xl">
                <Bell size={20} />
              </div>
              <span className="text-xs text-gray-600">Report</span>
            </div>
          </div>
        </div>

        {/* TAB */}
        <div className="flex gap-2 mb-4">
          {["menunggu", "proses", "selesai"].map((menu) => (
            <button
              key={menu}
              onClick={() => setActiveTab(menu)}
              className={`flex-1 py-2 rounded-full text-xs capitalize
              ${
                activeTab === menu
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {menu}
            </button>
          ))}
        </div>

        {/* LIST ORDER */}
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {filteredOrders.map((order) => (
            <div key={order.id} className="border rounded-xl p-3 text-sm">
              <h2 className="font-medium">{order.nama}</h2>

              {order.kodeBarang && (
                <p className="text-xs text-gray-400">📦 {order.kodeBarang}</p>
              )}

              {order.pemotong && (
                <p className="text-xs text-gray-400">👤 {order.pemotong}</p>
              )}

              {order.hasil && (
                <p className="text-xs text-green-600 mt-1">
                  Total: {order.hasil.total}
                </p>
              )}

              <div className="mt-2">
                {activeTab === "menunggu" && (
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setModalType("proses");
                    }}
                    className="w-full bg-black text-white py-1.5 rounded-lg text-xs"
                  >
                    Mulai
                  </button>
                )}

                {activeTab === "proses" && (
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setModalType("selesai");
                    }}
                    className="w-full bg-gray-800 text-white py-1.5 rounded-lg text-xs"
                  >
                    Selesai
                  </button>
                )}

                {activeTab === "selesai" && (
                  <span className="text-green-600 text-xs">✔ Done</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="mt-4 w-full text-xs text-red-500"
        >
          Logout
        </button>
      </div>

      {/* MODAL PROSES */}
      {modalType === "proses" && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-4 space-y-3">
            <h2 className="text-sm font-semibold">Mulai Produksi</h2>

            <input
              value={namaPemotong}
              placeholder="Nama Pemotong"
              className="w-full border p-2 rounded-lg text-sm"
              onChange={(e) => setNamaPemotong(e.target.value)}
            />

            <button
              onClick={() => {
                updateOrder({
                  ...selectedOrder,
                  status: "proses",
                  pemotong: namaPemotong,
                });
                setModalType(null);
              }}
              className="w-full bg-black text-white py-2 rounded-lg text-sm"
            >
              Simpan
            </button>
          </div>
        </div>
      )}

      {/* MODAL SELESAI */}
      {modalType === "selesai" && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-4 space-y-3">
            <h2 className="text-sm font-semibold">Hasil Produksi</h2>

            <input
              placeholder="Kode Barang"
              className="w-full border p-2 rounded-lg text-sm"
              value={kodeBarang}
              onChange={(e) => setKodeBarang(e.target.value)}
            />

            <button
              onClick={() => {
                const total = hasil.s + hasil.m + hasil.l + hasil.xl;

                updateOrder({
                  ...selectedOrder,
                  status: "selesai",
                  kodeBarang,
                  hasil: { ...hasil, total },
                });

                setModalType(null);
              }}
              className="w-full bg-green-600 text-white py-2 rounded-lg text-sm"
            >
              Simpan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
