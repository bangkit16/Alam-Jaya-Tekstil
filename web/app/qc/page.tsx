"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import useIsMobile from "@/hooks/useIsMobile";

import QCMobile from "@/container/qc/mobile/qcMobile";
import QCWeb from "@/container/qc/web/qcWeb";

export default function Page() {
  const router = useRouter();
  const isMobile = useIsMobile();

  const { session, clearSession } = useAuthStore();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3001/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.log("fallback logout");
    } finally {
      clearSession();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
      router.push("/login");
    }
  };

  const sharedProps = {
    handleLogout,
    session,
  };

  return isMobile ? <QCMobile {...sharedProps} /> : <QCWeb {...sharedProps} />;
}
