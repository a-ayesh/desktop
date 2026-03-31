"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useDragControls,
} from "framer-motion";
import { useApp } from "@/context/AppContext";
import { WindowProvider } from "@/context/WindowContext";
import type { AppWindow as AppWindowType } from "@/types/window";

// ─── Window control buttons ────────────────────────────────────────────────

function WindowControls({
  id,
  isMaximized,
}: {
  id: string;
  isMaximized: boolean;
}) {
  const { closeWindow, minimizeWindow, maximizeWindow, restoreWindow } =
    useApp();

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      {/* Close */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          closeWindow(id);
        }}
        className="
          size-3 rounded-full bg-red-400 hover:bg-red-500
          flex items-center justify-center text-[8px] text-red-900
          opacity-0 group-hover:opacity-100 transition-opacity
          focus:outline-none focus-visible:opacity-100
        "
        aria-label="Close"
        title="Close"
      >
        ×
      </button>

      {/* Minimize */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          minimizeWindow(id);
        }}
        className="
          size-3 rounded-full bg-yellow-400 hover:bg-yellow-500
          flex items-center justify-center text-[8px] text-yellow-900
          opacity-0 group-hover:opacity-100 transition-opacity
          focus:outline-none focus-visible:opacity-100
        "
        aria-label="Minimize"
        title="Minimize"
      >
        −
      </button>

      {/* Maximize / restore */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          isMaximized ? restoreWindow(id) : maximizeWindow(id);
        }}
        className="
          size-3 rounded-full bg-green-400 hover:bg-green-500
          flex items-center justify-center text-[8px] text-green-900
          opacity-0 group-hover:opacity-100 transition-opacity
          focus:outline-none focus-visible:opacity-100
        "
        aria-label={isMaximized ? "Restore" : "Maximize"}
        title={isMaximized ? "Restore" : "Maximize"}
      >
        {isMaximized ? "⊡" : "+"}
      </button>
    </div>
  );
}

// ─── Resize handle ─────────────────────────────────────────────────────────

type ResizeEdge =
  | "n" | "s" | "e" | "w"
  | "ne" | "nw" | "se" | "sw";

const EDGE_STYLES: Record<ResizeEdge, React.CSSProperties> = {
  n:  { top: 0, left: 4, right: 4, height: 6, cursor: "n-resize" },
  s:  { bottom: 0, left: 4, right: 4, height: 6, cursor: "s-resize" },
  e:  { top: 4, bottom: 4, right: 0, width: 6, cursor: "e-resize" },
  w:  { top: 4, bottom: 4, left: 0, width: 6, cursor: "w-resize" },
  ne: { top: 0, right: 0, width: 10, height: 10, cursor: "ne-resize" },
  nw: { top: 0, left: 0, width: 10, height: 10, cursor: "nw-resize" },
  se: { bottom: 0, right: 0, width: 10, height: 10, cursor: "se-resize" },
  sw: { bottom: 0, left: 0, width: 10, height: 10, cursor: "sw-resize" },
};

function ResizeHandle({
  edge,
  onResizeStart,
}: {
  edge: ResizeEdge;
  onResizeStart: (e: React.PointerEvent, edge: ResizeEdge) => void;
}) {
  return (
    <div
      className="absolute z-10 select-none"
      style={{ ...EDGE_STYLES[edge], position: "absolute" }}
      onPointerDown={(e) => {
        e.stopPropagation();
        onResizeStart(e, edge);
      }}
    />
  );
}

// ─── AppWindow ─────────────────────────────────────────────────────────────

interface AppWindowProps {
  item: AppWindowType;
  /** Render inline (boring/mobile mode) — no drag/resize/abs positioning */
  inline?: boolean;
}

