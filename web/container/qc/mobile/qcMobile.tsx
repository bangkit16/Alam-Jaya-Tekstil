"use client";

import { useState } from "react";
import Jobs from "./screen/jobs";
import Home from "./screen/home";

export default function QCMobile(props: any) {
  const { handleLogout, qcList, orders, handleGagal, handleLolos } = props;

  const [screen, setScreen] = useState<"home" | "jobs">("home");

  return (
    <>
      {screen === "home" && (
        <Home setScreen={setScreen} handleLogout={handleLogout} />
      )}

      {screen === "jobs" && (
        <Jobs
          setScreen={setScreen}
          handleLogout={handleLogout}
          qcList={qcList}
          orders={orders}
          handleGagal={handleGagal}
          handleLolos={handleLolos}
        />
      )}
    </>
  );
}
