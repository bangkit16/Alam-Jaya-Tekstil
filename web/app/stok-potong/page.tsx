"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

import useIsMobile from "@/hooks/useIsMobile";
import StokPotongMobile from "@/container/stok-potong/mobile/stok-potong-mobile";
import StokPotongWeb from "@/container/stok-potong/web/stok-potong-web";
import { api } from "@/lib/axios";

export default function Page() {
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
      console.log("logout dummy");
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
    <StokPotongMobile {...sharedProps} />
  ) : (
    <StokPotongWeb {...sharedProps} />
  );
}
