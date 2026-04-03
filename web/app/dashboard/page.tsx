"use client";

import { useEffect, useState } from "react";
import { getData } from "@/services/getData";
import { useRouter } from "next/navigation";

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

  const [activeTab, setActiveTab] = useState("menunggu");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const filteredOrders = orders.filter((item) => item.status === activeTab);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-50
  ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="p-5 font-bold text-lg  border-gray-200">
          ⚡ Production
        </div>

        <div className="p-4 space-y-2 text-sm">
          {["menunggu", "proses", "selesai"].map((menu) => (
            <button
              key={menu}
              onClick={() => {
                setActiveTab(menu);
                setSidebarOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg transition
              ${
                activeTab === menu
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {menu.charAt(0).toUpperCase() + menu.slice(1)}
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 mt-4"
          >
            Logout
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* HEADER */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-xl"
          >
            ☰
          </button>

          <h1 className="text-lg font-semibold text-gray-800">
            Dashboard Produksi
          </h1>

          <div className="text-xs px-3 py-1 bg-gray-100 rounded-full capitalize">
            {activeTab}
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 bg-gray-50 min-h-screen">
          {loading && <p className="text-sm text-gray-500">Loading data...</p>}

          {!loading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-5 border hover:shadow-lg transition"
                >
                  <h2 className="font-semibold text-gray-800">{order.nama}</h2>

                  {order.kodeBarang && (
                    <p className="text-xs text-gray-400 mt-1">
                      {order.kodeBarang}
                    </p>
                  )}

                  {order.pemotong && (
                    <p className="text-xs text-gray-500 mt-2">
                      👤 {order.pemotong}
                    </p>
                  )}

                  {order.hasil && (
                    <div className="text-xs mt-3 bg-gray-50 p-2 rounded-lg">
                      <p>
                        S:{order.hasil.s} M:{order.hasil.m} L:{order.hasil.l}{" "}
                        XL:{order.hasil.xl}
                      </p>
                      <p className="text-green-600 font-semibold">
                        Total: {order.hasil.total}
                      </p>
                    </div>
                  )}

                  <div className="mt-4">
                    {activeTab === "menunggu" && (
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setModalType("proses");
                        }}
                        className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm hover:opacity-90"
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
                        className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:opacity-90"
                      >
                        Selesaikan
                      </button>
                    )}

                    {activeTab === "selesai" && (
                      <p className="text-green-600 text-sm font-medium">
                        ✔ Selesai
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/30 md:hidden"
        />
      )}

      {/* MODAL PROSES */}
      {modalType === "proses" && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-scaleIn">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              Mulai Produksi
            </h2>
            <p className="text-sm text-gray-400 mb-4">Masukkan nama pemotong</p>

            <input
              type="text"
              placeholder="Contoh: Rafi"
              className="w-full border border-gray-200 rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              onChange={(e) => setNamaPemotong(e.target.value)}
            />

            <div className="flex gap-2">
              <button
                onClick={() => setModalType(null)}
                className="w-full bg-gray-100 text-gray-600 py-2 rounded-xl hover:bg-gray-200"
              >
                Batal
              </button>

              <button
                onClick={() => {
                  updateOrder({
                    ...selectedOrder,
                    status: "proses",
                    pemotong: namaPemotong,
                  });
                  setModalType(null);
                }}
                className="w-full bg-blue-600 text-white py-2 rounded-xl hover:opacity-90"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SELESAI */}
      {modalType === "selesai" && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              Hasil Produksi
            </h2>
            <p className="text-sm text-gray-400 mb-4">Input jumlah tiap size</p>

            {/* KODE BARANG */}
            <input
              type="text"
              placeholder="Kode Barang"
              className="w-full border border-gray-200 p-3 rounded-xl mb-4 focus:ring-2 focus:ring-blue-500"
              value={kodeBarang}
              onChange={(e) => setKodeBarang(e.target.value)}
            />

            {/* GRID SIZE */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {["s", "m", "l", "xl"].map((size) => (
                <div key={size}>
                  <label className="text-xs text-gray-400 uppercase">
                    {size}
                  </label>
                  <input
                    type="number"
                    className="w-full border p-2 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500"
                    onChange={(e) =>
                      setHasil((prev) => ({
                        ...prev,
                        [size]: Number(e.target.value),
                      }))
                    }
                  />
                </div>
              ))}
            </div>

            {/* BUTTON */}
            <button
              onClick={() => {
                const total = hasil.s + hasil.m + hasil.l + hasil.xl;

                updateOrder({
                  ...selectedOrder,
                  status: "selesai",
                  kodeBarang: kodeBarang,
                  hasil: { ...hasil, total },
                });

                setKodeBarang("");
                setHasil({ s: 0, m: 0, l: 0, xl: 0, total: 0 });
                setModalType(null);
              }}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:opacity-90"
            >
              Simpan Hasil
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
