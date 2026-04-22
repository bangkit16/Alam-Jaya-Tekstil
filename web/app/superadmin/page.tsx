"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/lib/axios";
import useIsMobile from "@/hooks/useIsMobile";

// 🔥 Container (samakan struktur folder kayak potong)
import SuperAdminWeb from "@/container/superadmin/web/SuperAdminWeb";
import SuperAdminMobile from "@/container/superadmin/mobile/SuperAdminMobile";

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
      console.log("sukses logout dummy");
      console.error("Error logging out:", error);
    } finally {
      clearSession();

      // 🔥 samakan storage dengan login kamu
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
      localStorage.removeItem("user");

      router.push("/login");

      console.log("sukses logout server");
    }
  };

  const sharedProps = {
    handleLogout,
    session,
  };

  return isMobile ? (
    <SuperAdminMobile {...sharedProps} />
  ) : (
    <SuperAdminWeb {...sharedProps} />
  );
}
