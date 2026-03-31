"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import SidePanel from "@/components/SidePanel";
import OSButton from "@/components/OSButton";
import { IconX } from "@/components/Icons";

function WindowRow({
  id,
  title,
  focused,
  onFocus,
  onClose,
}: {
  id: string;
  title: string;
  focused: boolean;
  onFocus: () => void;
  onClose: () => void;
}) {
  return (
    <div className="group flex items-center px-1 py-0.5">
      <OSButton
        size="md"
        width="full"
        align="left"
        active={focused}
        onClick={onFocus}
        className="flex-1 min-w-0"
      >
        <span className="flex-1 text-sm font-medium truncate text-left">{title}</span>
      </OSButton>
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="text-secondary hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none ml-0.5 p-1 rounded"
        aria-label={`Close ${title}`}
      >
        <IconX className="size-3.5" />
      </button>
    </div>
  );
}

export default function ActiveWindowsPanel() {
  const {
    windows,
    focusedWindow,
    isActiveWindowsPanelOpen,
    setIsActiveWindowsPanelOpen,
    focusWindow,
    closeWindow,
    closeAllWindows,
  } = useApp();

  function handleFocus(id: string) {
    focusWindow(id);
    setIsActiveWindowsPanelOpen(false);
  }

  const hasWindows = windows.length > 0;

  return (
    <SidePanel
      open={isActiveWindowsPanelOpen}
      onClose={() => setIsActiveWindowsPanelOpen(false)}
      title="Active windows"
      side="right"
    >
      {/* Header "Close all" button — rendered inside SidePanel's title bar via children */}
      {/* We slot the close-all into the panel body header row */}
      {hasWindows ? (
        <>
          <div className="flex items-center justify-between px-4 py-1.5 border-b border-primary">
            <span className="text-xs text-muted">{windows.length} window{windows.length !== 1 ? "s" : ""}</span>
            <OSButton
              size="sm"
              onClick={() => { closeAllWindows(); setIsActiveWindowsPanelOpen(false); }}
            >
              Close all
            </OSButton>
          </div>
          <div className="py-1 px-1">
            {windows.map((w) => (
              <WindowRow
                key={w.id}
                id={w.id}
                title={w.title}
                focused={focusedWindow?.id === w.id}
                onFocus={() => handleFocus(w.id)}
                onClose={() => closeWindow(w.id)}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <p className="text-sm text-muted">No open windows</p>
          <p className="text-xs text-muted mt-1">Click a desktop icon to open an app</p>
        </div>
      )}
    </SidePanel>
  );
}
