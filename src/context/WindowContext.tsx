"use client";

import React, { createContext, useContext } from "react";
import type { AppWindow } from "@/types/window";

interface WindowContextValue {
  appWindow: AppWindow;
}

const WindowContext = createContext<WindowContextValue | null>(null);

export function useWindow(): WindowContextValue {
  const ctx = useContext(WindowContext);
  if (!ctx) throw new Error("useWindow must be used inside WindowProvider");
  return ctx;
}

export function WindowProvider({
  appWindow,
  children,
}: {
  appWindow: AppWindow;
  children: React.ReactNode;
}) {
  return (
    <WindowContext.Provider value={{ appWindow }}>
      {children}
    </WindowContext.Provider>
  );
}
