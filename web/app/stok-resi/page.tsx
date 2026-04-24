"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

import StokResiWeb from "@/container/stok-resi/web/StokResiWeb";
import StokResiMobile from "@/container/stok-resi/mobile/StokResiMobile";

import { api } from "@/lib/axios";
import useIsMobile from "@/hooks/useIsMobile";

export default function Page() {
  const { session, clearSession } = useAuthStore();
  const router = useRouter();
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.log("logout fallback");
    } finally {
      clearSession();
      localStorage.removeItem("token");
      router.push("/login");
    }
  };

  const sharedProps = {
    handleLogout,
    session,
  };

  return isMobile ? (
    <StokResiMobile {...sharedProps} />
  ) : (
    <StokResiWeb {...sharedProps} />
  );
}
