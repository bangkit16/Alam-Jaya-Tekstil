"use client";

import { useState } from "react";
import { Package } from "lucide-react";

import { useGetPermintaan } from "@/services/potong/useGetPermintaan";
import { useGetProses } from "@/services/potong/useGetProses";

import { usePutPermintaan } from "@/services/potong/usePutPermintaan";
import { usePutProses } from "@/services/potong/usePutProses";
import { usePutStokPotong } from "@/services/potong/usePutStokPotong";

import { useGetPemotong } from "@/services/potong/useGetPemotong";
import { useGetPermintaanSelesai } from "@/services/potong/useGetPermintaanSelesai";
import { toast } from "sonner";

type TabType = "menunggu" | "proses" | "selesai";

export default function PotongWeb({ handleLogout }: any) {
  const [activeTab, setActiveTab] = useState<TabType>("menunggu");
  const [selectedProses, setSelectedProses] = useState<any>(null);

  // 🔥 TAMBAHAN (UNTUK EXPAND MENUNGGU)
  const [selectedMenunggu, setSelectedMenunggu] = useState<string | null>(null);

  const [form, setForm] = useState({
    kode_potongan: "",
    jumlah_lolos: "",
  });

  const [pemotongList, setPemotongList] = useState<string[]>([]);

  const { data: pemotongData } = useGetPemotong();

  // ================= API =================
  const { data: dataPermintaan, isLoading: isLoadingPermintaan } =
    useGetPermintaan();

  const { data: dataProses, isLoading: isLoadingProses } = useGetProses();

  const { data: dataSelesai, isLoading: isLoadingSelesai } =
    useGetPermintaanSelesai();

  const { mutate: mutatePermintaan } = usePutPermintaan();
  const { mutate: mutateProses } = usePutProses();
  const { mutate: mutateStokKirim } = usePutStokPotong();

  // ================= ACTION =================
  const handlePermintaan = (item: any) => {
    mutatePermintaan({
      id: item.idPermintaan,
      data: {
        kode_kain: "WEB",
        pemotong: "web",
        pengecek: "web",
      },
    });
  };

  const openModalProses = (item: any) => {
    setSelectedProses(item);
    setForm({
      kode_potongan: item.kodeKain || "",
      jumlah_lolos: "",
    });
    setPemotongList([]);
  };

  const handleSubmitProses = (e: any) => {
    e.preventDefault();

    if (!selectedProses) return;

    const kodeKain = form.kode_potongan.trim();
    const jumlahLolos = form.jumlah_lolos.trim();

    if (!kodeKain) return toast.error("Kode kain wajib diisi");
    if (!jumlahLolos) return toast.error("Jumlah hasil wajib diisi");
    if (pemotongList.length === 0)
      return toast.error("Minimal pilih 1 pemotong");
    if (pemotongList.length > 2) return toast.error("Maksimal 2 pemotong");

    const jumlahHasil = parseInt(jumlahLolos);

    if (isNaN(jumlahHasil) || jumlahHasil <= 0)
      return toast.error("Jumlah tidak valid");

    if (jumlahHasil > selectedProses.jumlahMinta)
      return toast.error("Tidak boleh melebihi jumlah diminta");

    mutateProses(
      {
        id: selectedProses.idPermintaan,
        data: {
          kodeKain,
          jumlahHasil,
          idPemotong: pemotongList,
        },
      },
      {
        onSuccess: () => {
          toast.success("Berhasil dipindah ke selesai");
          setSelectedProses(null);
        },
      },
    );
  };

  // ================= DATA =================
  const getData = () => {
    if (activeTab === "menunggu") return dataPermintaan || [];
    if (activeTab === "proses") return dataProses || [];
    if (activeTab === "selesai") return dataSelesai || [];
    return [];
  };

  const isLoading =
    (activeTab === "menunggu" && isLoadingPermintaan) ||
    (activeTab === "proses" && isLoadingProses) ||
    (activeTab === "selesai" && isLoadingSelesai);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-orange-50">
      {/* SIDEBAR */}
      <div className="w-64 bg-white/70 backdrop-blur-xl border-r border-white/40 p-5 hidden md:flex flex-col shadow-lg">
        <div>
          <h1 className="text-lg font-semibold mb-6 text-gray-800">
            Divisi Potong
          </h1>

          <div className="space-y-2">
            {["menunggu", "proses", "selesai"].map((menu) => (
              <button
                key={menu}
                onClick={() => setActiveTab(menu as TabType)}
                className={`w-full text-left px-4 py-2 rounded-xl capitalize transition ${
                  activeTab === menu
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg scale-[1.02]"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {menu}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-auto bg-red-50 text-red-500 text-xs py-2 rounded-xl font-medium hover:bg-red-100 transition"
        >
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6">
        {/* 🔥 SUMMARY */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white/70 p-4 rounded-2xl shadow text-center">
            <p className="text-xs text-gray-500">Menunggu</p>
            <p className="text-2xl font-bold text-yellow-500">
              {dataPermintaan?.length || 0}
            </p>
          </div>

          <div className="bg-white/70 p-4 rounded-2xl shadow text-center">
            <p className="text-xs text-gray-500">Proses</p>
            <p className="text-2xl font-bold text-blue-500">
              {dataProses?.length || 0}
            </p>
          </div>

          <div className="bg-white/70 p-4 rounded-2xl shadow text-center">
            <p className="text-xs text-gray-500">Selesai</p>
            <p className="text-2xl font-bold text-green-500">
              {dataSelesai?.length || 0}
            </p>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-md border border-white/40">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold capitalize text-lg">
              Data {activeTab}
            </h3>

            <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
              {getData().length} item
            </span>
          </div>

          {isLoading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : getData().length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <div className="bg-orange-100 text-orange-500 p-4 rounded-full mb-4">
                <Package size={30} />
              </div>
              <p className="font-semibold text-gray-500 mb-1">
                Belum ada data {activeTab}
              </p>
              <p className="text-xs text-gray-400">Data akan muncul di sini</p>
            </div>
          ) : (
            <div className="space-y-3">
              {getData().map((item: any) => {
                const isOpen = selectedMenunggu === item.idPermintaan;

                return (
                  <div
                    key={item.idPermintaan}
                    onClick={() =>
                      activeTab === "menunggu" &&
                      setSelectedMenunggu(isOpen ? null : item.idPermintaan)
                    }
                    className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-4 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  >
                    {/* ================= SELESAI ================= */}
                    {activeTab === "selesai" ? (
                      <div>
                        <div className="flex justify-between mb-2">
                          <p className="text-sm font-semibold text-gray-800">
                            {item.namaBarang} - {item.ukuran}
                          </p>
                          <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                            Selesai
                          </span>
                        </div>

                        <div className="h-px bg-gray-200 mb-3" />

                        <div className="text-xs text-gray-600 space-y-1">
                          <p>Nama Produk : {item.namaBarang}</p>
                          <p>Ukuran : {item.ukuran}</p>
                          <p>Kode Kain : {item.kodeKain || "-"}</p>
                          <p>
                            Pemotong :
                            {Array.isArray(item.pemotong)
                              ? item.pemotong.join(", ")
                              : item.pemotong || "-"}
                          </p>
                          <p>Jumlah Diminta : {item.jumlahMinta}</p>
                          <p>Jumlah Hasil : {item.jumlahHasil}</p>
                        </div>
                      </div>
                    ) : activeTab === "proses" ? (
                      <div onClick={() => openModalProses(item)}>
                        {item.isUrgent && (
                          <span className="inline-block bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse mb-1">
                            URGENT
                          </span>
                        )}

                        <div className="flex justify-between items-center">
                          <p className="text-sm font-semibold text-gray-800">
                            {item.namaBarang} - {item.ukuran}
                          </p>

                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                            Proses
                          </span>
                        </div>

                        <div className="h-px bg-gray-200 my-2" />

                        <div className="text-xs text-gray-500 space-y-1">
                          <p>NAMA PRODUK : {item.namaBarang}</p>
                          <p>UKURAN : {item.ukuran}</p>
                          <p>JUMLAH : {item.jumlahMinta}</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* 🔥 MENUNGGU (FIX SESUAI UI) */}
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {item.namaBarang} - {item.ukuran}
                            </p>

                            {/* 🔥 INFO RINGKAS (SEBELUM KLIK) */}
                            <div className="text-[11px] text-gray-400 mt-1 space-y-0.5 uppercase">
                              <p>NAMA PRODUK : {item.namaBarang}</p>
                              <p>UKURAN : {item.ukuran}</p>
                              <p>JUMLAH DIMINTA : {item.jumlahMinta}</p>
                            </div>
                          </div>

                          <p className="text-2xl font-bold text-gray-800">
                            {item.jumlahMinta}
                          </p>
                        </div>

                        {/* 🔥 EXPAND (SETELAH KLIK) */}
                        {isOpen && (
                          <>
                            <div className="h-px bg-gray-200 my-3" />

                            <div className="text-sm text-gray-600 space-y-1">
                              <p>Jumlah diminta : {item.jumlahMinta}</p>
                              <p>Kategori : {item.kategori || "Kaos"}</p>
                            </div>

                            <p className="text-center text-gray-400 text-sm mt-3">
                              Lanjut ke proses?
                            </p>

                            <div className="flex gap-3 mt-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePermintaan(item);
                                }}
                                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2 rounded-xl text-sm font-semibold"
                              >
                                PROSES
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedMenunggu(null);
                                }}
                                className="flex-1 bg-gray-200 text-gray-600 py-2 rounded-xl text-sm font-semibold"
                              >
                                TIDAK
                              </button>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* MODAL */}
        {selectedProses && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={() => setSelectedProses(null)}
          >
            <form
              onSubmit={handleSubmitProses}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl w-full max-w-sm shadow-2xl space-y-4 border border-white/40"
            >
              <div>
                <p className="text-sm font-semibold">
                  {selectedProses.namaBarang} - {selectedProses.ukuran}
                </p>
                <p className="text-xl font-bold">
                  {selectedProses.jumlahMinta}
                </p>
              </div>

              <div className="h-px bg-gray-200" />

              <input
                placeholder="Kode Kain"
                value={form.kode_potongan}
                onChange={(e) =>
                  setForm({
                    ...form,
                    kode_potongan: e.target.value,
                  })
                }
                className="w-full bg-gray-100 px-3 py-2 rounded-xl text-sm"
              />

              <select
                onChange={(e) => {
                  const id = e.target.value;
                  if (!id) return;
                  if (pemotongList.includes(id)) {
                    toast.error("Sudah dipilih");
                    return;
                  }
                  if (pemotongList.length >= 2) {
                    toast.error("Maksimal 2 pemotong");
                    return;
                  }

                  setPemotongList([...pemotongList, id]);
                }}
                className="w-full bg-gray-100 px-3 py-2 rounded-xl text-sm"
              >
                <option value="">Pilih Pemotong</option>
                {pemotongData?.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.nama}
                  </option>
                ))}
              </select>

              <div className="flex flex-wrap gap-2">
                {pemotongList.map((id) => {
                  const nama =
                    pemotongData?.find((p: any) => p.id === id)?.nama || id;

                  return (
                    <div
                      key={id}
                      className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs flex items-center gap-2"
                    >
                      {nama}
                      <button
                        type="button"
                        onClick={() =>
                          setPemotongList((prev) =>
                            prev.filter((p) => p !== id),
                          )
                        }
                        className="text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>

              <input
                placeholder="Jumlah hasil"
                value={form.jumlah_lolos}
                onChange={(e) =>
                  setForm({
                    ...form,
                    jumlah_lolos: e.target.value,
                  })
                }
                className="w-full bg-gray-100 px-3 py-2 rounded-xl text-sm"
              />

              <button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:scale-105 active:scale-95 transition text-white py-2.5 rounded-xl text-sm font-semibold">
                SELESAI
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
