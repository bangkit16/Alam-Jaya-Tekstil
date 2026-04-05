"use client";

import { useState } from "react";

export default function Jobs({ jobs, setJobs, setScreen }: any) {
  const [filterStatus, setFilterStatus] = useState("menunggu");
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const [form, setForm] = useState({
    kode: "",
    pemotong: "",
    pengecek: "",
  });

  // 🔥 TAMBAHAN
  const [selectedStok, setSelectedStok] = useState<string | null>(null);
  const [selectedStokItem, setSelectedStokItem] = useState<any>(null);

  const [formKirim, setFormKirim] = useState({
    penjahit: "",
    admin: "",
    tanggal: "",
  });

  // 🔥 FILTER BARU
  const filteredJobs =
    filterStatus === "stok"
      ? []
      : filterStatus === "kirim"
        ? jobs.filter((j: any) => j.status === "kirim")
        : jobs.filter(
            (j: any) =>
              j.status === filterStatus &&
              j.nama.toLowerCase().includes(search.toLowerCase()),
          );

  //
  const [selectedKirim, setSelectedKirim] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center items-center p-4">
      <div className="w-full max-w-sm h-[90vh] bg-white rounded-[40px] shadow-xl p-4 flex flex-col relative">
        {/* HEADER */}
        <div className="border rounded-2xl py-2 text-center text-sm font-medium mb-3">
          View Jobs
        </div>

        {/* SEARCH */}
        <input
          placeholder="Search........"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-1 text-sm mb-2"
        />

        {/* FILTER */}
        <div className="flex justify-between text-xs mb-3">
          {["menunggu", "proses", "stok", "kirim"].map((item) => (
            <button
              key={item}
              onClick={() => {
                setFilterStatus(item);
                setSelectedStok(null); // reset
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
          {/* 🔥 ================= STOK POTONG ================= */}
          {filterStatus === "stok" && (
            <>
              {!selectedStok && (
                <>
                  {["hoodie", "kaos", "singlet", "sweater"].map((item) => (
                    <button
                      key={item}
                      onClick={() => setSelectedStok(item)}
                      className="p-3 rounded-full border text-sm"
                    >
                      {item}
                    </button>
                  ))}
                </>
              )}

              {selectedStok && (
                <>
                  <button
                    onClick={() => setSelectedStok(null)}
                    className="text-xs mb-2"
                  >
                    ← Back
                  </button>

                  {jobs
                    .filter(
                      (j: any) =>
                        j.status === "selesai" &&
                        j.nama.toLowerCase().includes(selectedStok),
                    )
                    .map((item: any) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedStokItem(item)}
                        className="p-3 border rounded-xl cursor-pointer"
                      >
                        <div className="flex justify-between">
                          <p>{item.nama}</p>
                          <p className="font-bold">{item.hasil}</p>
                        </div>
                      </div>
                    ))}
                </>
              )}
            </>
          )}

          {/*  */}
          {/* 🔥 MENUNGGU + PROSES */}
          {filterStatus !== "stok" &&
            filterStatus !== "kirim" &&
            filteredJobs.map((job: any) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className="border rounded-2xl p-3 flex justify-between items-center cursor-pointer"
              >
                <div>
                  {job.urgent && (
                    <p className="text-red-500 text-xs font-semibold">Urgent</p>
                  )}
                  <p className="text-sm">{job.nama}</p>
                </div>

                <p className="text-2xl font-bold">{job.qty}</p>
              </div>
            ))}
          {/* 🔥 ================= JOB LIST ================= */}
          {filterStatus === "kirim" &&
            filteredJobs.map((job: any) => (
              <div
                key={job.id}
                onClick={() => setSelectedKirim(job)}
                className="border rounded-2xl p-3 cursor-pointer"
              >
                <div className="flex justify-between">
                  <p className="text-sm">{job.nama}</p>
                  <p className="text-lg font-bold">{job.qty}</p>
                </div>

                <div className="text-[10px] text-gray-500 mt-2">
                  <p>Nama Penjahit: {job.penjahit || "-"}</p>
                  <p>Admin: {job.admin || "-"}</p>
                  <p>Tanggal: {job.tanggalKirim || "-"}</p>
                </div>
              </div>
            ))}
        </div>

        {/* BACK */}
        <div className="mt-auto flex flex-col gap-2">
          {/* RESET */}
          <button
            onClick={() => {
              setJobs((prev: any) =>
                prev.map((j: any) => ({
                  ...j,
                  status: "menunggu",
                  hasil: null,
                  kodePotong: undefined,
                  pengecek: undefined,
                  penjahit: undefined,
                  admin: undefined,
                  tanggalKirim: undefined,
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

        {/* ================= MODAL JOB ================= */}
        {selectedJob && (
          <div
            className="absolute inset-0 bg-black/40 flex items-center justify-center"
            onClick={() => setSelectedJob(null)}
          >
            <div
              className="bg-white p-4 rounded-xl w-[85%]"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedJob.urgent && (
                <p className="text-red-500 text-xs mb-1">Urgent</p>
              )}

              <div className="flex justify-between mb-2">
                <p>{selectedJob.nama}</p>
                <p className="font-bold">{selectedJob.qty}</p>
              </div>

              <hr className="mb-3" />

              {/* MENUNGGU */}
              {selectedJob.status === "menunggu" && (
                <>
                  <input
                    placeholder="kode kain"
                    className="w-full border mb-2 px-2 py-1 rounded"
                  />
                  <input
                    placeholder="pemotong"
                    className="w-full border mb-2 px-2 py-1 rounded"
                  />
                  <input
                    placeholder="pengecek"
                    className="w-full border mb-3 px-2 py-1 rounded"
                  />

                  <button
                    onClick={() => {
                      setJobs((prev: any) =>
                        prev.map((j: any) =>
                          j.id === selectedJob.id
                            ? { ...j, status: "proses" }
                            : j,
                        ),
                      );
                      setSelectedJob(null);
                    }}
                    className="bg-purple-500 text-white text-xs px-3 py-1 rounded float-right"
                  >
                    cek
                  </button>
                </>
              )}

              {/* PROSES */}
              {selectedJob.status === "proses" && (
                <>
                  <input
                    placeholder="kode potongan"
                    value={form.kode}
                    onChange={(e) => setForm({ ...form, kode: e.target.value })}
                    className="w-full border mb-2 px-2 py-1 rounded text-center"
                  />

                  <input
                    placeholder="jumlah lolos"
                    value={form.pemotong}
                    onChange={(e) =>
                      setForm({ ...form, pemotong: e.target.value })
                    }
                    className="w-full border mb-2 px-2 py-1 rounded"
                  />

                  <input
                    placeholder="pengecek"
                    value={form.pengecek}
                    onChange={(e) =>
                      setForm({ ...form, pengecek: e.target.value })
                    }
                    className="w-full border mb-3 px-2 py-1 rounded"
                  />

                  <button
                    onClick={() => {
                      setJobs((prev: any) =>
                        prev.map((j: any) =>
                          j.id === selectedJob.id
                            ? {
                                ...j,
                                status: "selesai",
                                hasil: 38, // nanti bisa dari input
                                kodePotong: form.kode,
                                pengecek: form.pengecek,
                              }
                            : j,
                        ),
                      );

                      setForm({
                        kode: "",
                        pemotong: "",
                        pengecek: "",
                      });

                      setSelectedJob(null);
                    }}
                    className="bg-purple-500 text-white text-xs px-3 py-1 rounded float-right"
                  >
                    ok
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* ================= MODAL KIRIM ================= */}
        {selectedStokItem && (
          <div
            className="absolute inset-0 bg-black/40 flex items-center justify-center"
            onClick={() => setSelectedStokItem(null)}
          >
            <div
              className="bg-white p-4 rounded-xl w-[85%]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between mb-3">
                <p>{selectedStokItem.nama}</p>
                <p className="font-bold">{selectedStokItem.hasil}</p>
              </div>

              <div className="flex flex-col gap-2 text-sm">
                <input
                  placeholder="nama penjahit"
                  value={formKirim.penjahit}
                  onChange={(e) =>
                    setFormKirim({ ...formKirim, penjahit: e.target.value })
                  }
                  className="border px-2 py-1 rounded"
                />

                <input
                  placeholder="admin"
                  value={formKirim.admin}
                  onChange={(e) =>
                    setFormKirim({ ...formKirim, admin: e.target.value })
                  }
                  className="border px-2 py-1 rounded"
                />

                <input
                  type="date"
                  value={formKirim.tanggal}
                  onChange={(e) =>
                    setFormKirim({ ...formKirim, tanggal: e.target.value })
                  }
                  className="border px-2 py-1 rounded"
                />
              </div>

              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => {
                    setJobs((prev: any) =>
                      prev.map((j: any) =>
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

                    setSelectedStokItem(null);
                  }}
                  className="bg-purple-500 text-white text-xs px-3 py-1 rounded"
                >
                  kirim
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {selectedKirim && (
        <div
          className="absolute inset-0 bg-black/40 flex items-center justify-center"
          onClick={() => setSelectedKirim(null)}
        >
          <div
            className="bg-white p-4 rounded-xl w-[85%]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex justify-between mb-3">
              <p className="text-sm font-semibold">{selectedKirim.nama}</p>
              <p className="text-xl font-bold">{selectedKirim.hasil || 0}</p>
            </div>

            {/* PROSES */}
            <div className="text-xs border-b pb-2 mb-2">
              <p className="font-semibold text-gray-500 mb-1">PROSES</p>
              <p>Kode Potong: {selectedKirim.kodePotong || "-"}</p>
              <p>Jumlah Lolos: {selectedKirim.hasil || 0}</p>
              <p>Pengecek: {selectedKirim.pengecek || "-"}</p>
            </div>

            {/* STOK */}
            <div className="text-xs border-b pb-2 mb-2">
              <p className="font-semibold text-gray-500 mb-1">STOK POTONG</p>
              <p>Ready: {selectedKirim.hasil || 0}</p>
            </div>

            {/* KIRIM */}
            <div className="text-xs">
              <p className="font-semibold text-gray-500 mb-1">KIRIM PENJAHIT</p>
              <p>Penjahit: {selectedKirim.penjahit || "-"}</p>
              <p>Admin: {selectedKirim.admin || "-"}</p>
              <p>Tanggal: {selectedKirim.tanggalKirim || "-"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
