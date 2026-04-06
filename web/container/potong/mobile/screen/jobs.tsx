"use client";

import { useGetKategoriProduk } from "@/services/useGetKategoriProduk";
import { useGetPermintaan } from "@/services/useGetPermintaan";
import { useGetProses } from "@/services/useGetProses";
import { useGetStokKirim } from "@/services/useGetStokKirim";
import { useGetStokProdukByKategori } from "@/services/useGetStokProdukByKategori";
import { usePutPermintaan } from "@/services/usePutPermintaan";
import { usePutProses } from "@/services/usePutProses";
import { usePutStokPotong } from "@/services/usePutStokPotong";
import { useState } from "react";

type statusType = "menunggu" | "proses" | "stok" | "kirim";

type kategoriProdukType = {
  id: string;
  name: string;
  slug: string;
};

type StokPotongType = {
  id_stok_potong: string;
  id_permintaan: string;
  nama_produk: string;
  kode_kain: string;
  kode_potongan: string;
  pengecek: string;
  jumlah_hasil: number;
  ukuran: "S" | "M" | "L" | "XL" | "XXL";
};

type StokPotongSubmitType = {
  id: string;
  data: {
    penjahit: string;
    admin: string;
    tanggal_kirim: string;
  };
};

type permintaanType = {
  id_permintaan: string;
  nama_produk: string;
  jumlah: number;
  ukuran: "M" | "L" | "XL" | "XXL";
  user_id: string;
  is_urgent: boolean;
};

type permintaanSubmitType = {
  id: string;
  data: {
    kode_kain: string;
    pemotong: string;
    pengecek: string;
  };
};

type prosesType = {
  id_permintaan: string;
  nama_produk: string;
  kode_kain: string;
  jumlah: number;
  ukuran: "M" | "L" | "XL" | "XXL";
  user_id: string;
  is_urgent: boolean;
  pengecek: string;
  pemotong: string;
};

type prosesSubmitType = {
  id: string;
  data: {
    kode_potongan: string;
    jumlah_lolos: number;
    pengecek: string;
  };
};

type StokKirimType = {
  id_stok_potong: string;
  id_permintaan: string;
  ukuran: string; // Bisa dipersempit menjadi: "S" | "M" | "L" | "XL"
  is_urgent: boolean;
  nama_produk: string;
  jumlah_lolos: number;
  jumlah_permintaan: number;
  kode_potongan: string;
  kode_kain: string;
  pengecek: string;
  penjahit: string;
  admin: string;
  tanggal_kirim: string; // Gunakan string karena format JSON adalah ISO Date
};

