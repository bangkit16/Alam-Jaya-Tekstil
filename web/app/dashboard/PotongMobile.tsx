"use client";

import { useState, useEffect } from "react";
import { Package, Briefcase, Bell } from "lucide-react";

export default function PotongMobile(props: any) {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedBahan, setSelectedBahan] = useState("tinta");
  const [search, setSearch] = useState("");

  const handleLogout = props?.handleLogout || (() => {});

  const [screen, setScreen] = useState<
    "home" | "stock" | "stockBahan" | "stockProduct" | "jobs"
  >("home");

  type Job = {
    id: number;
    nama: string;
    qty: number;
    status: "menunggu" | "proses" | "selesai" | "kirim";
    urgent: boolean;
    hasil: number | null;

    // 🔥 TAMBAHAN
    kodePotong?: string;
    pengecek?: string;

    //
    penjahit?: string;
    admin?: string;
    tanggalKirim?: string;
  };

  const [jobs, setJobs] = useState<Job[]>([]);

  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const selectedJob = jobs.find((j) => j.id === selectedJobId) || null;

  const [filterStatus, setFilterStatus] = useState<
    "menunggu" | "proses" | "stok" | "kirim"
  >("menunggu");

  const [hasilSize, setHasilSize] = useState({
    XXL: "",
    XL: "",
    L: "",
    M: "",
  });

  const [formProses, setFormProses] = useState({
    kode: "",
    lolos: "",
    pengecek: "",
  });

  const [mounted, setMounted] = useState(false);

  const [selectedStok, setSelectedStok] = useState<string | null>(null);

  const [selectedStokItem, setSelectedStokItem] = useState<any>(null);

  const [formKirim, setFormKirim] = useState({
    penjahit: "",
    admin: "",
    tanggal: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("jobs");

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setJobs(parsed);
          return;
        }
      }

      // fallback dummy kalau kosong
      setJobs([
        {
          id: 1,
          nama: "Kaos tipis hitam L",
          qty: 40,
          status: "menunggu",
          urgent: true,
          hasil: null,
        },

        // 🔽 TAMBAHAN (DI BAWAH)
        {
          id: 2,
          nama: "Kaos merah M",
          qty: 25,
          status: "menunggu",
          urgent: false,
          hasil: null,
        },
        {
          id: 3,
          nama: "Hoodie biru XL",
          qty: 30,
          status: "menunggu",
          urgent: true,
          hasil: null,
        },
        {
          id: 4,
          nama: "Hoodie hitam L",
          qty: 50,
          status: "menunggu",
          urgent: false,
          hasil: null,
        },
        {
          id: 5,
          nama: "Sweater abu M",
          qty: 20,
          status: "menunggu",
          urgent: false,
          hasil: null,
        },
        {
          id: 6,
          nama: "Longsleeve putih L",
          qty: 35,
          status: "menunggu",
          urgent: true,
          hasil: null,
        },
      ]);
    } catch (error) {
      console.error("LocalStorage error:", error);
      localStorage.removeItem("jobs");
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    try {
      localStorage.setItem("jobs", JSON.stringify(jobs));
    } catch (e) {
      console.error("Save error:", e);
    }
  }, [jobs, mounted]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  //
  // HOME
  //
  if (screen === "home") {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#0f172a] via-[#1e3a8a] to-[#6d28d9] flex justify-center items-center p-4">
        <div className="w-full max-w-sm rounded-[40px] bg-white/95 p-5 shadow-2xl">
          <div className="bg-linear-to-r from-indigo-500 to-purple-500 text-white rounded-2xl p-4 mb-5">
            <h2 className="font-semibold text-sm">ADIT NDONG</h2>
            <p className="text-xs opacity-80">Divisi Potong</p>
          </div>

          <div className="mb-4">
            <h3 className="text-gray-700 text-sm font-semibold">Main Menu</h3>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setScreen("stock")}
              className="flex flex-col items-center bg-indigo-500 text-white rounded-2xl p-4"
            >
              <Package size={26} />
              <span className="text-xs mt-2">Stock</span>
            </button>

            <button
              onClick={() => setScreen("jobs")}
              className="flex flex-col items-center bg-white border rounded-2xl p-4"
            >
              <Briefcase size={26} />
              <span className="text-xs mt-2 text-gray-600">Jobs</span>
            </button>

            <button className="flex flex-col items-center bg-white border rounded-2xl p-4">
              <Bell size={26} />
              <span className="text-xs mt-2 text-gray-600">Report</span>
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="mt-4 w-full text-xs text-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  //
  // STOCK MENU
  //
  if (screen === "stock") {
    return (
      <div className="min-h-screen flex justify-center items-center p-4">
        <div className="w-full max-w-sm h-[90vh] bg-white rounded-[40px] p-5 flex flex-col">
          <h2 className="text-lg font-bold mb-5">Stock Center</h2>

          <button
            onClick={() => setScreen("stockBahan")}
            className="p-4 border rounded-xl mb-3"
          >
            Stock Bahan
          </button>

          <button
            onClick={() => setScreen("stockProduct")}
            className="p-4 border rounded-xl"
          >
            Stock Product
          </button>

          <button onClick={() => setScreen("home")} className="mt-auto text-xs">
            ← Back
          </button>
        </div>
      </div>
    );
  }

  //
  // STOCK BAHAN
  //
  if (screen === "stockBahan") {
    return (
      <div className="min-h-screen flex justify-center items-center p-4">
        <div className="w-full max-w-sm h-[90vh] bg-white rounded-[40px] p-5 flex flex-col">
          <h2 className="text-lg font-bold mb-4">Stock Bahan</h2>

          <div className="flex mb-4">
            {["tinta", "kain", "pet"].map((item) => (
              <button
                key={item}
                onClick={() => setSelectedBahan(item)}
                className={`flex-1 text-xs ${
                  selectedBahan === item ? "font-bold" : ""
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <button
            onClick={() => setScreen("stock")}
            className="mt-auto text-xs"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  //
  // STOCK PRODUCT
  //
  if (screen === "stockProduct") {
    const products = [
      "hoodie",
      "kaos",
      "singlet",
      "ts hoodie",
      "sweater",
      "longsleeve",
      "kemeja",
    ];

    const filteredProducts = products.filter((item) =>
      item.toLowerCase().includes((search || "").toLowerCase()),
    );

    const isDetail = selectedProduct === "hoodie";

    return (
      <div className="min-h-screen flex justify-center items-center p-4">
        <div className="w-full max-w-sm h-[90vh] bg-white rounded-[40px] p-5 flex flex-col">
          <h2 className="text-lg font-bold mb-4">Stock Product</h2>

          {/* DETAIL */}
          {isDetail ? (
            <>
              <div className="text-center mb-4">
                <h1 className="text-3xl font-bold">770</h1>
              </div>

              <button
                onClick={() => setSelectedProduct(null)}
                className="mt-auto text-xs"
              >
                ← Back
              </button>
            </>
          ) : (
            <>
              {/* SEARCH */}
              <div className="mb-4">
                <div className="flex items-center bg-gray-100 rounded-xl px-3 py-2">
                  <span className="text-gray-400 mr-2">🔍</span>
                  <input
                    type="text"
                    placeholder="Cari produk..."
                    value={search || ""}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent outline-none text-sm w-full"
                  />
                </div>
              </div>

              {/* LIST */}
              <div className="flex flex-col gap-3 overflow-y-auto">
                {filteredProducts.map((item) => (
                  <button
                    key={item}
                    onClick={() => setSelectedProduct(item)}
                    className="p-3 border rounded-xl text-left"
                  >
                    {item}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setScreen("stock")}
                className="mt-auto text-xs"
              >
                ← Back
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  //
  // JOBS
  //
  if (screen === "jobs") {
    const filteredJobs =
      filterStatus === "stok"
        ? []
        : filterStatus === "kirim"
          ? jobs.filter((j) => j.status === "kirim")
          : jobs.filter((j) => j.status === filterStatus);

    return (
      <div className="min-h-screen flex justify-center items-center p-4">
        <div className="w-full max-w-sm h-[90vh] bg-white rounded-[40px] p-5 flex flex-col relative">
          {/* HEADER */}
          <h2 className="text-center font-semibold mb-2">View Jobs</h2>

          {/* SEARCH */}
          <div className="mb-2">
            <input
              placeholder="Search..."
              className="w-full border rounded px-3 py-1 text-sm"
            />
          </div>

          {/* FILTER */}
          <div className="flex justify-between text-xs mb-3">
            {["menunggu", "proses", "stok", "kirim"].map((item) => (
              <button
                key={item}
                onClick={() =>
                  setFilterStatus(
                    item as "menunggu" | "proses" | "stok" | "kirim",
                  )
                }
                className={`flex-1 text-center py-1 rounded ${
                  filterStatus === item
                    ? "bg-purple-500 text-white"
                    : "text-gray-500"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* LIST */}
          <div className="flex flex-col gap-3 overflow-y-auto">
            {/* ================= STOK POTONG ================= */}
            {filterStatus === "stok" && (
              <>
                {/* ================= PILIH PRODUK ================= */}
                {!selectedStok && (
                  <>
                    {[
                      "hoodie",
                      "kaos",
                      "singlet",
                      "ts hoodie",
                      "sweater",
                      "longsleeve",
                      "kemeja",
                    ].map((item, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedStok(item)}
                        className="p-3 rounded-full border text-sm bg-white text-gray-600"
                      >
                        {item}
                      </button>
                    ))}
                  </>
                )}

                {/* ================= DETAIL STOK ================= */}
                {selectedStok && (
                  <>
                    {/* BACK */}
                    <button
                      onClick={() => setSelectedStok(null)}
                      className="text-xs text-gray-500 mb-2"
                    >
                      ← Back
                    </button>

                    {/* LIST HASIL */}
                    {jobs
                      .filter(
                        (j) =>
                          j.status === "selesai" &&
                          j.nama
                            .toLowerCase()
                            .includes(selectedStok.toLowerCase()),
                      )
                      .map((item, index) => (
                        <div
                          key={index}
                          onClick={() => setSelectedStokItem(item)}
                          className={`p-3 rounded-xl border ${
                            index === 1
                              ? "bg-linear-to-r from-purple-400 to-purple-600 text-white"
                              : "bg-white"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-semibold">{item.nama}</p>
                            <p className="text-lg font-bold">{item.hasil}</p>
                          </div>

                          <div className="text-[10px] mt-2 opacity-80">
                            <p>KODE POTONGAN: {item.kodePotong || "-"}</p>
                            <p>PENGECEK: {item.pengecek || "-"}</p>
                            <p>TANGGAL: -</p>
                          </div>
                        </div>
                      ))}
                  </>
                )}
              </>
            )}
            {/* ================= JOB LIST ================= */}
            {filterStatus !== "stok" &&
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => {
                    setSelectedJobId(job.id);
                    setHasilSize({ XXL: "", XL: "", L: "", M: "" });
                  }}
                  className="border rounded-xl p-3 cursor-pointer"
                >
                  {job.urgent && <p className="text-red-500 text-xs">Urgent</p>}

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm">{job.nama}</p>

                      {job.status === "selesai" && (
                        <p className="text-xs italic text-gray-500">
                          Hasil potong {job.hasil}
                        </p>
                      )}
                    </div>

                    <p className="text-lg font-semibold">{job.qty}</p>
                  </div>
                </div>
              ))}
          </div>

          {/* BACK */}
          <div className="mt-auto flex flex-col gap-2">
            {/* 🔥 RESET SEMUA */}
            <button
              onClick={() => {
                setJobs((prev) =>
                  prev.map((j) => ({
                    ...j,
                    status: "menunggu",
                    hasil: null,
                    kodePotong: undefined,
                    pengecek: undefined,
                  })),
                );
              }}
              className="w-full bg-red-500 text-white text-xs py-2 rounded"
            >
              Reset Semua ke Menunggu
            </button>

            {/* BACK */}
            <button
              onClick={() => setScreen("home")}
              className="text-xs text-gray-500"
            >
              ← Back
            </button>
          </div>

          {/* MODAL */}
          {selectedJob && (
            <div
              className="absolute inset-0 bg-black/40 flex items-center justify-center"
              onClick={() => setSelectedJobId(null)} // 👈 klik luar = close
            >
              <div
                className="bg-white p-4 rounded-xl w-[85%] shadow-lg"
                onClick={(e) => e.stopPropagation()} // 👈 biar klik dalam ga nutup
              >
                {selectedJob.urgent && (
                  <p className="text-red-500 text-xs mb-1">Urgent</p>
                )}

                <div className="flex justify-between mb-3">
                  <p className="text-sm">{selectedJob.nama}</p>
                  <p className="text-lg font-semibold">{selectedJob.qty}</p>
                </div>

                {/* ================= MENUNGGU ================= */}
                {selectedJob.status === "menunggu" && (
                  <>
                    <input
                      placeholder="kode kain"
                      className="w-full border mb-2 px-2 py-1 text-sm rounded"
                    />

                    <input
                      placeholder="pemotong"
                      className="w-full border mb-2 px-2 py-1 text-sm rounded"
                    />

                    {/* ✅ TAMBAHAN */}
                    <input
                      placeholder="pengecek"
                      className="w-full border mb-3 px-2 py-1 text-sm rounded"
                    />

                    <button
                      onClick={() => {
                        if (!selectedJob) return;
                        setJobs((prev) =>
                          prev.map((j) =>
                            j.id === selectedJob?.id
                              ? { ...j, status: "proses" }
                              : j,
                          ),
                        );
                        setSelectedJobId(null);
                      }}
                      className="bg-purple-500 text-white text-xs px-3 py-1 rounded float-right"
                    >
                      proses
                    </button>
                  </>
                )}

                {/* ================= PROSES (NEW UI) ================= */}
                {selectedJob.status === "proses" && (
                  <>
                    <p className="text-center font-semibold text-sm mb-2">
                      kode potongan
                    </p>

                    <input
                      placeholder="A1 - ......"
                      value={formProses.kode}
                      onChange={(e) =>
                        setFormProses({ ...formProses, kode: e.target.value })
                      }
                      className="w-full border mb-2 px-2 py-1 text-sm rounded text-center"
                    />

                    <input
                      placeholder="jumlah lolos"
                      value={formProses.lolos}
                      onChange={(e) =>
                        setFormProses({ ...formProses, lolos: e.target.value })
                      }
                      className="w-full border mb-2 px-2 py-1 text-sm rounded"
                    />

                    <input
                      placeholder="pengecek"
                      value={formProses.pengecek}
                      onChange={(e) =>
                        setFormProses({
                          ...formProses,
                          pengecek: e.target.value,
                        })
                      }
                      className="w-full border mb-3 px-2 py-1 text-sm rounded"
                    />

                    <button
                      onClick={() => {
                        setJobs((prev) =>
                          prev.map((j) =>
                            j.id === selectedJob.id
                              ? {
                                  ...j,
                                  status: "selesai",
                                  hasil: Number(formProses.lolos || 0),
                                  kodePotong: formProses.kode,
                                  pengecek: formProses.pengecek,
                                }
                              : j,
                          ),
                        );

                        setFormProses({
                          kode: "",
                          lolos: "",
                          pengecek: "",
                        });

                        setSelectedJobId(null);
                      }}
                      className="bg-purple-500 text-white text-xs px-3 py-2 rounded w-full"
                    >
                      ok
                    </button>
                  </>
                )}

                {/* ================= SELESAI ================= */}
                {selectedJob.status === "selesai" && (
                  <>
                    <p className="text-center font-semibold text-sm mb-2">
                      Hasil potong
                    </p>

                    <div className="text-center mb-2">
                      <p className="text-lg font-bold">
                        {selectedJob.hasil ?? 0}
                      </p>
                    </div>

                    <div className="text-xs text-gray-500 mb-2 text-center">
                      <p>Kode: {selectedJob.kodePotong || "-"}</p>
                      <p>Pengecek: {selectedJob.pengecek || "-"}</p>
                    </div>

                    <button
                      onClick={() => {
                        setJobs((prev) =>
                          prev.map((j) =>
                            j.id === selectedJob.id
                              ? {
                                  ...j,
                                  status: "menunggu",
                                  hasil: null,
                                  kodePotong: undefined,
                                  pengecek: undefined,
                                }
                              : j,
                          ),
                        );

                        setSelectedJobId(null);
                      }}
                      className="bg-gray-300 text-xs px-3 py-2 rounded w-full"
                    >
                      Reset ke menunggu
                    </button>
                  </>
                )}
                {selectedJob.status === "kirim" && (
                  <>
                    <p className="text-center font-semibold text-sm mb-2">
                      Tracking Produksi
                    </p>

                    {/* HEADER */}
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-sm font-semibold">
                        {selectedJob.nama}
                      </p>
                      <p className="text-lg font-bold">{selectedJob.hasil}</p>
                    </div>

                    {/* PROSES */}
                    <div className="text-xs border-b pb-2 mb-2">
                      <p className="font-semibold text-gray-500 mb-1">PROSES</p>
                      <p>Kode Potong: {selectedJob.kodePotong || "-"}</p>
                      <p>Jumlah Lolos: {selectedJob.hasil || 0}</p>
                      <p>Pengecek: {selectedJob.pengecek || "-"}</p>
                    </div>

                    {/* STOK */}
                    <div className="text-xs border-b pb-2 mb-2">
                      <p className="font-semibold text-gray-500 mb-1">
                        STOK POTONG
                      </p>
                      <p>Ready: {selectedJob.hasil || 0}</p>
                    </div>

                    {/* KIRIM */}
                    <div className="text-xs">
                      <p className="font-semibold text-gray-500 mb-1">
                        KIRIM PENJAHIT
                      </p>
                      <p>Penjahit: {selectedJob.penjahit || "-"}</p>
                      <p>Admin: {selectedJob.admin || "-"}</p>
                      <p>Tanggal: {selectedJob.tanggalKirim || "-"}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* */}
          {selectedStokItem && (
            <div
              className="absolute inset-0 bg-black/40 flex items-center justify-center"
              onClick={() => setSelectedStokItem(null)}
            >
              <div
                className="bg-white p-4 rounded-xl w-[85%] shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                {/* HEADER */}
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-semibold">
                    {selectedStokItem.nama}
                  </p>
                  <p className="text-xl font-bold underline">
                    {selectedStokItem.hasil}
                  </p>
                </div>

                {/* INFO */}
                <div className="text-[10px] text-gray-600 mb-3">
                  <p>KODE POTONGAN : {selectedStokItem.kodePotong || "-"}</p>
                  <p>PENGECEK : {selectedStokItem.pengecek || "-"}</p>
                </div>

                {/* FORM */}
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>nama penjahit</span>
                    <input
                      value={formKirim.penjahit}
                      onChange={(e) =>
                        setFormKirim({ ...formKirim, penjahit: e.target.value })
                      }
                      className="border rounded px-2 py-1 w-30"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span>admin</span>
                    <input
                      value={formKirim.admin}
                      onChange={(e) =>
                        setFormKirim({ ...formKirim, admin: e.target.value })
                      }
                      className="border rounded px-2 py-1 w-30"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span>tanggal keluar</span>
                    <input
                      type="date"
                      value={formKirim.tanggal}
                      onChange={(e) =>
                        setFormKirim({ ...formKirim, tanggal: e.target.value })
                      }
                      className="border rounded px-2 py-1 w-30"
                    />
                  </div>
                </div>

                {/* BUTTON */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => {
                      setJobs((prev) =>
                        prev.map((j) =>
                          j.id === selectedStokItem.id
                            ? {
                                ...j,
                                status: "kirim",
                                penjahit: formKirim.penjahit,
                                admin: formKirim.admin,
                                tanggalKirim: formKirim.tanggal,
                              }
                            : j,
                        ),
                      );

                      // reset form
                      setFormKirim({
                        penjahit: "",
                        admin: "",
                        tanggal: "",
                      });

                      setSelectedStokItem(null);

                      // reset form
                      setFormKirim({
                        penjahit: "",
                        admin: "",
                        tanggal: "",
                      });

                      setSelectedStokItem(null);
                    }}
                    className="bg-purple-500 text-white text-xs px-4 py-1 rounded"
                  >
                    kirim
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
