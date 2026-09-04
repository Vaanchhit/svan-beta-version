"use client";

import { createContext, useContext, type ReactNode } from "react";
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

const placeholderUser: AuthUser | null = null;

const placeholderContext: AuthContextValue = {
  user: placeholderUser,
  isLoading: false,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  refresh: async () => {}
};

const AuthContext = createContext<AuthContextValue>(placeholderContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  return <AuthContext.Provider value={placeholderContext}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
