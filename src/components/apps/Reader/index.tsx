"use client";

import React from "react";

interface ReaderNavItem {
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  children?: ReaderNavItem[];
}

interface ReaderProps {
  /** Left sidebar navigation items */
  navItems?: ReaderNavItem[];
  /** Right sidebar on-page outline items */
  outline?: ReaderNavItem[];
  children?: React.ReactNode;
}

/**
 * Reader — Up to 3 columns: nav | main content | on-page outline.
 * Used for docs, handbook-style pages.
 * Adapts to available width via @container queries.
 */
export default function Reader({ navItems, outline, children }: ReaderProps) {
  return (
    <div
      data-scheme="primary"
      className="flex size-full bg-primary text-primary @container"
    >
      {/* ── Left sidebar ──────────────────────────────────────────── */}
      {navItems && navItems.length > 0 && (
        <aside
          data-scheme="secondary"
          className="
            hidden @md:flex flex-col
            w-52 shrink-0 border-r border-primary
            bg-primary overflow-y-auto
          "
        >
          <nav className="p-3">
            <NavTree items={navItems} />
          </nav>
        </aside>
      )}

      {/* ── Main content ──────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto min-w-0">
        <div className="max-w-2xl mx-auto px-6 py-6 text-sm leading-relaxed">
          {children}
        </div>
      </div>

      {/* ── Right sidebar / outline ───────────────────────────────── */}
      {outline && outline.length > 0 && (
        <aside
          data-scheme="secondary"
          className="
            hidden @xl:flex flex-col
            w-44 shrink-0 border-l border-primary
            bg-primary overflow-y-auto
          "
        >
          <div className="p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted mb-2 font-medium">
              On this page
            </p>
            <NavTree items={outline} small />
          </div>
        </aside>
      )}
    </div>
  );
}

// ─── Nav tree ──────────────────────────────────────────────────────────────

function NavTree({
  items,
  small,
}: {
  items: ReaderNavItem[];
  small?: boolean;
}) {
  return (
    <ul className="flex flex-col gap-0.5">
      {items.map((item, i) => (
        <li key={i}>
          <button
            onClick={item.onClick}
            className={`
              w-full text-left rounded px-2 py-1
              transition-colors leading-snug
              ${small ? "text-[11px]" : "text-xs"}
              ${
                item.active
                  ? "bg-accent text-primary font-medium"
                  : "text-secondary hover:bg-accent hover:text-primary"
              }
            `}
          >
            {item.label}
          </button>
          {item.children && item.children.length > 0 && (
            <div className="ml-3 mt-0.5">
              <NavTree items={item.children} small={small} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
