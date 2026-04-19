"use client";

import { useEffect, useState } from "react";
import { useGetPermintaan } from "@/services/potong/useGetPermintaan";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

import PotongWeb from "@/container/potong/web/PotongWeb";
import PotongMobile from "@/container/potong/mobile/potong-mobile";
import { api } from "@/lib/axios";
import useIsMobile from "@/hooks/useIsMobile";

export default function Page() {
  // const [orders, setOrders] = useState<any[]>([]);
  // const [activeTab, setActiveTab] = useState("menunggu");
  // const [selectedOrder, setSelectedOrder] = useState(null);
  // const [modalType, setModalType] = useState(null);
  // const [isMobile, setIsMobile] = useState(false);

  const { session, clearSession } = useAuthStore();

  const router = useRouter();

  const isMobile = useIsMobile();

  const handleLogout = async () => {
    try {
      const logout = await api.post("/auth/logout");
      if (!logout) {
        throw new Error("Failed to logout");
      }
    } catch (error) {
      localStorage.removeItem("token");
      router.push("/login");
      console.log("sukses logout dummy");
      console.error("Error logging out:", error);
    } finally {
      clearSession();
      localStorage.removeItem("token");
      router.push("/login");
      console.log("sukses logout server");
    }
  };

  // const filteredOrders = orders.filter((item) => item.status === activeTab);

  const sharedProps = {

    handleLogout,
    session,
  };

  return isMobile ? (
    <PotongMobile {...sharedProps} />
  ) : (
    <PotongWeb {...sharedProps} />
  );
}
