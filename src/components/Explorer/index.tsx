"use client";

import React, { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import HeaderBar from "@/components/OSChrome/HeaderBar";
import type { DesktopIconDef } from "@/context/AppContext";
import { Squares2X2Icon, Bars3Icon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

// ─── App Grid Item ──────────────────────────────────────────────────────────

function AppGridItem({ icon: iconDef, onOpen }: { icon: DesktopIconDef; onOpen: () => void }) {
  const IconComponent = iconDef.icon;
  return (
    <button
      onClick={onOpen}
      className="
        flex flex-col items-center gap-2 p-3 rounded-xl text-center
        hover:bg-accent transition-colors group focus:outline-none focus-visible:ring-1 focus-visible:ring-blue
      "
    >
      <div className="size-14 rounded-2xl bg-accent flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
        <IconComponent className="size-7 text-primary" />
      </div>
      <div>
        <div className="text-xs font-medium text-primary leading-tight">{iconDef.label}</div>
        {iconDef.description && (
          <div className="text-[10px] text-muted mt-0.5 leading-tight">{iconDef.description}</div>
        )}
      </div>
    </button>
  );
}

function AppListItem({ icon: iconDef, onOpen }: { icon: DesktopIconDef; onOpen: () => void }) {
  const IconComponent = iconDef.icon;
  return (
    <button
      onClick={onOpen}
      className="
        flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left
        hover:bg-accent transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-blue
      "
    >
      <div className="size-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
        <IconComponent className="size-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-primary">{iconDef.label}</div>
        {iconDef.description && (
          <div className="text-xs text-muted mt-0.5 truncate">{iconDef.description}</div>
        )}
      </div>
      <span className="text-[10px] text-muted border border-primary rounded px-1.5 py-0.5 shrink-0">
        {iconDef.category ?? "App"}
      </span>
    </button>
  );
}

// ─── Explorer ───────────────────────────────────────────────────────────────

const LAYOUT_KEY = "desktop:explorer-layout";
type Layout = "grid" | "list";

function getInitialLayout(): Layout {
  if (typeof window === "undefined") return "grid";
  return (localStorage.getItem(LAYOUT_KEY) as Layout) ?? "grid";
}

export default function Explorer() {
  const { desktopIcons, openWindow } = useApp();
  const [query, setQuery] = useState("");
  const [layout, setLayout] = useState<Layout>(getInitialLayout);

  function switchLayout(l: Layout) {
    setLayout(l);
    localStorage.setItem(LAYOUT_KEY, l);
  }

  function handleOpen(icon: DesktopIconDef) {
    openWindow(icon.id, icon.component, icon.title, icon.props, icon.settings as Parameters<typeof openWindow>[4]);
  }

  const grouped = useMemo(() => {
    const q = query.toLowerCase();
    const filtered = desktopIcons.filter(
      (icon) =>
        !q ||
        icon.label.toLowerCase().includes(q) ||
        icon.description?.toLowerCase().includes(q) ||
        icon.category?.toLowerCase().includes(q)
    );

    const groups: Record<string, DesktopIconDef[]> = {};
    for (const icon of filtered) {
      const cat = icon.category ?? "Apps";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(icon);
    }
    return groups;
  }, [desktopIcons, query]);

  const hasResults = Object.keys(grouped).length > 0;

  return (
    <div className="flex flex-col h-full">
      <HeaderBar
        title="Product OS"
        searchQuery={query}
        onSearchChange={setQuery}
        searchPlaceholder="Search apps..."
        rightSlot={
          <div className="flex items-center rounded-md overflow-hidden border border-primary">
            <button
              onClick={() => switchLayout("grid")}
              className={`p-1.5 transition-colors focus:outline-none ${layout === "grid" ? "bg-accent text-primary" : "text-muted hover:text-primary hover:bg-accent/60"}`}
              aria-label="Grid layout"
            >
              <Squares2X2Icon className="size-4" />
            </button>
            <button
              onClick={() => switchLayout("list")}
              className={`p-1.5 transition-colors focus:outline-none ${layout === "list" ? "bg-accent text-primary" : "text-muted hover:text-primary hover:bg-accent/60"}`}
              aria-label="List layout"
            >
              <Bars3Icon className="size-4" />
            </button>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto min-h-0 p-4">
        {hasResults ? (
          Object.entries(grouped).map(([category, icons]) => (
            <div key={category} className="mb-6">
              <h3 className="text-[10px] font-semibold text-muted uppercase tracking-widest mb-3 px-1">
                {category}
              </h3>
              {layout === "grid" ? (
                <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))" }}>
                  {icons.map((icon) => (
                    <AppGridItem key={icon.id} icon={icon} onOpen={() => handleOpen(icon)} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-0.5">
                  {icons.map((icon) => (
                    <AppListItem key={icon.id} icon={icon} onOpen={() => handleOpen(icon)} />
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <MagnifyingGlassIcon className="size-10 text-muted mb-3" />
            <p className="text-sm text-muted">No apps found for &ldquo;{query}&rdquo;</p>
          </div>
        )}
      </div>
    </div>
  );
}
