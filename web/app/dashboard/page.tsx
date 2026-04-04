"use client";

import { useEffect, useState } from "react";
import { getData } from "@/services/getData";
import { useRouter } from "next/navigation";
import PotongMobile from "./PotongMobile";
import PotongWeb from "./PotongWeb";

export default function Page() {
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("menunggu");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const res: any = await getData("/api/orders");
      setOrders(res.data);
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const filteredOrders = orders.filter((item) => item.status === activeTab);

  const sharedProps = {
    orders,
    activeTab,
    setActiveTab,
    filteredOrders,
    selectedOrder,
    setSelectedOrder,
    modalType,
    setModalType,
    handleLogout,
  };

  return isMobile ? (
    <PotongMobile {...sharedProps} />
  ) : (
    <PotongWeb {...sharedProps} />
  );
}
