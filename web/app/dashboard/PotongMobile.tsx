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
    status: "menunggu" | "proses" | "selesai";
    urgent: boolean;
    hasil: number | null;

    // 🔥 TAMBAHAN
    kodePotong?: string;
    pengecek?: string;
  };

  const [jobs, setJobs] = useState<Job[]>([]);

  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const selectedJob = jobs.find((j) => j.id === selectedJobId) || null;

  const [filterStatus, setFilterStatus] = useState<
    "menunggu" | "proses" | "selesai"
  >("menunggu");

  const [hasilSize, setHasilSize] = useState({
    XXL: "",
    XL: "",
    L: "",
    M: "",
  });

  const [mounted, setMounted] = useState(false);

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
        {
          id: 2,
          nama: "Kaos tipis merah cabai M",
          qty: 50,
          status: "menunggu",
          urgent: false,
          hasil: null,
        },
        {
          id: 3,
          nama: "Hoodie Biru XXL",
          qty: 30,
          status: "menunggu",
          urgent: false,
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
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#6d28d9] flex justify-center items-center p-4">
        <div className="w-full max-w-sm rounded-[40px] bg-white/95 p-5 shadow-2xl">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl p-4 mb-5">
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
    const filteredJobs = jobs.filter((job) => job.status === filterStatus);
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
            {["menunggu", "proses", "selesai"].map((item) => (
              <button
                key={item}
                onClick={() =>
                  setFilterStatus(item as "menunggu" | "proses" | "selesai")
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
            {filteredJobs.map((job) => (
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
          <button onClick={() => setScreen("home")} className="mt-auto text-xs">
            ← Back
          </button>

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
                      className="w-full border mb-2 px-2 py-1 text-sm rounded text-center"
                    />

                    <input
                      placeholder="jumlah lolos"
                      className="w-full border mb-2 px-2 py-1 text-sm rounded"
                    />

                    <input
                      placeholder="pengecek"
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
                                  hasil: selectedJob.qty,
                                  kodePotong: "A1-001",
                                  pengecek: "Budi",
                                }
                              : j,
                          ),
                        );

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
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
