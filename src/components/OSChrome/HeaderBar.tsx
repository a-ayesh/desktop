"use client";

import React from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface HeaderBarProps {
  title?: string;
  searchQuery?: string;
  onSearchChange?: (v: string) => void;
  searchPlaceholder?: string;
  rightSlot?: React.ReactNode;
}

export default function HeaderBar({
  title,
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  rightSlot,
}: HeaderBarProps) {
  return (
    <div
      data-scheme="secondary"
      className="flex items-center gap-2 px-3 shrink-0 border-b border-primary bg-primary"
      style={{ height: 40 }}
    >
      {title && (
        <span className="text-xs font-semibold text-primary shrink-0">{title}</span>
      )}
      {title && onSearchChange && <div className="w-px h-4 bg-primary opacity-50 shrink-0" />}

      {onSearchChange !== undefined && (
        <div className="flex-1 flex items-center gap-2 bg-accent/70 rounded-md px-2.5 py-1">
          <MagnifyingGlassIcon className="size-3.5 shrink-0 text-muted" />
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="flex-1 text-xs bg-transparent text-primary placeholder-muted outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="text-muted hover:text-primary focus:outline-none"
            >
              <XMarkIcon className="size-3.5" />
            </button>
          )}
        </div>
      )}

      {rightSlot && <div className="flex items-center gap-1 shrink-0">{rightSlot}</div>}
    </div>
  );
}
