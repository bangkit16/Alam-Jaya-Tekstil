"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ResiMobile from "@/container/resi/mobile/ResiMobile";
import ResiWeb from "@/container/resi/web/ResiWeb";
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
    }
  };

  const sharedProps = {
    orders,
    setOrders,
    handleLogout,
  };

  return isMobile ? (
    <ResiMobile {...sharedProps} />
  ) : (
    <ResiWeb {...sharedProps} />
  );
}
