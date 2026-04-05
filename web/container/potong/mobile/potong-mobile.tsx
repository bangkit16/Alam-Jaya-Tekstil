"use client";

import { useState, useEffect } from "react";

import Jobs from "./screen/jobs";
import Home from "./screen/home";
import Stock from "./screen/stock";
import StockBahan from "./screen/stockBahan";
import StockProduct from "./screen/stockProduct";

export default function PotongMobile(props: any) {
  const handleLogout = props?.handleLogout || (() => {});

  const [screen, setScreen] = useState<
    "home" | "stock" | "stockBahan" | "stockProduct" | "jobs"
  >("home");

  const [jobs, setJobs] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    try {
      const saved = localStorage.getItem("jobs");

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed) && parsed.length > 0) {
          setJobs(parsed);
          return;
        }
      }

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
      ]);
    } catch {
      localStorage.removeItem("jobs");
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("jobs", JSON.stringify(jobs));
    }
  }, [jobs, mounted]);

  if (!mounted) return null;

  return (
    <>
      {screen === "home" && (
        <Home key="home" setScreen={setScreen} handleLogout={handleLogout} />
      )}

      {screen === "stock" && <Stock key="stock" setScreen={setScreen} />}

      {screen === "stockBahan" && (
        <StockBahan key="stockBahan" setScreen={setScreen} />
      )}

      {screen === "stockProduct" && (
        <StockProduct key="stockProduct" setScreen={setScreen} />
      )}

      {screen === "jobs" && (
        <Jobs key="jobs" jobs={jobs} setJobs={setJobs} setScreen={setScreen} />
      )}
    </>
  );
}