export default function AppWindow({ item, inline = false }: AppWindowProps) {
  const {
    focusWindow,
    maximizeWindow,
    restoreWindow,
    updateWindowPosition,
    updateWindowSize,
    constraintsRef,
  } = useApp();

  const dragControls = useDragControls();
  const windowRef = useRef<HTMLDivElement | null>(null);

  // Track whether the window is at its maximum viewport size
  const [isMaximized, setIsMaximized] = useState(false);

  // Track resize state via refs (avoid re-renders during pointer move)
  const resizingRef = useRef<{
    edge: ResizeEdge;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    startLeft: number;
    startTop: number;
  } | null>(null);

  // ── Detect maximized ───────────────────────────────────────────────────
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const { width, height } = item.size;
    setIsMaximized(
      width >= window.innerWidth - 2 && height >= window.innerHeight - 60
    );
  }, [item.size]);

  // ── Drag ───────────────────────────────────────────────────────────────
  function handleDragEnd() {
    if (!windowRef.current) return;
    const rect = windowRef.current.getBoundingClientRect();
    updateWindowPosition(item.id, { x: rect.left, y: rect.top });
  }

  // ── Resize (pointer events) ────────────────────────────────────────────
  function handleResizeStart(e: React.PointerEvent, edge: ResizeEdge) {
    e.preventDefault();
    if (!windowRef.current) return;
    const rect = windowRef.current.getBoundingClientRect();
    resizingRef.current = {
      edge,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: rect.width,
      startHeight: rect.height,
      startLeft: rect.left,
      startTop: rect.top,
    };
    document.body.classList.add("dragging");

    function onMove(ev: PointerEvent) {
      if (!resizingRef.current) return;
      const dx = ev.clientX - resizingRef.current.startX;
      const dy = ev.clientY - resizingRef.current.startY;
      const { edge, startWidth, startHeight, startLeft, startTop } =
        resizingRef.current;

      const { min, max } = item.sizeConstraints;

      let newW = startWidth;
      let newH = startHeight;
      let newX = startLeft;
      let newY = startTop;

      // Horizontal
      if (edge.includes("e")) newW = Math.min(max.width, Math.max(min.width, startWidth + dx));
      if (edge.includes("w")) {
        newW = Math.min(max.width, Math.max(min.width, startWidth - dx));
        newX = startLeft + (startWidth - newW);
      }

      // Vertical
      if (edge.includes("s")) newH = Math.min(max.height, Math.max(min.height, startHeight + dy));
      if (edge.includes("n")) {
        newH = Math.min(max.height, Math.max(min.height, startHeight - dy));
        newY = startTop + (startHeight - newH);
      }

      if (windowRef.current) {
        windowRef.current.style.width = `${newW}px`;
        windowRef.current.style.height = `${newH}px`;
        // For west/north edges also move position via transform
        if (edge.includes("w") || edge.includes("n")) {
          windowRef.current.style.left = `${newX}px`;
          windowRef.current.style.top = `${newY}px`;
          // Sync framer-motion's internal x/y
          windowRef.current.style.transform = "none";
        }
      }
    }

    function onUp(_ev: PointerEvent) {
      document.body.classList.remove("dragging");
      if (!resizingRef.current || !windowRef.current) {
        resizingRef.current = null;
        return;
      }
      const rect = windowRef.current.getBoundingClientRect();
      updateWindowSize(item.id, { width: rect.width, height: rect.height });
      updateWindowPosition(item.id, { x: rect.left, y: rect.top });
      resizingRef.current = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  const Component = item.component;
  const contentProps = item.props ?? {};

  // ── Inline (boring / mobile) mode ─────────────────────────────────────
  if (inline) {
    return (
      <WindowProvider appWindow={item}>
        <div
          data-scheme="primary"
          className="
            rounded-lg border border-primary overflow-hidden shadow-md
            bg-primary text-primary w-full
          "
        >
          {/* Title bar */}
          <div
            data-scheme="tertiary"
            className="
              flex items-center justify-between px-3 py-2
              bg-primary border-b border-primary text-primary
              text-xs font-medium
            "
          >
            <span className="truncate">{item.title}</span>
          </div>
          {/* Content */}
          <div className="overflow-auto">
            <Component {...contentProps} />
          </div>
        </div>
      </WindowProvider>
    );
  }

  // ── Desktop (draggable) mode ───────────────────────────────────────────
  return (
    <WindowProvider appWindow={item}>
      <motion.div
        ref={windowRef}
        drag={!item.fixedSize}
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={constraintsRef}
        dragElastic={0}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{
          opacity: 0,
          y: typeof window !== "undefined" ? window.innerHeight + 100 : 800,
          transition: { duration: 0.2, ease: "easeIn" },
        }}
        transition={{ duration: 0.12, ease: "easeOut" }}
        style={{
          width: item.size.width,
          height: item.size.height,
          position: "absolute",
          top: 0,
          left: 0,
          x: item.position.x,
          y: item.position.y,
          zIndex: item.zIndex,
        }}
        onPointerDown={() => focusWindow(item.id)}
        className="group"
      >
        {/* Window chrome */}
        <div
          data-scheme="primary"
          className="
            flex flex-col size-full
            rounded-lg border border-primary overflow-hidden
            shadow-xl bg-primary text-primary
          "
        >
          {/* ── Title bar ───────────────────────────────────────────── */}
          <div
            data-scheme="tertiary"
            className="
              flex items-center gap-2 px-3 shrink-0
              bg-primary border-b border-primary text-primary
              cursor-grab active:cursor-grabbing select-none
            "
            style={{ height: 32 }}
            onPointerDown={(e) => {
              if (!item.fixedSize) dragControls.start(e);
            }}
            onDoubleClick={() => {
              isMaximized ? restoreWindow(item.id) : maximizeWindow(item.id);
            }}
          >
            <WindowControls id={item.id} isMaximized={isMaximized} />
            <span className="flex-1 text-center text-xs font-medium truncate">
              {item.title}
            </span>
          </div>

          {/* ── Content ─────────────────────────────────────────────── */}
          <div className="flex-1 overflow-auto min-h-0">
            <Component {...contentProps} />
          </div>
        </div>

        {/* ── Resize handles (edges + corners) ────────────────────── */}
        {!item.fixedSize && !isMaximized && (
          <>
            <ResizeHandle edge="n" onResizeStart={handleResizeStart} />
            <ResizeHandle edge="s" onResizeStart={handleResizeStart} />
            <ResizeHandle edge="e" onResizeStart={handleResizeStart} />
            <ResizeHandle edge="w" onResizeStart={handleResizeStart} />
            <ResizeHandle edge="ne" onResizeStart={handleResizeStart} />
            <ResizeHandle edge="nw" onResizeStart={handleResizeStart} />
            <ResizeHandle edge="se" onResizeStart={handleResizeStart} />
            <ResizeHandle edge="sw" onResizeStart={handleResizeStart} />
          </>
        )}
      </motion.div>
    </WindowProvider>
  );
}
