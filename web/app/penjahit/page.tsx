"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PenjahitMobile from "@/container/jahit/mobile/PenjahitMobile";
import PenjahitWeb from "@/container/jahit/web/PenjahitWeb";
import useIsMobile from "@/hooks/useIsMobile";
import { api } from "@/lib/axios";

export default function Page() {
  const [orders, setOrders] = useState<any[]>([]);
  const router = useRouter();

  const isMobile = useIsMobile();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      console.log("Logout API gagal");
    }
  };

  const sharedProps = {
    orders,
    setOrders,
    handleLogout,
  };

  return isMobile ? (
    <PenjahitMobile {...sharedProps} />
  ) : (
    <PenjahitWeb {...sharedProps} />
  );
}
