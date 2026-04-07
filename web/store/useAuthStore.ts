import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: "POTONG" | string; // Bisa dibuat literal jika rolenya sudah pasti
}

interface Session {
  id: string;
  user: User;
  createdAt: string; // ISO Date string
}

interface AuthSession {
  session: Session;
}

interface AuthState {
  session: AuthSession | null;
  setSession: (data: AuthSession) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (data) => set({ session: data }),
      clearSession: () => {
        set({ session: null });
        localStorage.removeItem("accessToken");
        localStorage.removeItem("role");
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
