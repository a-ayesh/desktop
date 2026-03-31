"use client";

import React from "react";

interface EditorProps {
  children?: React.ReactNode;
  toolbar?: React.ReactNode;
}

/**
 * Editor — Google Docs-style content area.
 * Used for general pages (home, about, etc.)
 * Content is passed as children.
 */
export default function Editor({ children, toolbar }: EditorProps) {
  return (
    <div
      data-scheme="primary"
      className="flex flex-col size-full bg-primary text-primary"
    >
      {/* Optional toolbar */}
      {toolbar && (
        <div
          data-scheme="secondary"
          className="
            flex items-center gap-1 px-3 py-1.5 shrink-0
            bg-primary border-b border-primary text-secondary text-xs
          "
        >
          {toolbar}
        </div>
      )}

      {/* Scrollable content area */}
      <div className="flex-1 overflow-auto p-6 @container">
        <div className="max-w-2xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
