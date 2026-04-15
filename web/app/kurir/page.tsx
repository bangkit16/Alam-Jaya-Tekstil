"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import KurirMobile from "@/container/kurir/mobile/KurirMobile";
import KurirWeb from "@/container/kurir/web/KurirWeb";
import useIsMobile from "@/hooks/useIsMobile";
import { api } from "@/lib/axios";

export default function Page() {
  // const [isMobile, setIsMobile] = useState(false);

  const isMobile = useIsMobile();

  const { clearSession } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // setIsMobile(window.innerWidth < 768);

    const token = localStorage.getItem("accessToken");
    if (!token) router.push("/login");
  }, []);

  const handleLogout = async () => {
    try {
      const logout = await api.post("/auth/logout");
    } catch (error) {
      console.log("Logout API gagal");
    }

    clearSession();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");

    router.push("/login");
  };

  const sharedProps = {
    handleLogout,
  };

  return isMobile ? (
    <KurirMobile {...sharedProps} />
  ) : (
    <KurirWeb {...sharedProps} />
  );
}
