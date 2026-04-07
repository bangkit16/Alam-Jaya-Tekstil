"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import KurirMobile from "@/container/kurir/mobile/KurirMobile";
import KurirWeb from "@/container/kurir/web/KurirWeb";

export default function Page() {
  const [isMobile, setIsMobile] = useState(false);

  const { clearSession } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);

    const token = localStorage.getItem("accessToken");
    if (!token) router.push("/login");
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3001/auth/logout", {
        method: "POST",
        credentials: "include",
      });
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
