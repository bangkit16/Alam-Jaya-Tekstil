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

  const router = useRouter();

  const [kodeBarang, setKodeBarang] = useState("");

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
      prev.map((item) =>
        item.id === updated.id ? updated : item
      )
    );
  };

  const filteredOrders = orders.filter(
    (item) => item.status === activeTab
  );

  const handleLogout = () => {
  
  localStorage.removeItem("token");

  
  router.push("/login");
};

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <div className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-xl"
        >
          ☰
        </button>

        <h1 className="font-semibold text-gray-700">
          Sistem Produksi
        </h1>

        <div className="text-sm text-gray-500 capitalize">
          {activeTab}
        </div>
      </div>

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-60 bg-white shadow-lg transform transition-transform z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 font-bold border-b">
          Menu
        </div>

        <div className="p-4 flex flex-col gap-3 text-sm">
          <button
            onClick={() => {
              setActiveTab("menunggu");
              setSidebarOpen(false);
            }}
            className="text-left hover:text-blue-600"
          >
            Menunggu
          </button>

          <button
            onClick={() => {
              setActiveTab("proses");
              setSidebarOpen(false);
            }}
            className="text-left hover:text-blue-600"
          >
            Proses
          </button>

          <button
            onClick={() => {
              setActiveTab("selesai");
              setSidebarOpen(false);
            }}
            className="text-left hover:text-blue-600"
          >
            Selesai
          </button>

      <button
  onClick={handleLogout}
  className="text-left text-red-500 mt-4 hover:text-red-700"
>
  Logout
</button>
        </div>
      </div>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/30 z-40"
        />
      )}

      {/* CONTENT */}
      <div className="p-4">

        {loading && <p className="text-sm">Loading...</p>}

        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredOrders.map((order) => (
              <div
  key={order.id}
  className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition duration-200"
>
               <h2 className="font-semibold text-sm text-gray-800">
  {order.nama}
</h2>

{order.kodeBarang && (
  <p className="text-xs text-gray-400">
    Kode: {order.kodeBarang}
  </p>
)}

{order.pemotong && (
  <p className="text-xs text-gray-500 mt-1">
    Nama: <span className="font-medium">{order.pemotong}</span>
  </p>
)}

{order.hasil && (
  <div className="text-xs mt-2 text-gray-600 space-y-1">
    <p>
      S: {order.hasil.s} | M: {order.hasil.m} | L: {order.hasil.l} | XL: {order.hasil.xl}
    </p>
    <p className="text-emerald-600 font-medium">
      Total: {order.hasil.total}
    </p>
  </div>
)}

                <div className="mt-3">
                  {activeTab === "menunggu" && (
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setModalType("proses");
                      }}
                      className="w-full bg-gray-100 text-gray-700 py-1.5 rounded-lg text-xs hover:bg-gray-200 transition"
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
                     className="w-full bg-blue-50 text-blue-600 py-1.5 rounded-lg text-xs hover:bg-blue-100 transition"
                    >
                      Selesai
                    </button>
                  )}

                  {activeTab === "selesai" && (
                    <p className="text-green-600 text-xs">
                      ✔ Selesai
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL PROSES */}
      {modalType === "proses" && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-sm p-5 rounded-xl">
            <h2 className="mb-3 text-sm font-semibold">
              Nama Pemotong
            </h2>

            <input
              type="text"
              className="w-full border p-2 mb-4 rounded"
              onChange={(e) =>
                setNamaPemotong(e.target.value)
              }
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
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              Simpan
            </button>
          </div>
        </div>
      )}

      {/* MODAL SELESAI */}
    
      {modalType === "selesai" && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-sm p-5 rounded-xl">
            <h2 className="mb-3 text-sm font-semibold">
              Input Hasil
            </h2>
              <input
  type="text"
  placeholder="Kode Barang"
  className="w-full border p-2 mb-3 rounded"
  value={kodeBarang}
  onChange={(e) => setKodeBarang(e.target.value)}
/>

            {["s", "m", "l", "xl"].map((size) => (
              <input
                key={size}
                type="number"
                placeholder={size.toUpperCase()}
                className="w-full border p-2 mb-2 rounded"
                onChange={(e) =>
                  setHasil((prev) => ({
                    ...prev,
                    [size]: Number(e.target.value),
                  }))
                }
              />
            ))}

            <button
              onClick={() => {
                const total =
                  hasil.s + hasil.m + hasil.l + hasil.xl;

              updateOrder({
  ...selectedOrder,
  status: "selesai",
  kodeBarang: kodeBarang,
  hasil: { ...hasil, total },
});

                setKodeBarang("");
setHasil({
  s: 0,
  m: 0,
  l: 0,
  xl: 0,
  total: 0,
});
setModalType(null);
              }}
              className="w-full bg-green-600 text-white py-2 rounded mt-3"
            >
              Simpan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}