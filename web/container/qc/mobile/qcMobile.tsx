"use client";

import { useState } from "react";
import Jobs from "./screen/jobs";
import Home from "./screen/home";

export default function QCMobile(props: any) {
  const { handleLogout } = props;

  const [screen, setScreen] = useState<"home" | "jobs">("home");

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
