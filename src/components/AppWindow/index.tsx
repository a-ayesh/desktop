"use client";

import React, { useRef, useState } from "react";
import { motion, useDragControls } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { WindowProvider } from "@/context/WindowContext";
import type { AppWindow as AppWindowType } from "@/types/window";
import OSButton from "@/components/OSButton";
import {
  IconX,
  IconMinus,
  IconSquare,
  IconExpand45Chevrons,
  IconCollapse45Chevrons,
  IconDocument,
  IconChevronDown,
} from "@/components/Icons";

// ─── Window control buttons ────────────────────────────────────────────────

function WindowControls({
  id,
  title,
  isMaximized,
}: {
  id: string;
  title: string;
  isMaximized: boolean;
}) {
  const { closeWindow, minimizeWindow, maximizeWindow, restoreWindow } = useApp();

  return (
    <div className="flex items-center gap-0.5 shrink-0">
      {/* Minimize */}
      <OSButton
        size="xs"
        onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }}
        aria-label="Minimize"
        title="Minimize"
      >
        <IconMinus className="size-4 relative top-1" />
      </OSButton>

      {/* Maximize / Restore */}
      <OSButton
        size="xs"
        onClick={(e) => { e.stopPropagation(); isMaximized ? restoreWindow(id) : maximizeWindow(id); }}
        aria-label={isMaximized ? "Restore" : "Maximize"}
        title={isMaximized ? "Restore" : "Maximize"}
        className="group"
      >
        {isMaximized ? (
          <>
            <IconSquare className="size-5 group-hover:hidden" />
            <IconCollapse45Chevrons className="size-6 -m-0.5 hidden group-hover:block" />
          </>
        ) : (
          <>
            <IconSquare className="size-5 group-hover:hidden" />
            <IconExpand45Chevrons className="size-6 -m-0.5 hidden group-hover:block" />
          </>
        )}
      </OSButton>

      {/* Close */}
      <OSButton
        size="md"
        onClick={(e) => { e.stopPropagation(); closeWindow(id); }}
        aria-label="Close"
        title={`Close ${title}`}
        icon={<IconX />}
      />
    </div>
  );
}

// ─── Resize handle ─────────────────────────────────────────────────────────

type ResizeEdge = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

const EDGE_STYLES: Record<ResizeEdge, React.CSSProperties> = {
  n:  { top: 0, left: 6, right: 6, height: 6, cursor: "n-resize" },
  s:  { bottom: 0, left: 6, right: 6, height: 6, cursor: "s-resize" },
  e:  { top: 6, bottom: 6, right: 0, width: 6, cursor: "e-resize" },
  w:  { top: 6, bottom: 6, left: 0, width: 6, cursor: "w-resize" },
  ne: { top: 0, right: 0, width: 24, height: 24, cursor: "ne-resize" },
  nw: { top: 0, left: 0, width: 24, height: 24, cursor: "nw-resize" },
  se: { bottom: 0, right: 0, width: 24, height: 24, cursor: "se-resize" },
  sw: { bottom: 0, left: 0, width: 24, height: 24, cursor: "sw-resize" },
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
      onPointerDown={(e) => { e.stopPropagation(); onResizeStart(e, edge); }}
    />
  );
}

// ─── AppWindow ─────────────────────────────────────────────────────────────

