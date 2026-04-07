"use client";

import { useState } from "react";
import Home from "./screen/home";
import Jobs from "./screen/jobs";

export default function KurirMobile({ handleLogout }: any) {
  const [screen, setScreen] = useState<"home" | "jobs" | "history">("home");

  return (
    <>
      {screen === "home" && (
        <Home setScreen={setScreen} handleLogout={handleLogout} />
      )}

      {screen === "jobs" && (
        <Jobs setScreen={setScreen} handleLogout={handleLogout} />
      )}
    </>
  );
}
