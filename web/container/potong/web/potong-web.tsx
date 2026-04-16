"use client";

import { useState } from "react";
import { Package, ClipboardList, Truck } from "lucide-react";

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

  // ================= UI =================
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r border-gray-200 p-5 hidden md:flex flex-col">
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
                    ? "bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow"
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
        <div className="bg-gray-50 rounded-2xl p-4">
          <h3 className="font-semibold mb-4 capitalize">Data {activeTab}</h3>

          {isLoading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : (
            <div className="space-y-3">
              {getData().map((item: any) => (
                <div
                  key={item.idPermintaan}
                  className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition"
                >
                  {/* ================= SELESAI ================= */}
                  {activeTab === "selesai" ? (
                    <div>
                      <div className="flex justify-between mb-2">
                        <p className="text-sm font-semibold text-gray-800">
                          {item.namaBarang} - {item.ukuran}
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {item.jumlahDiminta}
                        </p>
                      </div>

                      <div className="h-px bg-gray-200 mb-3" />

                      <div className="text-xs text-gray-600 space-y-1">
                        <p>
                          Nama Produk :
                          <span className="ml-1 font-medium text-gray-800">
                            {item.namaBarang}
                          </span>
                        </p>

                        <p>
                          Ukuran :
                          <span className="ml-1 font-medium text-gray-800">
                            {item.ukuran}
                          </span>
                        </p>

                        <p>
                          Kode Kain :
                          <span className="ml-1 font-medium text-gray-800">
                            {item.kodeKain || "-"}
                          </span>
                        </p>

                        <p>
                          Nama Pemotong :
                          <span className="ml-1 font-medium text-gray-800">
                            {Array.isArray(item.pemotong)
                              ? item.pemotong.join(", ")
                              : item.pemotong || "-"}
                          </span>
                        </p>

                        <p>
                          Jumlah Diminta :
                          <span className="ml-1 font-medium text-gray-800">
                            {item.jumlahMinta}
                          </span>
                        </p>

                        <p>
                          Jumlah Hasil :
                          <span className="ml-1 font-medium text-gray-800">
                            {item.jumlahHasil}
                          </span>
                        </p>
                      </div>
                    </div>
                  ) : activeTab === "proses" ? (
                    /* ================= PROSES (FIX SESUAI GAMBAR) ================= */
                    <div onClick={() => openModalProses(item)}>
                      {item.isUrgent && (
                        <p className="text-red-500 text-xs font-bold mb-1 uppercase">
                          URGENT
                        </p>
                      )}

                      <div className="flex justify-between items-center">
                        <p className="text-sm font-semibold text-gray-800">
                          {item.namaBarang} - {item.ukuran}
                        </p>

                        <p className="text-xl font-bold text-gray-900">
                          {item.jumlahMinta}
                        </p>
                      </div>

                      <div className="h-px bg-gray-200 my-2" />

                      <div className="text-xs text-gray-500 space-y-1">
                        <p>
                          NAMA PRODUK :
                          <span className="ml-1 font-bold text-gray-700">
                            {item.namaBarang}
                          </span>
                        </p>

                        <p>
                          UKURAN :
                          <span className="ml-1 font-bold text-gray-700">
                            {item.ukuran}
                          </span>
                        </p>

                        <p>
                          JUMLAH DIMINTA :
                          <span className="ml-1 font-bold text-gray-700">
                            {item.jumlahMinta}
                          </span>
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* ================= MENUNGGU ================= */
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {item.namaBarang} - {item.ukuran}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">
                          {item.jumlahMinta}
                        </p>

                        <button
                          onClick={() => handlePermintaan(item)}
                          className="mt-2 bg-gradient-to-r from-orange-400 to-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
                        >
                          Proses
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MODAL PROSES */}
        {selectedProses && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={() => setSelectedProses(null)} //
          >
            <form
              onSubmit={handleSubmitProses}
              onClick={(e) => e.stopPropagation()} //
              className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-xl space-y-4"
            >
              {/* HEADER */}
              <div>
                <p className="text-sm font-semibold">
                  {selectedProses.namaBarang} - {selectedProses.ukuran}
                </p>
                <p className="text-xl font-bold">
                  {selectedProses.jumlahMinta}
                </p>
              </div>

              <div className="h-px bg-gray-200" />

              {/* INPUT */}
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

              {/* SELECT PEMOTONG */}
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

              {/* TAG PEMOTONG */}
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

              {/* INPUT HASIL */}
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

              {/* BUTTON */}
              <button className="w-full bg-gradient-to-r from-orange-400 to-amber-500 text-white py-2.5 rounded-xl text-sm font-semibold">
                SELESAI
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
