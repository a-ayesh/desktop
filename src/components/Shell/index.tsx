"use client";

import React, { useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import TaskBar from "@/components/TaskBar";
import Desktop from "@/components/Desktop";
import AppWindow from "@/components/AppWindow";
import ActiveWindowsPanel from "@/components/ActiveWindowsPanel";
import SearchOverlay from "@/components/Search";

export default function Shell() {
  const { windows, constraintsRef, websiteMode, setTaskbarHeight } = useApp();
  const taskbarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!taskbarRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setTaskbarHeight(entry.contentRect.height);
    });
    observer.observe(taskbarRef.current);
    return () => observer.disconnect();
  }, [setTaskbarHeight]);

  if (websiteMode) {
    const visibleWindows = windows.filter((w) => !w.minimized);
    return (
      <div data-scheme="primary" className="flex flex-col min-h-screen bg-primary text-primary">
        <div className="sticky top-0 z-40">
          <TaskBar ref={taskbarRef} />
        </div>
        <main className="flex-1 w-full max-w-7xl mx-auto transition-all duration-300">
          {visibleWindows.length > 0 ? (
            visibleWindows.map((w) => (
              <AppWindow item={w} key={w.id} inline />
            ))
          ) : (
            <div className="relative flex-1 min-h-[400px]">
              <Desktop />
            </div>
          )}
        </main>
        <SearchOverlay />
      </div>
    );
  }

  return (
    <div data-scheme="primary" className="fixed inset-0 flex flex-col overflow-hidden">
      <TaskBar ref={taskbarRef} />
      <div ref={constraintsRef} className="flex-1 relative overflow-hidden">
        <Desktop />
        <AnimatePresence>
          {windows.filter((w) => !w.minimized).map((item) => (
            <AppWindow item={item} key={item.id} />
          ))}
        </AnimatePresence>
      </div>
      <ActiveWindowsPanel />
      <SearchOverlay />
    </div>
  );
}
