"use client";

import { useState, useEffect } from "react";
import Home from "./screen/home";
import Jobs from "./screen/jobs";

export default function PenjahitMobile(props: any) {
  const handleLogout = props?.handleLogout || (() => {});

  const [screen, setScreen] = useState<"home" | "jobs">("home");
  const [jobs, setJobs] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  // 🔥 DEFAULT DATA
  const defaultJobs = [
    {
      id: 1,
      nama: "Hoodie hitam XL",
      qty: 40,
      status: "menunggu",
      penjahit: null,
      tanggalKirim: null,
    },
    {
      id: 2,
      nama: "Kaos putih M",
      qty: 25,
      status: "menunggu",
      penjahit: null,
      tanggalKirim: null,
    },
  ];

  // LOAD DATA
  useEffect(() => {
    setMounted(true);

    try {
      const saved = localStorage.getItem("jahit_jobs");

      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setJobs(parsed);
          return;
        }
      }

      setJobs(defaultJobs);
    } catch {
      localStorage.removeItem("jahit_jobs");
    }
  }, []);

  // SAVE
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("jahit_jobs", JSON.stringify(jobs));
    }
  }, [jobs, mounted]);

  // RESET
  const handleResetJobs = () => {
    setJobs(defaultJobs);
    localStorage.removeItem("jahit_jobs");
  };

  if (!mounted) return null;

  return (
    <>
      {screen === "home" && (
        <Home setScreen={setScreen} handleLogout={handleLogout} />
      )}

      {screen === "jobs" && (
        <Jobs
          jobs={jobs}
          setJobs={setJobs}
          setScreen={setScreen}
          handleResetJobs={handleResetJobs}
        />
      )}
    </>
  );
}
