"use client";

import { useState } from "react";

export default function Jobs({
  jobs,
  setJobs,
  setScreen,
  handleResetJobs,
}: any) {
  const [filterStatus, setFilterStatus] = useState("menunggu");
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  const selectedJob = jobs.find((j: any) => j.id === selectedJobId);

  const [form, setForm] = useState({
    penjahit: "",
    tanggal: "",
  });

  const filtered = jobs.filter((j: any) => j.status === filterStatus);

  return (
    <div className="min-h-[100dvh] flex justify-center items-center p-4 bg-gray-100">
      <div className="w-full max-w-sm min-h-[90dvh] bg-white rounded-[40px] p-5 pb-16 flex flex-col relative shadow-xl overflow-hidden">
        <h2 className="text-center font-semibold mb-2">View Jobs</h2>

        {/* FILTER */}
        <div className="flex justify-between text-xs mb-3">
          {["menunggu", "proses", "selesai"].map((item) => (
            <button
              key={item}
              onClick={() => setFilterStatus(item)}
              className={`flex-1 py-1 ${
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
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
          {filtered.map((job: any) => (
            <div
              key={job.id}
              onClick={() => setSelectedJobId(job.id)}
              className="border p-3 rounded-xl"
            >
              <div className="flex justify-between">
                <p>{job.nama}</p>
                <p>{job.qty}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ACTION */}
        <div className="absolute bottom-0 left-0 w-full p-4 bg-white border-t flex flex-col gap-2">
          <button
            onClick={handleResetJobs}
            className="bg-red-500 text-white py-2 rounded"
          >
            Reset Semua
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
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-4 rounded-xl w-[85%]">
              <p>{selectedJob.nama}</p>

              {selectedJob.status === "menunggu" && (
                <button
                  onClick={() => {
                    setJobs((prev: any[]) =>
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
                  }}
                  className="bg-purple-500 text-white px-3 py-1 rounded"
                >
                  proses
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
