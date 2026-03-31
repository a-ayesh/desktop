"use client";

import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import OSButton from "@/components/OSButton";
import { IconChevronRight } from "@/components/Icons";

interface SidePanelProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  side?: "right" | "left";
}

export default function SidePanel({
  open,
  onClose,
  title,
  children,
  side = "right",
}: SidePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Click-outside detection (mousedown on document)
  useEffect(() => {
    if (!open) return;
    function handleMouseDown(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [open, onClose]);

  const translateX = side === "right" ? "100%" : "-100%";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          key="panel"
          initial={{ translateX }}
          animate={{ translateX: "0%" }}
          exit={{ translateX }}
          transition={{ duration: 0.3, type: "tween" }}
          data-scheme="primary"
          className="fixed z-[9000] flex flex-col w-80 bg-primary border border-primary text-primary rounded shadow-xl overflow-hidden"
          style={{
            top: "calc(37px + 1rem)",
            height: "calc(100vh - 2rem - 37px)",
            [side]: "1rem",
          }}
        >
          {title && (
            <div
              data-scheme="primary"
              className="flex items-center justify-between px-4 py-2 border-b border-primary bg-primary shrink-0"
            >
              <span className="text-base font-semibold text-primary">{title}</span>
              <OSButton
                size="sm"
                onClick={onClose}
                aria-label="Close panel"
                icon={<IconChevronRight />}
              />
            </div>
          )}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
