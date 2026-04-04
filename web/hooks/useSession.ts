"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type SessionPayload = {
  session: {
    id: string;
    user: SessionUser;
    createdAt: string;
  };
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

export function useSession(options?: { redirectTo?: string }) {
  const router = useRouter();
  const [session, setSession] = useState<SessionPayload["session"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/auth/session`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401 && options?.redirectTo) {
          router.push(options.redirectTo);
        }
        throw new Error("Tidak dapat memuat session");
      }

      const data = (await response.json()) as SessionPayload;
      setSession(data.session);
      return data.session;
    } catch (err) {
      setSession(null);
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      return null;
    } finally {
      setLoading(false);
    }
  }, [options?.redirectTo, router]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // ignore logout errors
    } finally {
      setSession(null);
      router.push("/login");
    }
  }, [router]);

  return {
    session,
    loading,
    error,
    refreshSession: fetchSession,
    logout,
  };
}
