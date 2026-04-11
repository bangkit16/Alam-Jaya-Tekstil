"use client";

import { useState, useEffect } from "react";
import Menunggu from "./jobs-screen/Menunggu";
import Proses from "./jobs-screen/Proses";
import Selesai from "./jobs-screen/Selesai";

type statusType = "menunggu" | "proses" | "selesai";

export default function Jobs({ setScreen }: any) {
  const [filterStatus, setFilterStatus] = useState<statusType>("menunggu");
  const [search, setSearch] = useState("");

  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const [form, setForm] = useState({
    kurir: "",
    tanggalKirim: "",
  });

  // DUMMY DATA
  useEffect(() => {
    setJobs([
      {
        id: 1,
        nama: "Hoodie hitam XL",
        qty: 40,
        status: "menunggu",
        kurir: "",
        tanggalKirim: "",
      },
      {
        id: 2,
        nama: "Kaos merah M",
        qty: 25,
        status: "menunggu",
        kurir: "",
        tanggalKirim: "",
      },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 flex justify-center items-center p-4">
      <div className="w-full max-w-sm h-[90vh] bg-white rounded-[40px] shadow-2xl p-4 flex flex-col relative">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-orange-400 to-amber-500 text-white rounded-2xl py-2 text-center text-sm font-medium mb-4 shadow">
          View Jobs
        </div>

        {/* SEARCH */}
        <input
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-100 rounded-xl px-3 py-2 text-sm mb-3"
        />

        {/* FILTER */}
        <div className="grid grid-cols-3 gap-2 mb-4 bg-gray-100 p-1 rounded-xl text-xs">
          {["menunggu", "proses", "selesai"].map((item) => (
            <button
              key={item}
              onClick={() => setFilterStatus(item as statusType)}
              className={`py-1.5 rounded-lg ${
                filterStatus === item
                  ? "bg-white shadow font-medium"
                  : "text-gray-500"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-auto">
          {filterStatus === "menunggu" && (
            <Menunggu
              jobs={jobs}
              setJobs={setJobs}
              setSelectedJob={setSelectedJob}
              form={form}
              setForm={setForm}
            />
          )}

          {filterStatus === "proses" && (
            <Proses
              jobs={jobs}
              setJobs={setJobs}
              setSelectedJob={setSelectedJob}
              form={form}
              setForm={setForm}
            />
          )}

          {filterStatus === "selesai" && (
            <Selesai jobs={jobs} setSelectedJob={setSelectedJob} />
          )}
        </div>

        {/* BACK */}
        <button
          onClick={() => setScreen("home")}
          className="mt-3 bg-gray-100 py-2 rounded-xl text-xs"
        >
          Kembali
        </button>
      </div>
    </div>
  );
}
