"use client";

import React from "react";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import type { DesktopIconDef } from "@/context/AppContext";
import type { AppSettings } from "@/types/window";

// ─── Column layout constants (mirrors PostHog) ─────────────────────────────

const ICON_WIDTH = 112;
const ICON_HEIGHT = 75;
const PADDING_HORIZONTAL = 4;
const PADDING_VERTICAL = 20;
const COLUMN_SPACING = 128;

function generateInitialPositions(
  icons: DesktopIconDef[],
  containerHeight: number
): Array<{ x: number; y: number }> {
  const usableHeight = containerHeight - PADDING_VERTICAL * 2;
  const iconsPerColumn = Math.max(1, Math.floor(usableHeight / ICON_HEIGHT));

  return icons.map((_, i) => {
    const col = Math.floor(i / iconsPerColumn);
    const row = i % iconsPerColumn;
    return {
      x: PADDING_HORIZONTAL + col * COLUMN_SPACING,
      y: PADDING_VERTICAL + row * ICON_HEIGHT,
    };
  });
}

// ─── Desktop Icon ──────────────────────────────────────────────────────────

function DesktopIcon({
  id,
  label,
  icon: IconComponent,
  component,
  title,
  props,
  settings,
  position,
}: {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<Record<string, unknown>>;
  title: string;
  props?: Record<string, unknown>;
  settings?: AppSettings;
  position: { x: number; y: number };
}) {
  const { openWindow } = useApp();

  return (
    <motion.li
      whileDrag={{ scale: 1.1, rotate: 2 }}
      style={{ position: "absolute", left: position.x, top: position.y, width: ICON_WIDTH }}
      className="list-none"
    >
      <button
        onClick={() => openWindow(id, component, title, props, settings)}
        className="inline-flex flex-col justify-center items-center w-auto space-y-0.5 max-w-28 text-center cursor-pointer select-none focus:outline-none group"
        style={{ width: ICON_WIDTH }}
      >
        <div className="size-10 flex items-center justify-center">
          <IconComponent className="size-7 text-primary" />
        </div>

        <span
          className="
            text-[13px] font-medium leading-tight text-center text-balance
            text-primary px-0.5 rounded-[2px] max-w-full
            bg-[rgba(238,239,233,0.75)] group-hover:bg-[rgba(238,239,233,1)]
          "
        >
          {label}
        </span>
      </button>
    </motion.li>
  );
}

// ─── Desktop ───────────────────────────────────────────────────────────────

export default function Desktop() {
  const { desktopIcons } = useApp();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = React.useState(600);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height);
      }
    });
    obs.observe(containerRef.current);
    setContainerHeight(containerRef.current.clientHeight);
    return () => obs.disconnect();
  }, []);

  const positions = generateInitialPositions(desktopIcons, containerHeight);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <ul className="relative w-full h-full m-0 p-0">
        {desktopIcons.map((def, i) => (
          <DesktopIcon
            key={def.id}
            id={def.id}
            label={def.label}
            icon={def.icon}
            component={def.component}
            title={def.title}
            props={def.props}
            settings={def.settings as AppSettings | undefined}
            position={positions[i]}
          />
        ))}
      </ul>
    </div>
  );
}
