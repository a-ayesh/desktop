"use client";

import React, { forwardRef, useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";

// ─── Clock ─────────────────────────────────────────────────────────────────

function Clock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 10_000);
    return () => clearInterval(id);
  }, []);

  return <span className="tabular-nums select-none">{time}</span>;
}

// ─── Active window pill ─────────────────────────────────────────────────────

function ActiveWindowPill({
  title,
  focused,
  onClick,
}: {
  title: string;
  focused: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-2 py-0.5 rounded text-xs
        border border-transparent transition-colors
        ${focused
          ? "bg-primary text-primary border-primary"
          : "text-secondary hover:bg-accent"
        }
      `}
    >
      <span
        className={`size-1.5 rounded-full ${focused ? "bg-blue-500" : "bg-text-muted"}`}
      />
      <span className="max-w-[120px] truncate">{title}</span>
    </button>
  );
}

// ─── TaskBar ────────────────────────────────────────────────────────────────

const TaskBar = forwardRef<HTMLDivElement>(function TaskBar(_, ref) {
  const {
    windows,
    focusedWindow,
    focusWindow,
    minimizeWindow,
    siteSettings,
    toggleColorMode,
    websiteMode,
  } = useApp();

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      ref={ref}
      id="taskbar"
      data-scheme="tertiary"
      className="
        flex items-center justify-between
        px-2 text-xs font-medium
        bg-primary border-b border-primary text-primary
        select-none z-[9999] shrink-0
        relative
      "
      style={{ height: "var(--taskbar-height, 28px)" }}
    >
      {/* ── Left: branding + nav menu ────────────────────────────── */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="px-2 py-0.5 rounded font-semibold hover:bg-accent transition-colors"
        >
          Desktop
        </button>

        {/* Dropdown menu (simple, no Radix needed yet) */}
        {menuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setMenuOpen(false)}
            />
            <div
              data-scheme="primary"
              className="
                absolute left-1 top-full mt-1 z-20
                bg-primary border border-primary rounded shadow-lg
                py-1 min-w-[160px] text-xs text-primary
              "
            >
              <MenuSection label="Pages" />
              <MenuItem label="Home" onClick={() => setMenuOpen(false)} />
              <MenuItem label="About" onClick={() => setMenuOpen(false)} />
              <MenuItem label="Docs" onClick={() => setMenuOpen(false)} />
              <MenuDivider />
              <MenuItem
                label={`Switch to ${siteSettings.experience === "desktop" ? "Mobile" : "Desktop"} mode`}
                onClick={() => {
                  setMenuOpen(false);
                }}
              />
            </div>
          </>
        )}

        {/* Active windows — show on desktop mode */}
        {!websiteMode && (
          <div className="flex items-center gap-0.5 ml-2">
            {windows.map((w) => (
              <ActiveWindowPill
                key={w.id}
                title={w.title}
                focused={focusedWindow?.id === w.id && !w.minimized}
                onClick={() => {
                  if (w.minimized || focusedWindow?.id !== w.id) {
                    focusWindow(w.id);
                  } else {
                    minimizeWindow(w.id);
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Right: clock + theme toggle ──────────────────────────── */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleColorMode}
          aria-label="Toggle color mode"
          className="px-1.5 py-0.5 rounded hover:bg-accent transition-colors"
          title={`Switch to ${siteSettings.colorMode === "light" ? "dark" : "light"} mode`}
        >
          {siteSettings.colorMode === "light" ? "☾" : "☀"}
        </button>
        <Clock />
      </div>
    </div>
  );
});

export default TaskBar;

// ─── Minor sub-components ──────────────────────────────────────────────────

function MenuSection({ label }: { label: string }) {
  return (
    <div className="px-3 pt-1 pb-0.5 text-muted uppercase tracking-wider text-[10px]">
      {label}
    </div>
  );
}

function MenuItem({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-1 hover:bg-accent transition-colors"
    >
      {label}
    </button>
  );
}

function MenuDivider() {
  return <div className="border-t border-primary my-1" />;
}
