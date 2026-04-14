"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import useIsMobile from "@/hooks/useIsMobile";

import StokGudangWeb from "@/container/stok-gudang/web/stok-gudang-web";
import StokGudangMobile from "@/container/stok-gudang/mobile/stok-gudang-mobile";

export default function Page() {
  const { session, clearSession } = useAuthStore();
  const router = useRouter();
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3001/auth/logout", {
        method: "POST",
        credentials: "include",
      });
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
    <StokGudangMobile {...sharedProps} />
  ) : (
    <StokGudangWeb {...sharedProps} />
  );
}
