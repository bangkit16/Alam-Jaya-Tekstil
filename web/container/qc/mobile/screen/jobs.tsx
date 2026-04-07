"use client";

import { useState, useEffect } from "react";

export default function Jobs({ setScreen }: any) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState("menunggu");
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const [form, setForm] = useState({
    hasil: "",
    admin: "",
    tanggal: "",
    kodeBox: "",
    permak: 0,
    reject: 0,
    turunSize: 0,
    kotor: 0,
    lolos: 0,
  });

  // 🔥 DUMMY DATA QC
  useEffect(() => {
    setJobs([
      {
        id: 1,
        nama: "Hoodie hitam XL",
        qty: 40,
        status: "menunggu",
        hasil: "",
        admin: "",
        tanggal: "",
        kodeBox: "",
      },
      {
        id: 2,
        nama: "Kaos merah M",
        qty: 25,
        status: "menunggu",
        hasil: "",
        admin: "",
        tanggal: "",
        kodeBox: "",
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
          {[
            { label: "menunggu", value: "menunggu" },
            { label: "sedang proses", value: "proses" },
            { label: "input box", value: "input" },
            { label: "selesai", value: "selesai" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setFilterStatus(item.value)}
              className={`flex-1 text-center py-1 ${
                filterStatus === item.value
                  ? "font-semibold text-black"
                  : "text-gray-400"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* LIST */}
        <div className="flex flex-col gap-3 overflow-y-auto">
          {filteredJobs.map((job: any) => (
            <div
              key={job.id}
              onClick={() => setSelectedJob(job)}
              className="border border-gray-300 rounded-2xl p-3 cursor-pointer bg-white"
            >
              <div className="flex justify-between">
                <p>{job.nama}</p>
                <p className="text-2xl font-bold">{job.qty}</p>
              </div>

              <div className="text-[10px] mt-2">
                <p>HASIL: {job.hasil || "-"}</p>
                <p>ADMIN: {job.admin || "-"}</p>
                <p>TANGGAL: {job.tanggal || "-"}</p>
                <p>KODE BOX: {job.kodeBox || "-"}</p>
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

        {/* ================= MODAL ================= */}
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
                    placeholder="admin"
                    className="w-full border mb-2 px-2 py-1 rounded"
                    onChange={(e) =>
                      setForm({ ...form, admin: e.target.value })
                    }
                  />

                  <input
                    type="date"
                    className="w-full border mb-3 px-2 py-1 rounded"
                    onChange={(e) =>
                      setForm({ ...form, tanggal: e.target.value })
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
                                admin: form.admin,
                                tanggal: form.tanggal,
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
                  <p className="text-center text-sm mb-2">hasil</p>

                  {/* GRID HASIL */}
                  <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                    {[
                      { label: "permak", key: "permak" },
                      { label: "reject", key: "reject" },
                      { label: "turun size", key: "turunSize" },
                      { label: "kotor", key: "kotor" },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex flex-col items-center"
                      >
                        <input
                          type="number"
                          className="w-full border px-2 py-1 rounded text-center"
                          placeholder="0"
                          onChange={(e) =>
                            setForm({
                              ...form,
                              [item.key]: Number(e.target.value),
                            })
                          }
                        />
                        <span className="text-[10px] mt-1">{item.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* LOLOS */}
                  <input
                    type="number"
                    placeholder="lolos"
                    className="w-full border mb-3 px-2 py-1 rounded text-center"
                    onChange={(e) =>
                      setForm({ ...form, lolos: Number(e.target.value) })
                    }
                  />

                  {/* BUTTON */}
                  <button
                    onClick={() => {
                      setJobs((prev) =>
                        prev.map((j) =>
                          j.id === selectedJob.id
                            ? {
                                ...j,
                                status: "input",
                                hasil: `Lolos:${form.lolos} | Permak:${form.permak} | Reject:${form.reject}`,
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

              {/* INPUT BOX */}
              {selectedJob.status === "input" && (
                <>
                  <p className="text-center font-medium mb-3">Masuk Box</p>

                  {/* INFO */}
                  <div className="text-[10px] text-gray-500 mb-3">
                    <p>DI PINDAHKAN KE BOX : 2</p>
                    <p>JUMLAH : {selectedJob.qty}</p>
                  </div>

                  {/* ADMIN */}
                  <input
                    placeholder="admin"
                    className="w-full border mb-2 px-2 py-1 rounded text-center"
                    onChange={(e) =>
                      setForm({ ...form, admin: e.target.value })
                    }
                  />

                  {/* TANGGAL */}
                  <input
                    type="date"
                    className="w-full border mb-2 px-2 py-1 rounded text-center"
                    onChange={(e) =>
                      setForm({ ...form, tanggal: e.target.value })
                    }
                  />

                  {/* KODE BOX */}
                  <input
                    placeholder="nomor / kode"
                    className="w-full border mb-3 px-2 py-1 rounded text-center"
                    onChange={(e) =>
                      setForm({ ...form, kodeBox: e.target.value })
                    }
                  />

                  {/* BUTTON */}
                  <button
                    onClick={() => {
                      setJobs((prev) =>
                        prev.map((j) =>
                          j.id === selectedJob.id
                            ? {
                                ...j,
                                status: "selesai",
                                kodeBox: form.kodeBox,
                                admin: form.admin,
                                tanggal: form.tanggal,
                              }
                            : j,
                        ),
                      );
                      setSelectedJob(null);
                    }}
                    className="bg-purple-500 text-white text-xs px-4 py-1 rounded float-right"
                  >
                    kirim
                  </button>
                </>
              )}

              {/* SELESAI */}
              {selectedJob.status === "selesai" && (
                <div className="text-xs space-y-1">
                  <p>HASIL: {selectedJob.hasil}</p>
                  <p>ADMIN: {selectedJob.admin}</p>
                  <p>TANGGAL: {selectedJob.tanggal}</p>
                  <p>KODE BOX: {selectedJob.kodeBox}</p>

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
