"use client";

import { useEffect, useState } from "react";
import { useGetPermintaan } from "@/services/useGetPermintaan";
import { useRouter } from "next/navigation";

import PotongWeb from "@/container/potong/web/potong-web";
import PotongMobile from "@/container/potong/mobile/potong-mobile";

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

  const { data, isLoading } = useGetPermintaan();

  useEffect(() => {
    if (data) {
      setOrders(data);
    }
  }, [data]);

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
