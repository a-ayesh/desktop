"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { MagnifyingGlassIcon, XMarkIcon, DocumentIcon } from "@heroicons/react/24/outline";
import type { DesktopIconDef } from "@/context/AppContext";

export interface SearchableItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  keywords?: string[];
}

function filterItems(items: SearchableItem[], query: string): SearchableItem[] {
  if (!query.trim()) return items.slice(0, 8);
  const q = query.toLowerCase();
  return items.filter(
    (item) =>
      item.label.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.keywords?.some((k) => k.toLowerCase().includes(q))
  );
}

function SearchResult({
  item,
  active,
  onClick,
}: {
  item: SearchableItem;
  active: boolean;
  onClick: () => void;
}) {
  const ref = useRef<HTMLLIElement | null>(null);
  useEffect(() => {
    if (active && ref.current) ref.current.scrollIntoView({ block: "nearest" });
  }, [active]);

  const IconComponent = item.icon ?? DocumentIcon;

  return (
    <li ref={ref}>
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors focus:outline-none ${
          active ? "bg-accent" : "hover:bg-accent/60"
        }`}
      >
        <span className="size-8 flex items-center justify-center rounded-lg bg-accent/80 shrink-0">
          <IconComponent className="size-5 text-primary" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-primary truncate">{item.label}</div>
          {item.description && (
            <div className="text-xs text-muted truncate mt-0.5">{item.description}</div>
          )}
        </div>
        <kbd className={`text-[10px] text-muted border border-primary rounded px-1 py-0.5 shrink-0 ${active ? "" : "opacity-0"}`}>
          enter
        </kbd>
      </button>
    </li>
  );
}

export default function SearchOverlay() {
  const { searchOpen, closeSearch, desktopIcons, openWindow, openNewChat } = useApp();
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (searchOpen) {
      setQuery("");
      setActiveIdx(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [searchOpen]);

  const items: SearchableItem[] = useMemo(
    () =>
      desktopIcons.map((icon: DesktopIconDef) => ({
        id: icon.id,
        label: icon.label,
        description: icon.description,
        icon: icon.icon,
        keywords: [icon.title, ...(icon.category ? [icon.category] : [])],
      })),
    [desktopIcons]
  );

  const results = useMemo(() => filterItems(items, query), [items, query]);

  const clampIdx = useCallback(
    (idx: number) => Math.max(0, Math.min(idx, results.length - 1)),
    [results.length]
  );

  function handleSelect(item: SearchableItem) {
    const icon = desktopIcons.find((d) => d.id === item.id);
    if (!icon) { closeSearch(); return; }
    openWindow(icon.id, icon.component, icon.title, icon.props, icon.settings as Parameters<typeof openWindow>[4]);
    closeSearch();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => clampIdx(i + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => clampIdx(i - 1)); }
    else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (results[activeIdx]) handleSelect(results[activeIdx]);
    } else if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      closeSearch();
      openNewChat({ initialQuestion: query });
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeSearch();
    }
  }

  return (
    <AnimatePresence>
      {searchOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="search-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="fixed inset-0 z-[9100] bg-black/30 backdrop-blur-sm"
            onClick={closeSearch}
          />

          {/* Search panel */}
          <motion.div
            key="search-panel"
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            data-scheme="secondary"
            className="fixed left-1/2 -translate-x-1/2 z-[9200] w-full max-w-[560px] mx-auto rounded-xl overflow-hidden bg-primary text-primary border border-primary"
            style={{
              top: "clamp(60px, 12vh, 140px)",
              boxShadow: "0px 10px 38px -10px rgba(22,23,24,0.35), 0px 10px 20px -15px rgba(22,23,24,0.2)",
            }}
          >
            {/* Input row */}
            <div
              data-scheme="primary"
              className="flex items-center gap-3 px-4 bg-primary border-b border-primary"
              style={{ height: 52 }}
            >
              <MagnifyingGlassIcon className="size-5 shrink-0 text-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActiveIdx(0); }}
                onKeyDown={handleKeyDown}
                placeholder="Search apps and pages..."
                className="flex-1 bg-transparent text-sm text-primary placeholder-muted outline-none"
              />
              {query && (
                <button onClick={() => { setQuery(""); inputRef.current?.focus(); }} className="text-muted hover:text-primary focus:outline-none">
                  <XMarkIcon className="size-4" />
                </button>
              )}
              <kbd className="text-[10px] text-muted border border-primary rounded px-1 py-0.5 shrink-0">Esc</kbd>
            </div>

            {/* Results */}
            {results.length > 0 ? (
              <ul>
                {results.map((item, i) => (
                  <SearchResult
                    key={item.id}
                    item={item}
                    active={i === activeIdx}
                    onClick={() => handleSelect(item)}
                  />
                ))}
              </ul>
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-muted">No results for &ldquo;{query}&rdquo;</p>
                <p className="text-xs text-muted mt-1">
                  Press <kbd className="border border-primary rounded px-1 py-0.5 text-[10px]">Shift+Enter</kbd> to ask Max
                </p>
              </div>
            )}

            {/* Footer */}
            <div
              data-scheme="tertiary"
              className="flex items-center justify-between px-4 py-2 border-t border-primary bg-primary"
            >
              <div className="flex items-center gap-3 text-[10px] text-muted">
                <span><kbd className="border border-primary rounded px-0.5">up/down</kbd> navigate</span>
                <span><kbd className="border border-primary rounded px-0.5">enter</kbd> open</span>
                <span><kbd className="border border-primary rounded px-0.5">shift+enter</kbd> ask Max</span>
              </div>
              <span className="text-[10px] text-muted">{results.length} result{results.length !== 1 ? "s" : ""}</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
