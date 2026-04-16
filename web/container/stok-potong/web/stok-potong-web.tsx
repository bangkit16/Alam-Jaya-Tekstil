"use client";

import { useState } from "react";
import { Package, ClipboardList, CheckCircle } from "lucide-react";

// 🔥 MENUNGGU
import { useGetPermintaanStokPotong } from "@/services/stok-potong/useGetPermintaan";
import { usePutMenunggu } from "@/services/stok-potong/usePutMenunggu";

// 🔥 PROSES
import { useGetProses } from "@/services/stok-potong/useGetProses";
import { usePutProses } from "@/services/stok-potong/usePutProses";
import { useGetPengecek } from "@/services/stok-potong/useGetPengecek";

// 🔥 STOK (DITAMBAH)
import { useGetStock } from "@/services/stok-potong/useGetStock";
import { useGetPenjahit } from "@/services/stok-potong/useGetPenjahit";
import { usePutStock } from "@/services/stok-potong/usePutStock";
import { useQueryClient } from "@tanstack/react-query";

type TabType = "menunggu" | "proses" | "stok";

type stockType = {
  idPermintaan: string;
  idStokBarang: string;
  idStokPotong: string;
  namaBarang: string;
  ukuran: "M" | "L" | "XL" | "XXL";
  kodeKain: string;
  pemotong: string[];
  jumlahHasil: number;
  tanggalSelesaiPotong: string;
};

type prosesType = {
  idStokBarang: string;
  idStokPotong: string;
  namaBarang: string;
  ukuran: "M" | "L" | "XL" | "XXL";
  jumlahHasil: number;
};

type pengecekType = {
  id: string;
  nama: string;
};