export default function Jobs({ jobs, setJobs, setScreen }: any) {
  const [filterStatus, setFilterStatus] = useState<statusType>("menunggu");
  const [search, setSearch] = useState("");

  const [selectedKategoriSlug, setSelectedKategoriSlug] = useState<
    string | null
  >(null);
  const { data: dataKategori, isLoading: isLoadingKategori } =
    useGetKategoriProduk();
  const { data: dataStok, isLoading: isLoadingStok } =
    useGetStokProdukByKategori(selectedKategoriSlug);

  const [selectedPermintaan, setSelectedPermintaan] =
    useState<permintaanType | null>(null);
  const { data: dataPermintaan, isLoading: isLoadingPermintaan } =
    useGetPermintaan();
  const { mutate: mutatePermintaan } = usePutPermintaan();

  const [selectedProses, setSelectedProses] = useState<prosesType | null>(null);
  const { data: dataProses, isLoading: isLoadingProses } = useGetProses();
  const { mutate: mutateProses } = usePutProses();

  const [selectedStokPotong, setSelectedStokPotong] =
    useState<StokPotongType | null>(null);
  const { data: dataStokKirim, isLoading: isLoadingStokKirim } =
    useGetStokKirim();
  const { mutate: mutateStokKirim } = usePutStokPotong();

  const [selectedStokKirim, setSelectedStokKirim] =
    useState<StokKirimType | null>(null);

  const [formPermintaan, setFormPermintaan] = useState({
    kode_kain: "",
    pemotong: "",
    pengecek: "",
  });

  const [formProses, setFormProses] = useState({
    kode_potongan: "",
    jumlah_lolos: 0,
    pengecek: "",
  });

  const [formKirim, setFormKirim] = useState({
    penjahit: "",
    admin: "",
    tanggal_kirim: "",
  });

  const handleSubmitPermintaan = () => {
    const submitData: permintaanSubmitType = {
      id: selectedPermintaan?.id_permintaan as string,
      data: {
        kode_kain: formPermintaan.kode_kain,
        pemotong: formPermintaan.pemotong,
        pengecek: formPermintaan.pengecek,
      },
    };
    // console.log(submitData);
    mutatePermintaan(submitData);
    setSelectedPermintaan(null);
    setFormPermintaan({ kode_kain: "", pemotong: "", pengecek: "" });
  };

  const handleSubmitProses = () => {
    const submitData: prosesSubmitType = {
      id: selectedProses?.id_permintaan as string,
      data: {
        kode_potongan: formProses.kode_potongan,
        jumlah_lolos: formProses.jumlah_lolos,
        pengecek: formProses.pengecek,
      },
    };
    console.log(submitData);
    mutateProses(submitData);
    setSelectedProses(null);
    setFormProses({ kode_potongan: "", jumlah_lolos: 0, pengecek: "" });
  };

  const handleSubmitPotongKirim = () => {
    const submitData: StokPotongSubmitType = {
      id: selectedStokPotong?.id_stok_potong as string,
      data: {
        penjahit: formKirim.penjahit,
        admin: formKirim.admin,
        tanggal_kirim: formKirim.tanggal_kirim,
      },
    };
    console.log(submitData);
    mutateStokKirim(submitData);
    setSelectedStokPotong(null);
    setFormKirim({ penjahit: "", admin: "", tanggal_kirim: "" });
  };

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center items-center p-4">
      <div className="w-full max-w-sm h-[90vh] bg-white rounded-[40px] shadow-xl p-4 flex flex-col relative">
        {/* HEADER */}
        <div className="border border-gray-300 rounded-2xl py-2 text-center text-sm font-medium mb-3 text-gray-700">
          View Jobs
        </div>

        {/* SEARCH */}
        <input
          placeholder="Search........"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 text-sm mb-2 text-gray-700"
        />

        {/* FILTER */}
        <div className="flex justify-between text-xs mb-3">
          {["menunggu", "proses", "stok", "kirim"].map((item) => (
            <button
              key={item}
              onClick={() => {
                setFilterStatus(item as any);
                // setSelectedStok(null); // reset
              }}
              className={`flex-1 text-center py-1 ${
                filterStatus === item
                  ? "font-semibold text-black"
                  : "text-gray-400"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* ================= LIST ================= */}
        <div className="flex flex-col gap-3 overflow-y-auto">
          {/* PERMINTAAN MENUNGGU */}
          {filterStatus === "menunggu" ? (
            isLoadingPermintaan ? (
              <p className="text-center">Loading...</p>
            ) : (
              dataPermintaan?.map(
                (permintaan: permintaanType, index: number) => (
                  <div
                    key={`${permintaan.id_permintaan ?? permintaan.nama_produk}-${index}`}
                    onClick={() => {
                      setSelectedPermintaan(permintaan);
                    }}
                    className="border border-gray-300 rounded-2xl p-3 flex justify-between items-center cursor-pointer"
                  >
                    <div className="flex-row w-full  justify-between align-middle items-center">
                      {permintaan.is_urgent && (
                        <p className="text-red-500 text-sm uppercase font-semibold">
                          Urgent
                        </p>
                      )}
                      <p className="text-sm font-semibold text-gray-800 my-1">
                        {permintaan.nama_produk} - {permintaan.ukuran}
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">
                        {permintaan.jumlah}
                      </p>
                    </div>
                  </div>
                ),
              )
            )
          ) : null}

          {/* PERMINTAAN PROSES */}
          {filterStatus === "proses" ? (
            isLoadingProses ? (
              <p className="text-center">Loading...</p>
            ) : (
              dataProses?.map((proses: prosesType, index: number) => (
                <div
                  key={`${proses.id_permintaan ?? proses.kode_kain}-${index}`}
                  onClick={() => {
                    setFormProses({
                      kode_potongan: proses.kode_kain,
                      jumlah_lolos: 0,
                      pengecek: "",
                    });
                    setSelectedProses(proses);
                  }}
                  className="border border-gray-300 rounded-2xl p-3 flex justify-between items-center cursor-pointer"
                >
                  <div className="flex-row w-full justify-between align-middle items-center">
                    {proses.is_urgent && (
                      <p className="text-red-500 text-sm uppercase font-semibold">
                        Urgent
                      </p>
                    )}
                    <p className="text-sm font-semibold text-gray-800 my-1">
                      {proses.nama_produk} - {proses.ukuran}
                    </p>
                    <p className="text-xs font-medium text-gray-400">
                      KODE PRODUK :{" "}
                      <span className="font-bold">{proses.kode_kain}</span>
                    </p>
                    <p className="text-xs font-medium text-gray-400">
                      PEMOTONG :{" "}
                      <span className="font-bold">{proses.pemotong}</span>
                    </p>
                    <p className="text-xs font-medium text-gray-400">
                      PENGECEK :{" "}
                      <span className="font-bold">{proses.pengecek}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {proses.jumlah}
                    </p>
                  </div>
                </div>
              ))
            )
          ) : null}

          {/* STOK */}
          {filterStatus === "stok" && (
            <>
              {/* TAMPILAN DAFTAR KATEGORI (Jika belum ada yang dipilih) */}
              {!selectedKategoriSlug ? (
                isLoadingKategori ? (
                  <p className="text-center">Loading Kategori...</p>
                ) : (
                  dataKategori?.map(
                    (kategori: kategoriProdukType, index: number) => (
                      <div
                        key={`${kategori.id ?? kategori.slug}-${index}`}
                        onClick={() => setSelectedKategoriSlug(kategori.slug)}
                        className="border border-gray-300 rounded-2xl p-3 flex text-center justify-between items-center cursor-pointer mb-2"
                      >
                        <p className="text-sm w-full text-center font-semibold text-gray-800 ">
                          {kategori.name}
                        </p>
                      </div>
                    ),
                  )
                )
              ) : (
                /* TAMPILAN DETAIL STOK (Jika kategori sudah dipilih) */
                <>
                  <button
                    onClick={() => setSelectedKategoriSlug(null)}
                    className="text-xs mb-4 text-blue-600 font-medium"
                  >
                    ← Kembali ke Kategori
                  </button>

                  {isLoadingStok ? (
                    <p className="text-center">
                      Memuat stok {selectedKategoriSlug}...
                    </p>
                  ) : (
                    dataStok?.map((stok: StokPotongType, index: number) => (
                      <div
                        key={`${stok.id_stok_potong}-${index}`}
                        onClick={() => setSelectedStokPotong(stok)}
                        className="p-3 border border-gray-300 rounded-xl mb-2"
                      >
                        <div className="flex w-full justify-between items-center">
                          <div>
                            <p className="font-semibold text-gray-800">
                              {stok.nama_produk}
                            </p>
                            <p className="text-xs text-gray-500">
                              Ukuran: {stok.ukuran}
                            </p>
                            <p className="text-xs text-gray-500">
                              Kode Potongan: {stok.kode_potongan}
                            </p>
                            <p className="text-xs text-gray-500">
                              Pengecek:{" "}
                              <span className="font-bold">{stok.pengecek}</span>
                            </p>
                          </div>
                          <p className="font-bold text-lg">
                            {stok.jumlah_hasil}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}
            </>
          )}

          {/* KIRIM */}
          {filterStatus === "kirim" ? (
            isLoadingStokKirim ? (
              <p className="text-center">Loading...</p>
            ) : (
              dataStokKirim?.map((stokkirim: StokKirimType, index: number) => (
                <div
                  key={`${stokkirim.id_permintaan ?? stokkirim.kode_kain}-${index}`}
                  onClick={() => {
                    setFormProses({
                      kode_potongan: stokkirim.kode_kain,
                      jumlah_lolos: 0,
                      pengecek: "",
                    });
                    setSelectedStokKirim(stokkirim);
                  }}
                  className="border border-gray-300 rounded-2xl p-3 flex justify-between items-center cursor-pointer"
                >
                  <div className="flex-row w-full justify-between align-middle items-center">
                    {stokkirim.is_urgent && (
                      <p className="text-red-500 text-sm uppercase font-semibold">
                        Urgent
                      </p>
                    )}
                    <p className="text-sm font-semibold text-gray-800 my-1">
                      {stokkirim.nama_produk} - {stokkirim.ukuran}
                    </p>
                    <p className="text-xs font-medium text-gray-400">
                      NAMA PENJAHIT :{" "}
                      <span className="font-bold">{stokkirim.penjahit}</span>
                    </p>
                    <p className="text-xs font-medium text-gray-400">
                      ADMIN :{" "}
                      <span className="font-bold">{stokkirim.admin}</span>
                    </p>
                    <p className="text-xs font-medium text-gray-400">
                      TANGGAL KIRIM :{" "}
                      <span className="font-bold">
                        {stokkirim.tanggal_kirim
                          ? new Date(
                              stokkirim.tanggal_kirim,
                            ).toLocaleDateString("id-ID")
                          : "-"}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {stokkirim.jumlah_permintaan}
                    </p>
                  </div>
                </div>
              ))
            )
          ) : null}
        </div>

        {/* BACK */}
        <div className="mt-auto flex flex-col gap-2">
          {/* BACK */}
          <button
            onClick={() => setScreen("home")}
            className="text-xs text-gray-500"
          >
            ← Back
          </button>
        </div>

        {/* ================= MODAL JOB ================= */}
        {selectedPermintaan && (
          <div
            className="absolute inset-0 bg-black/40 flex items-center justify-center"
            onClick={() => setSelectedPermintaan(null)}
          >
            <div
              className="bg-white p-4 rounded-xl w-[85%]"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedPermintaan.is_urgent && (
                <p className="text-red-500 text-md uppercase font-bold mb-1">
                  Urgent
                </p>
              )}

              <div className="flex justify-between mb-2">
                <p className="text-md text-gray-800 font-semibold">
                  {selectedPermintaan.nama_produk}
                </p>
                <p className="font-bold text-gray-800">
                  {selectedPermintaan.jumlah}
                </p>
              </div>

              <hr className="mb-3 border-gray-300" />
              <input
                placeholder="kode kain"
                value={formPermintaan.kode_kain}
                onChange={(e) =>
                  setFormPermintaan({
                    ...formPermintaan,
                    kode_kain: e.target.value,
                  })
                }
                className="w-full border border-gray-300 text-gray-900 mb-2 px-2 py-1 rounded"
              />
              <input
                placeholder="pemotong"
                value={formPermintaan.pemotong}
                onChange={(e) =>
                  setFormPermintaan({
                    ...formPermintaan,
                    pemotong: e.target.value,
                  })
                }
                className="w-full border border-gray-300 text-gray-900 mb-2 px-2 py-1 rounded"
              />
              <input
                placeholder="pengecek"
                value={formPermintaan.pengecek}
                onChange={(e) =>
                  setFormPermintaan({
                    ...formPermintaan,
                    pengecek: e.target.value,
                  })
                }
                className="w-full border border-gray-300 text-gray-900 mb-3 px-2 py-1 rounded"
              />

              <button
                onClick={handleSubmitPermintaan}
                className="bg-purple-500 text-white text-xs px-3 py-1 rounded float-right"
              >
                cek
              </button>
            </div>
          </div>
        )}

        {/* ================= MODAL PROSES ================= */}
        {selectedProses && (
          <div
            className="absolute inset-0 bg-black/40 flex items-center justify-center"
            onClick={() => setSelectedProses(null)}
          >
            <div
              className="bg-white p-4 rounded-xl w-[85%]"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedProses.is_urgent && (
                <p className="text-red-500 text-md uppercase font-bold mb-1">
                  Urgent
                </p>
              )}

              <div className="flex justify-between mb-2">
                <p className="text-md text-gray-800 font-semibold">
                  {selectedProses.nama_produk}
                </p>
                <p className="font-bold text-gray-800">
                  {selectedProses.jumlah}
                </p>
              </div>

              <hr className="mb-3 border-gray-300" />
              <input
                placeholder="kode potongan"
                value={formProses.kode_potongan}
                onChange={(e) =>
                  setFormProses({
                    ...formProses,
                    kode_potongan: e.target.value,
                  })
                }
                className="w-full border border-gray-300 text-gray-900 mb-2 px-2 py-1 rounded"
              />
              <input
                placeholder="jumlah lolos"
                type="number"
                value={Number(formProses.jumlah_lolos)}
                onChange={(e) =>
                  setFormProses({
                    ...formProses,
                    jumlah_lolos: Number(e.target.value),
                  })
                }
                className="w-full border border-gray-300 text-gray-900 mb-2 px-2 py-1 rounded"
              />
              <input
                placeholder="pengecek"
                value={formProses.pengecek}
                onChange={(e) =>
                  setFormProses({ ...formProses, pengecek: e.target.value })
                }
                className="w-full border border-gray-300 text-gray-900 mb-3 px-2 py-1 rounded"
              />

              <button
                onClick={handleSubmitProses}
                className="bg-purple-500 text-white text-xs px-3 py-1 rounded float-right"
              >
                cek
              </button>
            </div>
          </div>
        )}

        {/* ================= MODAL KIRIM ================= */}
        {selectedStokPotong && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 ease-in-out transition-all"
            onClick={() => setSelectedStokPotong(null)}
          >
            <div
              className="bg-white p-5 rounded-xl w-full max-w-xs shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm font-bold text-gray-700">
                  {selectedStokPotong.nama_produk}
                </p>
                <p className="text-sm font-bold text-purple-600">
                  {selectedStokPotong.jumlah_hasil} Pcs
                </p>
              </div>

              {/* FORM */}
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase mb-1">
                    Penjahit
                  </p>
                  <input
                    placeholder="Nama penjahit"
                    value={formKirim.penjahit}
                    onChange={(e) =>
                      setFormKirim({ ...formKirim, penjahit: e.target.value })
                    }
                    className="w-full border border-gray-200 px-3 py-2 rounded-lg text-sm outline-none focus:border-purple-400 text-gray-600"
                  />
                </div>

                <div>
                  <p className="text-[10px] text-gray-400 uppercase mb-1">
                    Admin
                  </p>
                  <input
                    placeholder="Nama admin"
                    value={formKirim.admin}
                    onChange={(e) =>
                      setFormKirim({ ...formKirim, admin: e.target.value })
                    }
                    className="w-full border border-gray-200 px-3 py-2 rounded-lg text-sm outline-none focus:border-purple-400 text-gray-600"
                  />
                </div>

                <div>
                  <p className="text-[10px] text-gray-400 uppercase mb-1">
                    Tanggal
                  </p>
                  <input
                    type="date"
                    value={formKirim.tanggal_kirim}
                    onChange={(e) =>
                      setFormKirim({
                        ...formKirim,
                        tanggal_kirim: e.target.value,
                      })
                    }
                    className="w-full border border-gray-200 px-3 py-2 rounded-lg text-sm outline-none focus:border-purple-400 text-gray-600"
                  />
                </div>
              </div>

              {/* BUTTON */}
              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => setSelectedStokPotong(null)}
                  className="flex-1 py-2 text-sm text-gray-400 font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmitPotongKirim}
                  className="flex-1 bg-purple-500 text-white text-sm py-2 rounded-lg font-semibold active:opacity-80"
                >
                  Kirim
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= MODAL STOK KIRIM ================= */}
        {selectedStokKirim && (
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedStokKirim(null)}
          >
            <div
              className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* HEADER */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-1">
                    Detail Produk
                  </p>
                  <p className="text-lg font-bold text-gray-800 leading-tight">
                    {selectedStokKirim.nama_produk}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-gray-900 leading-none">
                    {selectedStokKirim.jumlah_permintaan || 0}
                  </p>
                  <p className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter">
                    Unit
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {/* PROSES */}
                <section>
                  <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest border-b border-gray-100 pb-1">
                    Proses Produksi
                  </p>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <p className="text-gray-400">Kode Potong</p>
                    <p className="text-gray-700 font-medium text-right">
                      {selectedStokKirim.kode_potongan || "-"}
                    </p>

                    <p className="text-gray-400">Jumlah Lolos</p>
                    <p className="text-green-600 font-bold text-right">
                      {selectedStokKirim.jumlah_lolos || 0}
                    </p>

                    <p className="text-gray-400">Pengecek</p>
                    <p className="text-gray-700 font-medium text-right">
                      {selectedStokKirim.pengecek || "-"}
                    </p>
                  </div>
                </section>

                {/* STOK */}
                <section className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">
                    Stok Potong
                  </p>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">Status Ready</p>
                    <p className="text-sm font-bold text-gray-800">
                      {selectedStokKirim.jumlah_lolos || 0} Pcs
                    </p>
                  </div>
                </section>

                {/* KIRIM */}
                <section>
                  <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest border-b border-gray-100 pb-1">
                    Logistik Penjahit
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <p className="text-gray-400">Penjahit</p>
                      <p className="text-gray-700 font-semibold">
                        {selectedStokKirim.penjahit || "-"}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-400">Admin</p>
                      <p className="text-gray-700">
                        {selectedStokKirim.admin || "-"}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-400">Tanggal</p>
                      <p className="text-gray-700 italic">
                        {selectedStokKirim.tanggal_kirim
                          ? new Date(
                              selectedStokKirim.tanggal_kirim,
                            ).toLocaleDateString("id-ID")
                          : "-"}
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              {/* CLOSE BUTTON (Optional for Mobile UX) */}
              <button
                className="w-full mt-6 py-3 bg-gray-900 text-white rounded-xl font-semibold text-sm active:scale-95 transition-transform"
                onClick={() => setSelectedStokKirim(null)}
              >
                Tutup Detail
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
