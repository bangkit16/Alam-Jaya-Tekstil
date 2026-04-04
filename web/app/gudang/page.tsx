"use client";

import { useEffect, useState } from "react";
import { getOrders, updateOrder, getStok } from "../data/orders";
import { useRouter } from "next/navigation";

export default function GudangPage() {
  const router = useRouter();
  const [orders, setOrders] = useState(getOrders());

  useEffect(() => {
    if (localStorage.getItem("role") !== "admin") {
      router.push("/login");
    }
  }, []);

  const kirimKePotong = (id: number) => {
    updateOrder(id, "potong");
    setOrders([...getOrders()]);
  };

  const terimaDariQC = (id: number) => {
    updateOrder(id, "selesai");
    setOrders([...getOrders()]);
  };

  const kirimKeResi = (id: number) => {
    updateOrder(id, "resi");
    setOrders([...getOrders()]);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* 🔥 NAVBAR (SAMA SEPERTI SUPERADMIN) */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/20">
        <div className="px-4 md:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold">
              G
            </div>
            <span className="font-semibold text-gray-800">Gudang Panel</span>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("role");
              router.push("/login");
            }}
            className="text-sm text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 md:p-8">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Warehouse Control
          </h1>
          <p className="text-gray-400 text-sm">
            Monitor stok & distribusi barang
          </p>
        </div>

        {/* STOCK CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <StockCard kode="K001" stok={getStok("K001")} status="in" />
          <StockCard kode="K002" stok={getStok("K002")} status="low" />
        </div>

        {/* REQUEST */}
        <Section title="Request">
          {orders.filter((o) => o.status === "request").length === 0 && (
            <Empty />
          )}

          {orders
            .filter((o) => o.status === "request")
            .map((o) => (
              <CardRow key={o.id}>
                <div>
                  <p className="font-medium">
                    {o.nama} ({o.kodeBarang})
                  </p>
                  <p className="text-xs text-gray-400">{o.jumlah} pcs</p>
                </div>

                <div className="flex gap-2">
                  <Btn onClick={() => kirimKePotong(o.id)} color="blue">
                    Potong
                  </Btn>
                  <Btn onClick={() => kirimKeResi(o.id)} color="green">
                    Resi
                  </Btn>
                </div>
              </CardRow>
            ))}
        </Section>

        {/* PRODUKSI */}
        <Section title="Dalam Produksi">
          {orders
            .filter((o) => o.status === "potong")
            .map((o) => (
              <CardRow key={o.id}>
                {o.nama} ({o.kodeBarang})
              </CardRow>
            ))}
        </Section>

        {/* RESI */}
        <Section title="Ke Resi">
          {orders
            .filter((o) => o.status === "resi")
            .map((o) => (
              <CardRow key={o.id}>
                <span>
                  {o.nama} ({o.kodeBarang})
                </span>
                <Badge color="green">Dikirim</Badge>
              </CardRow>
            ))}
        </Section>

        {/* QC */}
        <Section title="Barang dari QC">
          {orders
            .filter((o) => o.status === "gudang")
            .map((o) => (
              <CardRow key={o.id}>
                <span>
                  {o.nama} ({o.kodeBarang})
                </span>

                <Btn onClick={() => terimaDariQC(o.id)} color="green">
                  Masukkan
                </Btn>
              </CardRow>
            ))}
        </Section>
      </div>
    </div>
  );
}

/* 🔥 COMPONENTS */

function Section({ title, children }: any) {
  return (
    <div className="mb-8">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">{title}</h2>

      <div className="bg-white rounded-2xl shadow-sm border p-3 space-y-3">
        {children}
      </div>
    </div>
  );
}

function CardRow({ children }: any) {
  return (
    <div className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 transition">
      {children}
    </div>
  );
}

function Btn({ children, onClick, color }: any) {
  const map: any = {
    blue: "bg-indigo-600",
    green: "bg-green-600",
  };

  return (
    <button
      onClick={onClick}
      className={`${map[color]} text-white px-3 py-1 rounded-lg text-xs shadow`}
    >
      {children}
    </button>
  );
}

function Badge({ children, color }: any) {
  const map: any = {
    green: "bg-green-100 text-green-700",
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${map[color]}`}>
      {children}
    </span>
  );
}

function StockCard({ kode, stok, status }: any) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border flex justify-between items-center">
      <div>
        <p className="text-xs text-gray-400">SKU</p>
        <h2 className="font-semibold">{kode}</h2>
        <p className="text-2xl font-bold">{stok}</p>
      </div>

      <span
        className={`text-xs px-3 py-1 rounded-full ${
          status === "in"
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {status === "in" ? "IN STOCK" : "LOW STOCK"}
      </span>
    </div>
  );
}

function Empty() {
  return (
    <p className="text-xs text-gray-400 text-center py-4">Tidak ada data</p>
  );
}