export default function StokPotongWeb({ handleLogout, session }: any) {
  const [activeTab, setActiveTab] = useState<TabType>("menunggu");

  // ================= MENUNGGU =================
  const { data, isLoading, refetch } = useGetPermintaanStokPotong();
  const { mutate, isPending } = usePutMenunggu();
  const [selectedItem, setSelectedItem] = useState<stockType | null>(null);

  // ================= PROSES =================
  const { data: prosesData, isLoading: loadingProses } = useGetProses();
  const { data: pengecekList } = useGetPengecek();
  const { mutate: mutateProses, isPending: pendingProses } = usePutProses();

  const [selectedProses, setSelectedProses] = useState<prosesType | null>(null);
  const [selectedPengecek, setSelectedPengecek] = useState<string[]>([]);
  const [form, setForm] = useState({
    kode: "",
    lolos: "",
    reject: "",
    catatan: "",
  });

  // ================= STOK =================
  const queryClient = useQueryClient();
  const { data: stockData, isLoading: loadingStock } = useGetStock();
  const { data: penjahitList } = useGetPenjahit();
  const { mutate: mutateStock, isPending: pendingStock } = usePutStock();

  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [namaPenjahit, setNamaPenjahit] = useState("");

  const handleCloseStock = () => {
    setSelectedStock(null);
    setNamaPenjahit("");
  };

  const handleSubmitStock = () => {
    if (!selectedStock) return;
    if (!namaPenjahit) return;

    mutateStock(
      {
        id: selectedStock.idStokPotong,
        penjahitId: namaPenjahit,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["stok-potong-stock"],
          });
          handleCloseStock();
        },
      },
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID");
  };

  const countMenunggu = data?.length || 0;
  const countProses = prosesData?.length || 0;
  const countStok = stockData?.length || 0;

  // ================= MENUNGGU =================
  const renderMenunggu = () => {
    if (isLoading) return <p className="text-center py-4">Loading...</p>;

    if (!data || data.length === 0) {
      return (
        <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl">
          <p className="text-gray-500 font-medium">Data Kosong</p>
        </div>
      );
    }

    return data.map((item: stockType) => (
      <div
        key={item.idPermintaan}
        onClick={() => setSelectedItem(item)}
        className="bg-white border border-gray-100 rounded-xl p-4 flex justify-between items-center shadow-sm cursor-pointer hover:bg-gray-50 transition"
      >
        <div>
          <p className="text-sm font-medium text-gray-800">
            {item.namaBarang} - {item.ukuran}
          </p>

          <div className="text-xs text-gray-500 mt-1">
            • Kode: {item.kodeKain} <br />• Pemotong: {item.pemotong.join(", ")}{" "}
            <br />• Selesai: {formatDate(item.tanggalSelesaiPotong)}
          </div>
        </div>

        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">{item.jumlahHasil}</p>
          <span className="text-gray-400 text-xs font-semibold">Menunggu</span>
        </div>
      </div>
    ));
  };

  // ================= PROSES =================
  const renderProses = () => {
    if (loadingProses) return <p className="text-center py-4">Loading...</p>;

    if (!prosesData || prosesData.length === 0) {
      return <p className="text-center text-gray-400 py-6">Data kosong</p>;
    }

    return prosesData.map((item: prosesType) => (
      <div
        key={item.idStokPotong}
        onClick={() => setSelectedProses(item)}
        className="bg-white border border-gray-100 rounded-xl p-4 flex justify-between items-center shadow-sm cursor-pointer hover:bg-gray-50 transition"
      >
        <p className="text-sm font-medium">
          {item.namaBarang} - {item.ukuran}
        </p>

        <p className="text-lg font-bold">{item.jumlahHasil}</p>
      </div>
    ));
  };

  // ================= STOK =================
  const renderStok = () => {
    if (loadingStock) return <p className="text-center py-4">Loading...</p>;

    if (!stockData || stockData.length === 0) {
      return (
        <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl">
          <p className="text-gray-500 font-medium">Data Kosong</p>
        </div>
      );
    }

    return stockData.map((item: any) => {
      const isLocked = item.status !== "SELESAI";

      return (
        <div
          key={item.idStokPotong}
          onClick={() => {
            if (!isLocked) setSelectedStock(item);
          }}
          className={`bg-white border border-gray-100 rounded-xl p-4 flex flex-col shadow-sm
        ${
          isLocked
            ? "opacity-60 cursor-not-allowed"
            : "cursor-pointer hover:bg-gray-50"
        }`}
        >
          {/* HEADER */}
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="text-sm font-medium text-gray-800">
                {item.namaBarang} - {item.ukuran}
              </p>
            </div>

            <p className="text-lg font-bold text-gray-900">
              {item.jumlahLolos}
            </p>
          </div>

          {/* STATUS */}
          <p
            className={`text-xs font-semibold
          ${
            item.status === "STOK"
              ? "text-blue-600"
              : item.status === "MENUNGGU_KURIR"
                ? "text-yellow-600"
                : "text-green-600"
          }`}
          >
            {item.status}
          </p>

          {/* LOCK INFO */}
          {isLocked && (
            <p className="text-xs text-red-500">Potongan sudah dikirim</p>
          )}

          {/* DETAIL */}
          <ul className="text-xs text-gray-700 mt-2 space-y-1">
            <li>• Kode: {item.kodeStokPotongan}</li>
            <li>
              • Masuk:{" "}
              {item.tanggalMasukPotong &&
                new Date(item.tanggalMasukPotong).toLocaleDateString("id-ID")}
            </li>
          </ul>
        </div>
      );
    });
  };

  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        {/* SIDEBAR */}
        <div className="w-64 bg-white border-r p-5 hidden md:flex flex-col">
          <h1 className="text-lg font-semibold mb-6">Stok Potong</h1>

          {["menunggu", "proses", "stok"].map((menu) => (
            <button
              key={menu}
              onClick={() => setActiveTab(menu as TabType)}
              className={`w-full text-left px-4 py-2 rounded-xl ${
                activeTab === menu
                  ? "bg-orange-400 text-white"
                  : "text-gray-600"
              }`}
            >
              {menu}
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="mt-auto text-red-500 text-xs"
          >
            Logout
          </button>
        </div>

        {/* MAIN */}
        <div className="flex-1 p-6">
          {/* HEADER */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Dashboard Stok</h2>
            <p className="text-xs text-gray-500">
              {session?.user?.name} • {session?.user?.role}
            </p>
          </div>

          {/* CARDS */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl">
              Menunggu: {countMenunggu}
            </div>
            <div className="bg-white p-4 rounded-xl">Proses: {countProses}</div>
            <div className="bg-white p-4 rounded-xl">Stok: {countStok}</div>
          </div>

          {/* LIST */}
          <div className="bg-gray-50 p-4 rounded-xl space-y-3">
            {activeTab === "menunggu" && renderMenunggu()}
            {activeTab === "proses" && renderProses()}
            {activeTab === "stok" && renderStok()}
          </div>
        </div>
      </div>

      {/* ================= MODAL PROSES ================= */}
      {selectedProses && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center"
          onClick={() => setSelectedProses(null)}
        >
          <div
            className="bg-white p-4 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-semibold mb-3">{selectedProses.namaBarang}</p>

            <select
              onChange={(e) => {
                const val = e.target.value;
                if (selectedPengecek.includes(val)) return;
                if (selectedPengecek.length >= 2) return;
                setSelectedPengecek([...selectedPengecek, val]);
              }}
              className="w-full border p-2 mb-2"
            >
              <option>Pilih pengecek</option>
              {pengecekList?.map((p: pengecekType) => (
                <option key={p.id} value={p.id}>
                  {p.nama}
                </option>
              ))}
            </select>

            <input
              placeholder="Kode"
              className="w-full border p-2 mb-2"
              onChange={(e) => setForm({ ...form, kode: e.target.value })}
            />

            <input
              type="number"
              placeholder="Lolos"
              className="w-full border p-2 mb-2"
              onChange={(e) => setForm({ ...form, lolos: e.target.value })}
            />

            <input
              type="number"
              placeholder="Reject"
              className="w-full border p-2 mb-2"
              onChange={(e) => setForm({ ...form, reject: e.target.value })}
            />

            <button
              onClick={() => {
                mutateProses({
                  id: selectedProses.idStokPotong,
                  payload: {
                    idPengecek: selectedPengecek,
                    kodeStokPotongan: form.kode,
                    jumlahPotonganLolos: Number(form.lolos),
                    jumlahPotonganReject: Number(form.reject),
                    catatan: form.catatan,
                  },
                });

                setSelectedProses(null);
                setSelectedPengecek([]);
              }}
              className="w-full bg-blue-500 text-white py-2"
            >
              {pendingProses ? "Loading..." : "Simpan"}
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL STOK ================= */}
      {selectedStock && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center"
          onClick={handleCloseStock}
        >
          <div
            className="bg-white p-4 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-semibold mb-3">{selectedStock.namaBarang}</p>

            <select
              value={namaPenjahit}
              onChange={(e) => setNamaPenjahit(e.target.value)}
              className="w-full border p-2 mb-3"
            >
              <option value="">Pilih Penjahit</option>
              {penjahitList?.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.nama}
                </option>
              ))}
            </select>

            <button
              onClick={handleSubmitStock}
              disabled={!namaPenjahit || pendingStock}
              className="w-full bg-gray-200 py-2"
            >
              {pendingStock ? "Loading..." : "Kirim"}
            </button>
          </div>
        </div>
      )}
      {/* ================= MODAL MENUNGGU ================= */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white p-4 w-full max-w-sm shadow-xl border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-medium text-gray-800">
                {selectedItem.namaBarang} - {selectedItem.ukuran}
              </p>

              <p className="text-lg font-bold text-gray-900">
                {selectedItem.jumlahHasil}
              </p>
            </div>

            <div className="h-px bg-gray-300 mb-3" />

            {/* DETAIL */}
            <ul className="text-xs text-gray-700 space-y-1 mb-6">
              <li>• Kode: {selectedItem.kodeKain}</li>
              <li>• Pemotong: {selectedItem.pemotong.join(", ")}</li>
              <li>
                • Selesai: {formatDate(selectedItem.tanggalSelesaiPotong)}
              </li>
            </ul>

            {/* BUTTON */}
            <div className="flex justify-end">
              <button
                disabled={isPending}
                onClick={() => {
                  if (!selectedItem?.idStokPotong) return;

                  mutate(selectedItem.idStokPotong, {
                    onSuccess: () => {
                      setSelectedItem(null);
                      refetch();
                    },
                  });
                }}
                className="bg-gray-200 text-gray-700 text-xs px-4 py-1.5 rounded-sm hover:bg-gray-300 transition disabled:opacity-50"
              >
                {isPending ? "Loading..." : "Cek"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