interface AppWindowProps {
  item: AppWindowType;
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
    taskbarHeight,
    focusedWindow,
  } = useApp();

  const dragControls = useDragControls();
  const windowRef = useRef<HTMLDivElement | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);

  const resizingRef = useRef<{
    edge: ResizeEdge;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    startLeft: number;
    startTop: number;
  } | null>(null);

  const isFocused = focusedWindow?.id === item.id;

  // ── Detect maximized using real taskbarHeight ──────────────────────────
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const { width, height } = item.size;
    setIsMaximized(
      width >= window.innerWidth - 2 &&
      height >= window.innerHeight - taskbarHeight - 2
    );
  }, [item.size, taskbarHeight]);

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
      const { edge: ed, startWidth, startHeight, startLeft, startTop } = resizingRef.current;
      const { min, max } = item.sizeConstraints;

      let newW = startWidth;
      let newH = startHeight;
      let newX = startLeft;
      let newY = startTop;

      if (ed.includes("e")) newW = Math.min(max.width, Math.max(min.width, startWidth + dx));
      if (ed.includes("w")) {
        newW = Math.min(max.width, Math.max(min.width, startWidth - dx));
        newX = startLeft + (startWidth - newW);
      }
      if (ed.includes("s")) newH = Math.min(max.height, Math.max(min.height, startHeight + dy));
      if (ed.includes("n")) {
        newH = Math.min(max.height, Math.max(min.height, startHeight - dy));
        newY = startTop + (startHeight - newH);
      }

      if (windowRef.current) {
        windowRef.current.style.width = `${newW}px`;
        windowRef.current.style.height = `${newH}px`;
        if (ed.includes("w") || ed.includes("n")) {
          windowRef.current.style.left = `${newX}px`;
          windowRef.current.style.top = `${newY}px`;
          windowRef.current.style.transform = "none";
        }
      }
    }

    function onUp(_ev: PointerEvent) {
      document.body.classList.remove("dragging");
      if (!resizingRef.current || !windowRef.current) {
        resizingRef.current = null;
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
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
          className="overflow-hidden bg-primary text-primary w-full border-b border-primary"
        >
          <div
            data-scheme="primary"
            className="flex items-center justify-between px-3 bg-primary border-b border-input text-primary text-sm font-semibold select-none"
            style={{ height: 32 }}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <IconDocument className="size-4 text-secondary shrink-0" />
              <span className="truncate">{item.title}</span>
            </div>
          </div>
          <div className="overflow-auto bg-light">
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
        drag={!item.fixedSize && !isMaximized}
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={constraintsRef}
        dragElastic={0}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        initial={{ opacity: 0, scale: 0.97, y: 4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{
          opacity: 0,
          y: typeof window !== "undefined" ? window.innerHeight + 100 : 800,
          transition: { duration: 0.18, ease: "easeIn" },
        }}
        transition={{ duration: 0.1, ease: "easeOut" }}
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
          className={`flex flex-col size-full rounded overflow-hidden bg-primary text-primary border border-input ${isFocused ? "shadow-2xl" : "shadow-lg"}`}
        >
          {/* ── Title bar ───────────────────────────────────────────── */}
          <div
            data-scheme="primary"
            className="flex items-center gap-2 py-0.5 pl-1.5 pr-0.5 shrink-0 bg-primary/50 backdrop-blur-3xl border-b border-input text-primary cursor-grab active:cursor-grabbing select-none"
            onPointerDown={(e) => { if (!item.fixedSize && !isMaximized) dragControls.start(e); }}
            onDoubleClick={() => isMaximized ? restoreWindow(item.id) : maximizeWindow(item.id)}
          >
            {/* Left: file icon + title */}
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <IconDocument className="size-4 text-secondary shrink-0" />
              <IconChevronDown className="size-3 text-muted shrink-0" />
              <span className="text-sm font-semibold truncate select-none">
                {item.title}
              </span>
            </div>

            {/* Right: window controls */}
            <WindowControls id={item.id} title={item.title} isMaximized={isMaximized} />
          </div>

          {/* ── Content ─────────────────────────────────────────────── */}
          <div className="flex-1 overflow-auto min-h-0 bg-light">
            <Component {...contentProps} />
          </div>
        </div>

        {/* ── Resize handles ──────────────────────────────────────────── */}
        {!item.fixedSize && !isMaximized && (
          <>
            <ResizeHandle edge="n"  onResizeStart={handleResizeStart} />
            <ResizeHandle edge="s"  onResizeStart={handleResizeStart} />
            <ResizeHandle edge="e"  onResizeStart={handleResizeStart} />
            <ResizeHandle edge="w"  onResizeStart={handleResizeStart} />
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
