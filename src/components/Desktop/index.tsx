"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import type { ComponentType } from "react";
import type { AppSettings } from "@/types/window";

// ─── Desktop icon ──────────────────────────────────────────────────────────

export interface DesktopIconDef {
  id: string;
  label: string;
  icon: string; // emoji or short text for now
  component: ComponentType<Record<string, unknown>>;
  title: string;
  props?: Record<string, unknown>;
  settings?: Partial<AppSettings>;
}

function DesktopIcon({ def }: { def: DesktopIconDef }) {
  const { openWindow } = useApp();

  return (
    <button
      onDoubleClick={() =>
        openWindow(def.id, def.component, def.title, def.props, def.settings)
      }
      onClick={() =>
        openWindow(def.id, def.component, def.title, def.props, def.settings)
      }
      className="
        flex flex-col items-center gap-1 p-2 w-[72px]
        rounded cursor-pointer select-none
        text-primary hover:bg-white/20 active:bg-white/30
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue
        transition-colors group
      "
    >
      <div
        className="
          size-12 flex items-center justify-center
          rounded-xl text-2xl
          bg-white/10 group-hover:bg-white/20 transition-colors
          shadow-sm
        "
      >
        {def.icon}
      </div>
      <span
        className="
          text-[11px] font-medium text-center leading-tight
          px-1 rounded
          text-primary
          max-w-full truncate w-full
        "
      >
        {def.label}
      </span>
    </button>
  );
}

// ─── Desktop ───────────────────────────────────────────────────────────────

let _registeredIcons: DesktopIconDef[] = [];

/** Call this to register icons with the Desktop (done in page.tsx) */
export function registerDesktopIcons(icons: DesktopIconDef[]) {
  _registeredIcons = icons;
}

export default function Desktop() {
  return (
    <div className="absolute inset-0 p-4 flex flex-col gap-y-2">
      <div className="flex flex-wrap gap-2 content-start">
        {_registeredIcons.map((def) => (
          <DesktopIcon key={def.id} def={def} />
        ))}
      </div>
    </div>
  );
}
