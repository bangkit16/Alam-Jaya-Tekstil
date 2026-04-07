"use client";

import { useState, useEffect } from "react";

export default function Jobs({ setScreen }: any) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState("menunggu");
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const [form, setForm] = useState({
    kode: "",
    penjahit: "",
    kurir: "",
    tanggalKirim: "",
  });

  // 🔥 DUMMY DATA
  useEffect(() => {
    setJobs([
      {
        id: 1,
        nama: "Hoodie hitam XL",
        qty: 40,
        status: "menunggu",
        kode: "",
        penjahit: "",
        kurir: "",
        tanggalKirim: "",
      },
      {
        id: 2,
        nama: "Kaos merah M",
        qty: 25,
        status: "menunggu",
        kode: "",
        penjahit: "",
        kurir: "",
        tanggalKirim: "",
      },
    ]);
  }, []);

  const filteredJobs = jobs.filter(
    (j: any) =>
      j.status === filterStatus &&
      j.nama.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center items-center p-4">
      <div className="w-full max-w-sm h-[90vh] bg-white rounded-[40px] shadow-xl p-4 flex flex-col relative">
        {/* HEADER */}
        <div className="border border-gray-300 rounded-2xl py-2 text-center text-sm font-medium mb-3">
          View Jobs
        </div>

        {/* SEARCH */}
        <input
          placeholder="Search........"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 text-sm mb-2"
        />

        {/* FILTER */}
        <div className="flex justify-between text-xs mb-3">
          {["menunggu", "proses", "selesai"].map((item) => (
            <button
              key={item}
              onClick={() => setFilterStatus(item)}
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

        {/* LIST */}
        <div className="flex flex-col gap-3 overflow-y-auto">
          {filteredJobs.map((job: any) => (
            <div
              key={job.id}
              onClick={() => setSelectedJob(job)}
              className={`border rounded-2xl p-3 cursor-pointer ${
                job.status !== "selesai"
                  ? "bg-white border border-gray-300 text-black"
                  : "bg-white"
              }`}
            >
              <div className="flex justify-between">
                <p>{job.nama}</p>
                <p className="text-2xl font-bold">{job.qty}</p>
              </div>

              {/* INFO */}
              <div className="text-[10px] mt-2">
                <p>KODE: {job.kode || "-"}</p>
                <p>PENJAHIT: {job.penjahit || "-"}</p>
                <p>KURIR: {job.kurir || "-"}</p>
                <p>TGL KIRIM: {job.tanggalKirim || "-"}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ACTION */}
        <div className="mt-auto flex flex-col gap-2">
          <button
            onClick={() =>
              setJobs((prev) => prev.map((j) => ({ ...j, status: "menunggu" })))
            }
            className="w-full bg-red-500 text-white text-xs py-2 rounded"
          >
            Reset Semua ke Menunggu
          </button>

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
            onClick={() => setSelectedJob(null)}
          >
            <div
              className="bg-white p-4 rounded-xl w-[85%]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between mb-2">
                <p>{selectedJob.nama}</p>
                <p className="font-bold">{selectedJob.qty}</p>
              </div>

              <hr className="mb-3" />

              {/* MENUNGGU */}
              {selectedJob.status === "menunggu" && (
                <>
                  <input
                    placeholder="kode potongan"
                    className="w-full border mb-2 px-2 py-1 rounded"
                    onChange={(e) => setForm({ ...form, kode: e.target.value })}
                  />

                  <input
                    placeholder="penjahit"
                    className="w-full border mb-2 px-2 py-1 rounded"
                    onChange={(e) =>
                      setForm({ ...form, penjahit: e.target.value })
                    }
                  />

                  <input
                    placeholder="kurir"
                    className="w-full border mb-3 px-2 py-1 rounded"
                    onChange={(e) =>
                      setForm({ ...form, kurir: e.target.value })
                    }
                  />

                  <button
                    onClick={() => {
                      setJobs((prev) =>
                        prev.map((j) =>
                          j.id === selectedJob.id
                            ? {
                                ...j,
                                status: "proses",
                                kode: form.kode,
                                penjahit: form.penjahit,
                                kurir: form.kurir,
                              }
                            : j,
                        ),
                      );
                      setSelectedJob(null);
                    }}
                    className="bg-purple-500 text-white text-xs px-3 py-1 rounded float-right"
                  >
                    proses
                  </button>
                </>
              )}

              {/* PROSES */}
              {selectedJob.status === "proses" && (
                <>
                  <input
                    type="date"
                    className="w-full border mb-3 px-2 py-1 rounded"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        tanggalKirim: e.target.value,
                      })
                    }
                  />

                  <button
                    onClick={() => {
                      setJobs((prev) =>
                        prev.map((j) =>
                          j.id === selectedJob.id
                            ? {
                                ...j,
                                status: "selesai",
                                tanggalKirim: form.tanggalKirim,
                              }
                            : j,
                        ),
                      );
                      setSelectedJob(null);
                    }}
                    className="bg-purple-500 text-white text-xs px-3 py-1 rounded float-right"
                  >
                    selesai
                  </button>
                </>
              )}

              {/* SELESAI */}
              {selectedJob.status === "selesai" && (
                <div className="text-xs space-y-1">
                  <p>KODE: {selectedJob.kode}</p>
                  <p>PENJAHIT: {selectedJob.penjahit}</p>
                  <p>KURIR: {selectedJob.kurir}</p>
                  <p>TGL KIRIM: {selectedJob.tanggalKirim}</p>

                  <button
                    onClick={() => setSelectedJob(null)}
                    className="mt-3 w-full bg-gray-300 text-[10px] py-1 rounded"
                  >
                    close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
