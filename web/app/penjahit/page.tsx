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

  // useEffect(() => {
  //   // dummy data
  //   setOrders([
  //     {
  //       id: 1,
  //       nama: "Hoodie hitam XL",
  //       qty: 40,
  //       kode: "HDX01",
  //       status: "menunggu",
  //     },
  //     {
  //       id: 2,
  //       nama: "Kaos putih M",
  //       qty: 25,
  //       kode: "KTS02",
  //       status: "proses",
  //     },
  //   ]);
  // }, []);

  const handleLogout = async () => {
    try {
      const logout = await api.post("/auth/logout");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
      router.push("/login");
    } catch (error) {
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
