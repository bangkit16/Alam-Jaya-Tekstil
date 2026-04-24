"use client";

import { useState } from "react";

import Home from "./screen/home";
import Jobs from "./screen/jobs";

type ScreenType = "home" | "jobs";

export default function StokResiMobile(props: any) {
  const handleLogout = props?.handleLogout || (() => {});

  const [screen, setScreen] = useState<ScreenType>("home");

  return (
    <>
      {screen === "home" && (
        <Home setScreen={setScreen} handleLogout={handleLogout} />
      )}

      {screen === "jobs" && <Jobs setScreen={setScreen} />}
    </>
  );
}
