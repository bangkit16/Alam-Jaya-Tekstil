"use client";

import { useState, useEffect } from "react";
import { Package, Briefcase, Bell } from "lucide-react";

export default function PenjahitMobile(props: any) {
  const handleLogout = props?.handleLogout || (() => {});

  const [screen, setScreen] = useState<"home" | "jobs">("home");

  type Job = {
    id: number;
    nama: string;
    qty: number;
    status: "menunggu" | "proses" | "selesai";
    penjahit?: string;
    tanggalKirim?: string;
  };

  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const selectedJob = jobs.find((j) => j.id === selectedJobId);

  const [filterStatus, setFilterStatus] = useState<
    "menunggu" | "proses" | "selesai"
  >("menunggu");

  const [form, setForm] = useState({
    penjahit: "",
    tanggal: "",
    kode: "",
    kurir: "",
    lolos: "",
    reject: "",
  });

  useEffect(() => {
    setJobs([
      {
        id: 1,
        nama: "Hoodie hitam XL",
        qty: 40,
        status: "menunggu",
      },
      {
        id: 2,
        nama: "Kaos putih M",
        qty: 25,
        status: "proses",
        penjahit: "Adit",
      },
    ]);
  }, []);

  //
  const handleResetAll = () => {
    setJobs((prev) =>
      prev.map((j) => ({
        ...j,
        status: "menunggu",
        penjahit: undefined,
        tanggalKirim: undefined,
      })),
    );

    // reset form juga biar bersih
    setForm({
      penjahit: "",
      tanggal: "",
      kode: "",
      kurir: "",
      lolos: "",
      reject: "",
    });

    // tutup modal kalau kebuka
    setSelectedJobId(null);
  };

  //
  // ================= HOME =================
  //
  if (screen === "home") {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#0f172a] via-[#1e3a8a] to-[#6d28d9] flex justify-center items-center p-4">
        <div className="w-full max-w-sm rounded-[40px] bg-white/95 p-5 shadow-2xl">
          <div className="bg-linear-to-r from-indigo-500 to-purple-500 text-white rounded-2xl p-4 mb-5">
            <h2 className="font-semibold text-sm">DIVISI JAHIT</h2>
            <p className="text-xs opacity-80">Production</p>
          </div>

          <h3 className="text-gray-700 text-sm font-semibold mb-4">
            Main Menu
          </h3>

          <div className="grid grid-cols-3 gap-3">
            <button className="flex flex-col items-center bg-white border rounded-2xl p-4">
              <Package size={26} />
              <span className="text-xs mt-2 text-gray-600">Stock</span>
            </button>

            <button
              onClick={() => setScreen("jobs")}
              className="flex flex-col items-center bg-indigo-500 text-white rounded-2xl p-4"
            >
              <Briefcase size={26} />
              <span className="text-xs mt-2">Jobs</span>
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
  // ================= JOBS =================
  //
  if (screen === "jobs") {
    const filtered = jobs.filter((j) => j.status === filterStatus);

    return (
      <div className="min-h-screen flex justify-center items-center p-4">
        <div className="w-full max-w-sm h-[90vh] bg-white rounded-[40px] p-5 flex flex-col relative">
          <h2 className="text-center font-semibold mb-2">View Jobs</h2>

          {/* SEARCH */}
          <input
            placeholder="Search..."
            className="w-full border rounded px-3 py-1 text-sm mb-2"
          />

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
            {filtered.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJobId(job.id)}
                className="border rounded-xl p-3 cursor-pointer"
              >
                <div className="flex justify-between">
                  <p className="text-sm">{job.nama}</p>
                  <p className="text-lg font-semibold">{job.qty}</p>
                </div>

                {job.penjahit && (
                  <p className="text-xs text-gray-400">
                    Penjahit: {job.penjahit}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* ACTION BUTTON */}
          <div className="mt-auto flex flex-col gap-2">
            {/* RESET */}
            <button
              onClick={handleResetAll}
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
              onClick={() => setSelectedJobId(null)}
            >
              <div
                className="bg-white p-4 rounded-xl w-[85%]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between mb-3">
                  <p className="text-sm">{selectedJob.nama}</p>
                  <p className="text-lg font-semibold">{selectedJob.qty}</p>
                </div>

                {/* ================= MENUNGGU ================= */}
                {selectedJob.status === "menunggu" && (
                  <div className="bg-white border rounded-xl p-3 shadow">
                    {/* HEADER */}
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-semibold">
                        {selectedJob.nama}
                      </p>
                      <p className="text-lg font-bold underline">
                        {selectedJob.qty}
                      </p>
                    </div>

                    {/* FORM */}
                    <div className="text-xs text-gray-600 space-y-2">
                      <div className="flex items-center justify-between">
                        <span>kode potongan</span>
                        <input className="border rounded-full px-2 py-0.5 w-30 text-xs" />
                      </div>

                      <div className="flex items-center justify-between">
                        <span>nama penjahit</span>
                        <input
                          value={form.penjahit || ""}
                          onChange={(e) =>
                            setForm({ ...form, penjahit: e.target.value })
                          }
                          className="border rounded-full px-2 py-0.5 w-30 text-xs"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span>kurir</span>
                        <input className="border rounded-full px-2 py-0.5 w-30 text-xs" />
                      </div>
                    </div>

                    {/* BUTTON */}
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={() => {
                          setJobs((prev) =>
                            prev.map((j) =>
                              j.id === selectedJob.id
                                ? {
                                    ...j,
                                    status: "proses",
                                    penjahit: form.penjahit,
                                  }
                                : j,
                            ),
                          );
                          setSelectedJobId(null);
                          setForm({
                            penjahit: "",
                            tanggal: "",
                            kode: "",
                            kurir: "",
                            lolos: "",
                            reject: "",
                          });
                        }}
                        className="bg-purple-500 text-white text-[10px] px-3 py-1 rounded-full"
                      >
                        proses
                      </button>
                    </div>
                  </div>
                )}

                {/* ================= PROSES ================= */}
                {selectedJob.status === "proses" && (
                  <div className="bg-white border rounded-xl p-3 shadow">
                    {/* HEADER */}
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-semibold">
                        {selectedJob.nama}
                      </p>
                      <p className="text-lg font-bold underline">
                        {selectedJob.qty}
                      </p>
                    </div>

                    {/* FORM */}
                    <div className="text-xs text-gray-600 space-y-2">
                      <div className="flex items-center justify-between">
                        <span>kode potongan</span>
                        <input
                          value={form.kode || ""}
                          onChange={(e) =>
                            setForm({ ...form, kode: e.target.value })
                          }
                          className="border rounded-full px-2 py-0.5 w-30 text-xs"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span>tanggal kirim</span>
                        <input
                          type="date"
                          value={form.tanggal || ""}
                          onChange={(e) =>
                            setForm({ ...form, tanggal: e.target.value })
                          }
                          className="border rounded-full px-2 py-0.5 w-30 text-xs"
                        />
                      </div>
                    </div>

                    {/* BUTTON */}
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={() => {
                          setJobs((prev) =>
                            prev.map((j) =>
                              j.id === selectedJob.id
                                ? {
                                    ...j,
                                    status: "selesai",
                                    tanggalKirim: form.tanggal,
                                  }
                                : j,
                            ),
                          );

                          setSelectedJobId(null);
                          setForm({
                            penjahit: "",
                            tanggal: "",
                            kode: "",
                            kurir: "",
                            lolos: "",
                            reject: "",
                          });
                        }}
                        className="bg-purple-500 text-white text-[10px] px-3 py-1 rounded-full"
                      >
                        selesai
                      </button>
                    </div>
                  </div>
                )}

                {/* ================= SELESAI ================= */}
                {selectedJob.status === "selesai" && (
                  <div className="bg-white border rounded-xl p-3 shadow">
                    {/* HEADER */}
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-semibold">
                        {selectedJob.nama}
                      </p>
                      <p className="text-lg font-bold underline">
                        {selectedJob.qty}
                      </p>
                    </div>

                    {/* INFO */}
                    <div className="text-[10px] text-gray-500 mb-2">
                      <p>KODE: {form.kode || "-"}</p>
                      <p>PENJAHIT: {selectedJob.penjahit || "-"}</p>
                      <p>TANGGAL: {selectedJob.tanggalKirim || "-"}</p>
                    </div>

                    {/* FORM */}
                    <div className="text-xs text-gray-600 space-y-2">
                      <div className="flex items-center justify-between">
                        <span>jumlah lolos</span>
                        <input
                          value={form.lolos || ""}
                          onChange={(e) =>
                            setForm({ ...form, lolos: e.target.value })
                          }
                          className="border rounded-full px-2 py-0.5 w-30 text-xs"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span>reject</span>
                        <input
                          value={form.reject || ""}
                          onChange={(e) =>
                            setForm({ ...form, reject: e.target.value })
                          }
                          className="border rounded-full px-2 py-0.5 w-30 text-xs"
                        />
                      </div>
                    </div>

                    {/* BUTTON */}
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={() => setSelectedJobId(null)}
                        className="bg-gray-300 text-[10px] px-3 py-1 rounded-full"
                      >
                        close
                      </button>
                    </div>
                  </div>
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
