"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface AuthGateContextType {
  isOpen: boolean;
  openAuthGate: () => void;
  closeAuthGate: () => void;
}

const AuthGateContext = createContext<AuthGateContextType | null>(null);

export const AuthGateProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openAuthGate = useCallback(() => setIsOpen(true), []);
  const closeAuthGate = useCallback(() => setIsOpen(false), []);

  return (
    <AuthGateContext.Provider value={{ isOpen, openAuthGate, closeAuthGate }}>
      {children}
    </AuthGateContext.Provider>
  );
};

export const useAuthGate = () => {
  const ctx = useContext(AuthGateContext);
  if (!ctx) throw new Error("useAuthGate must be used inside AuthGateProvider");
  return ctx;
};
