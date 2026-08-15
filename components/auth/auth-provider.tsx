"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { svanApi } from "@/services/svan-api";
import type { AuthUser } from "@/types";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (input: { email: string; password: string }) => Promise<void>;
  signup: (input: {
    email: string;
    password: string;
    displayName: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const response = await svanApi.me();
    setUser(response.user);
  }, []);

  useEffect(() => {
    let mounted = true;
    svanApi
      .me()
      .then((response) => {
        if (mounted) setUser(response.user);
      })
      .catch(() => {
        if (mounted) setUser(null);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (input: { email: string; password: string }) => {
    const response = await svanApi.login(input);
    setUser(response.user);
  }, []);

  const signup = useCallback(
    async (input: { email: string; password: string; displayName: string }) => {
      const response = await svanApi.signup(input);
      setUser(response.user);
    },
    []
  );

  const logout = useCallback(async () => {
    await svanApi.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, login, signup, logout, refresh }),
    [user, isLoading, login, signup, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
