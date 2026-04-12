"use client";

import { useState } from "react";

// 🔥 SCREEN (samain pattern potong)
import Home from "./screen/home";
import Stock from "./screen/stock";
import StockMasuk from "./screen/stockMasuk";
import StockKeluar from "./screen/stockKeluar";
import Jobs from "./screen/jobs";

type screenType = "home" | "stock" | "stockMasuk" | "stockKeluar" | "jobs";

export default function StokGudangMobile(props: any) {
  const handleLogout = props?.handleLogout || (() => {});

  const [screen, setScreen] = useState<screenType>("home");

  return (
    <>
      {/* ================= HOME ================= */}
      {screen === "home" && (
        <Home key="home" setScreen={setScreen} handleLogout={handleLogout} />
      )}

      {/* ================= STOCK ================= */}
      {screen === "stock" && <Stock key="stock" setScreen={setScreen} />}

      {/* ================= STOCK MASUK ================= */}
      {screen === "stockMasuk" && (
        <StockMasuk key="stockMasuk" setScreen={setScreen} />
      )}

      {/* ================= STOCK KELUAR ================= */}
      {screen === "stockKeluar" && (
        <StockKeluar key="stockKeluar" setScreen={setScreen} />
      )}

      {/* ================= JOBS ================= */}
      {screen === "jobs" && <Jobs key="jobs" setScreen={setScreen} />}
    </>
  );
}
