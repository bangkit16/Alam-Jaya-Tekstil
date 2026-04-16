"use client";

import { useState, useEffect } from "react";
import Home from "./screen/home";
import Jobs from "./screen/jobs";

type ScreenType = "home" | "jobs";

export default function PenjahitMobile(props: any) {
  const handleLogout = props?.handleLogout || (() => {});

  const [screen, setScreen] = useState<ScreenType>("home");

  // RESET

  // 🔥 SCREEN MAPPING
  const screens: Record<ScreenType, () => React.ReactNode> = {
    home: () => <Home setScreen={setScreen} handleLogout={handleLogout} />,
    jobs: () => <Jobs setScreen={setScreen} />,
  };

  return screens[screen]();
}
