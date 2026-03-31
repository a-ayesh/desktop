"use client";

import React, { useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import TaskBar from "@/components/TaskBar";
import Desktop, { registerDesktopIcons } from "@/components/Desktop";
import type { DesktopIconDef } from "@/components/Desktop";
import AppWindow from "@/components/AppWindow";

// Re-export so page.tsx can register icons without importing Desktop directly
export { registerDesktopIcons };
export type { DesktopIconDef };

function BoringDesktop() {
  return (
    <div className="relative flex-1 min-h-[300px]">
      <Desktop />
    </div>
  );
}

export default function Shell() {
  const { windows, constraintsRef, websiteMode } = useApp();
  const taskbarRef = useRef<HTMLDivElement | null>(null);
  const { setTaskbarHeight } = useApp();

  useEffect(() => {
    if (!taskbarRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setTaskbarHeight(entry.contentRect.height);
    });
    observer.observe(taskbarRef.current);
    return () => observer.disconnect();
  }, [setTaskbarHeight]);

  if (websiteMode) {
    // ── Boring / mobile mode ────────────────────────────────────────────────
    return (
      <div
        data-scheme="primary"
        className="flex flex-col min-h-screen bg-primary text-primary"
      >
        <TaskBar ref={taskbarRef} />
        <main className="flex-1 w-full max-w-5xl mx-auto px-3 py-4 flex flex-col gap-3">
          {/* Show all non-minimized windows stacked vertically */}
          {windows.filter((w) => !w.minimized).length > 0 ? (
            windows
              .filter((w) => !w.minimized)
              .map((w) => (
                <AppWindow item={w} key={w.id} inline />
              ))
          ) : (
            /* No windows open — show the desktop icons as a simple grid */
            <BoringDesktop />
          )}
        </main>
      </div>
    );
  }

  // ── Desktop mode ───────────────────────────────────────────────────────────
  return (
    <div
      data-scheme="primary"
      className="fixed inset-0 flex flex-col overflow-hidden"
    >
      <TaskBar ref={taskbarRef} />
      {/* Constraints area — windows are drag-constrained inside this */}
      <div ref={constraintsRef} className="flex-1 relative overflow-hidden">
        <Desktop />
        <AnimatePresence>
          {windows
            .filter((w) => !w.minimized)
            .map((item) => (
              <AppWindow item={item} key={item.id} />
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
