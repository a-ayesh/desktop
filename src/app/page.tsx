"use client";

import React from "react";
import { AppProvider } from "@/context/AppContext";
import Shell, { registerDesktopIcons } from "@/components/Shell";
import HomePage from "@/components/pages/Home";
import AboutPage from "@/components/pages/About";
import DocsPage from "@/components/pages/Docs";
import type { AppSettings } from "@/types/window";

// ─── Desktop icon definitions ───────────────────────────────────────────────
// Register before the component renders (module-level, safe for static export)

const docsSettings: Partial<AppSettings> = {
  defaultSize: { width: 860, height: 580 },
  sizeConstraints: {
    min: { width: 500, height: 360 },
    max: { width: 1400, height: 1100 },
  },
};

registerDesktopIcons([
  {
    id: "home",
    label: "home.txt",
    icon: "📄",
    component: HomePage as React.ComponentType<Record<string, unknown>>,
    title: "home.txt",
  },
  {
    id: "about",
    label: "about.txt",
    icon: "📋",
    component: AboutPage as React.ComponentType<Record<string, unknown>>,
    title: "about.txt",
  },
  {
    id: "docs",
    label: "Docs",
    icon: "📚",
    component: DocsPage as React.ComponentType<Record<string, unknown>>,
    title: "Documentation",
    settings: docsSettings,
  },
]);

// ─── Page ───────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
