"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import useIsMobile from "@/hooks/useIsMobile";

import QCMobile from "@/container/qc/mobile/qcMobile";
import QCWeb from "@/container/qc/web/qcWeb";
import { api } from "@/lib/axios";

export default function Page() {
  const router = useRouter();
  const isMobile = useIsMobile();

  const { session, clearSession } = useAuthStore();

  const handleLogout = async () => {
    try {
      const logout = await api.post("/auth/logout");
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
