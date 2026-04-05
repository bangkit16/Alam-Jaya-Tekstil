"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PenjahitMobile from "./PenjahitMobile";
import PenjahitWeb from "./PenjahitWeb";

export default function Page() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    // dummy data
    setOrders([
      {
        id: 1,
        nama: "Hoodie hitam XL",
        qty: 40,
        kode: "HDX01",
        status: "menunggu",
      },
      {
        id: 2,
        nama: "Kaos putih M",
        qty: 25,
        kode: "KTS02",
        status: "proses",
      },
    ]);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    router.push("/login");
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
