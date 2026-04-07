"use client";

import { useEffect, useState } from "react";
import { getOrders, updateOrder } from "../data/orders";
import { useRouter } from "next/navigation";
import QCMobile from "@/container/qc/mobile/qcMobile";
import QCWeb from "@/container/qc/web/qcWeb";

export default function QCPage() {
  const router = useRouter();

  const [orders, setOrders] = useState(getOrders());
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("role") !== "QC") {
      router.push("/login");
    }

    setIsMobile(window.innerWidth < 768);
  }, []);

  const handleGagal = (id: number) => {
    updateOrder(id, "rework");
    setOrders([...getOrders()]);
  };

  const handleLolos = (id: number) => {
    updateOrder(id, "gudang");
    setOrders([...getOrders()]);
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    router.push("/login");
  };

  const qcList = orders.filter((o) => o.status === "qc");

  const sharedProps = {
    orders,
    qcList,
    handleGagal,
    handleLolos,
    handleLogout,
  };

  return isMobile ? <QCMobile {...sharedProps} /> : <QCWeb {...sharedProps} />;
}
