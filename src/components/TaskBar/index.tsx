"use client";

import React, { forwardRef, useEffect, useState } from "react";
import { DropdownMenu as RadixDropdown } from "radix-ui";
import { useApp } from "@/context/AppContext";
import OSButton from "@/components/OSButton";
import {
  MagnifyingGlassIcon,
  ChatBubbleLeftIcon,
  InformationCircleIcon,
  Cog6ToothIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";

// ─── PostHog hedgehog logo mark ─────────────────────────────────────────────

function PostHogMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className ?? "h-5 w-auto"}
      aria-hidden
    >
      <path d="M0 15L9 0L18 15L9 30L0 15Z" fill="#1D4AFF" />
      <path d="M30 15L39 0L48 15L39 30L30 15Z" fill="#F9BD2B" />
      <path d="M12 15L21 0H27L18 15L27 30H21L12 15Z" fill="#F54E00" />
      <circle cx="24" cy="15" r="2" fill="#000" />
    </svg>
  );
}

// ─── Clock ─────────────────────────────────────────────────────────────────

function Clock() {
  const [time, setTime] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setTime(new Date());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="text-[13px] font-medium tabular-nums text-secondary select-none">
      {time === null
        ? "--:--"
        : time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
    </span>
  );
}

// ─── OS Logo dropdown ───────────────────────────────────────────────────────

function OsLogoMenu() {
  const { siteSettings, setExperience, openWindow, windows } = useApp();
  const isDesktop = siteSettings.experience === "desktop";

  function handleOpenAbout() {
    import("@/components/pages/About").then(({ default: About }) => {
      openWindow("about", About as React.ComponentType<Record<string, unknown>>, "About");
    });
  }

  function handleOpenSettings() {
    import("@/components/pages/DisplaySettings").then(({ default: Settings }) => {
      openWindow(
        "display-settings",
        Settings as React.ComponentType<Record<string, unknown>>,
        "Display settings",
        undefined,
        { defaultSize: { width: 480, height: 420 }, sizeConstraints: { min: { width: 360, height: 320 }, max: { width: 640, height: 600 } }, fixedSize: false, center: true }
      );
    });
  }

  const openWindowCount = windows.filter((w) => !w.minimized).length;

  return (
    <RadixDropdown.Root>
      <RadixDropdown.Trigger asChild>
        <button
          className="flex items-center gap-1.5 px-1.5 py-0.5 rounded text-primary hover:bg-accent transition-colors text-[13px] leading-none font-medium select-none focus:outline-none data-[state=open]:bg-accent"
          aria-label="OS menu"
        >
          <PostHogMark className="h-4 w-auto" />
          <span className="text-[13px] font-semibold tracking-tight hidden sm:inline">OS</span>
        </button>
      </RadixDropdown.Trigger>

      <RadixDropdown.Portal>
        <RadixDropdown.Content
          align="start"
          sideOffset={4}
          className="z-[9999] min-w-[200px] rounded-md p-[5px] bg-primary border border-primary text-primary animate-in fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
          data-scheme="secondary"
          style={{
            boxShadow: "0px 10px 38px -10px rgba(22,23,24,0.35), 0px 10px 20px -15px rgba(22,23,24,0.2)",
          }}
        >
          <RadixDropdown.Item
            onSelect={handleOpenAbout}
            className="flex items-center gap-2 h-[25px] px-2.5 text-sm leading-none text-primary cursor-pointer hover:bg-accent focus:bg-accent outline-none rounded"
          >
            <InformationCircleIcon className="size-4 text-secondary shrink-0" />
            <span className="font-medium">About this desktop</span>
          </RadixDropdown.Item>

          <RadixDropdown.Item
            onSelect={handleOpenSettings}
            className="flex items-center gap-2 h-[25px] px-2.5 text-sm leading-none text-primary cursor-pointer hover:bg-accent focus:bg-accent outline-none rounded"
          >
            <Cog6ToothIcon className="size-4 text-secondary shrink-0" />
            <span>Display settings</span>
          </RadixDropdown.Item>

          <RadixDropdown.Separator className="m-[5px] h-px bg-border" />

          <RadixDropdown.Item
            onSelect={() => setExperience(isDesktop ? "boring" : "desktop")}
            className="flex items-center gap-2 h-[25px] px-2.5 text-sm leading-none text-primary cursor-pointer hover:bg-accent focus:bg-accent outline-none rounded"
          >
            {isDesktop ? (
              <DevicePhoneMobileIcon className="size-4 text-secondary shrink-0" />
            ) : (
              <ComputerDesktopIcon className="size-4 text-secondary shrink-0" />
            )}
            <span>{isDesktop ? "Switch to website mode" : "Switch to OS mode"}</span>
          </RadixDropdown.Item>

          {openWindowCount > 0 && (
            <>
              <RadixDropdown.Separator className="m-[5px] h-px bg-border" />
              <RadixDropdown.Label className="px-2.5 py-1 text-[10px] text-muted uppercase tracking-widest font-semibold">
                Open windows ({openWindowCount})
              </RadixDropdown.Label>
            </>
          )}
        </RadixDropdown.Content>
      </RadixDropdown.Portal>
    </RadixDropdown.Root>
  );
}

// ─── Active window pill ─────────────────────────────────────────────────────

function ActiveWindowPill({ id, title, minimized }: { id: string; title: string; minimized: boolean }) {
  const { focusWindow, minimizeWindow } = useApp();

  function handleClick() {
    if (minimized) {
      focusWindow(id);
    } else {
      minimizeWindow(id);
    }
  }

  return (
    <button
      onClick={handleClick}
      title={title}
      className={`
        flex items-center gap-1.5 px-2 py-0.5 rounded text-[13px] font-medium
        max-w-[120px] transition-colors select-none focus:outline-none
        ${minimized
          ? "text-muted hover:text-secondary hover:bg-accent"
          : "bg-accent text-primary hover:bg-accent/80"
        }
      `}
    >
      <span className="truncate">{title}</span>
    </button>
  );
}

// ─── Active windows count pill ──────────────────────────────────────────────

function ActiveWindowsCountPill({
  count,
  isOpen,
  onClick,
}: {
  count: number;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title="Active windows"
      aria-label={`${count} active window${count !== 1 ? "s" : ""}`}
      className={`
        inline-flex items-center justify-center min-w-6 h-5 px-1.5 ml-1
        text-[13px] font-semibold rounded
        border-[1.5px] border-t-4 transition-colors select-none focus:outline-none
        hover:bg-light text-secondary hover:text-primary
        ${count > 0
          ? "bg-light border-[#4d4f46]"
          : "bg-accent border-primary"
        }
      `}
    >
      <span className="relative -top-px">{count}</span>
    </button>
  );
}

// ─── TaskBar ────────────────────────────────────────────────────────────────

const TaskBar = forwardRef<HTMLDivElement>(function TaskBar(_props, ref) {
  const {
    windows,
    openSearch,
    openNewChat,
    setIsActiveWindowsPanelOpen,
    isActiveWindowsPanelOpen,
  } = useApp();

  const openWindowCount = windows.length;

  return (
    <div
      ref={ref}
      data-scheme="primary"
      className="flex items-center w-full shrink-0 bg-accent/75 backdrop-blur border-b border-primary text-primary z-[8000] relative select-none"
      style={{ minHeight: "var(--taskbar-height, 37px)" }}
    >
      {/* ── Left: OS logo + open window pills ────────────────────────── */}
      <div className="flex items-center gap-0.5 px-1 flex-1 min-w-0 overflow-hidden">
        <OsLogoMenu />

        <div className="flex items-center gap-0.5 overflow-hidden">
          {windows.map((w) => (
            <ActiveWindowPill key={w.id} id={w.id} title={w.title} minimized={w.minimized} />
          ))}
        </div>
      </div>

      {/* ── Right: Search, Ask Max, Active Windows, Clock ──────────── */}
      <div data-scheme="secondary" className="flex items-center gap-0.5 px-2 py-1 shrink-0">
        <OSButton
          size="sm"
          onClick={openSearch}
          title="Search (/ or Cmd+K)"
          aria-label="Search"
          icon={<MagnifyingGlassIcon />}
        />

        <OSButton
          size="sm"
          onClick={() => openNewChat()}
          title="Ask Max (?)"
          aria-label="Ask Max"
          icon={<ChatBubbleLeftIcon />}
        />

        <ActiveWindowsCountPill
          count={openWindowCount}
          isOpen={isActiveWindowsPanelOpen}
          onClick={() => setIsActiveWindowsPanelOpen(!isActiveWindowsPanelOpen)}
        />

        <div className="w-px h-4 bg-primary mx-1 opacity-50" />

        <Clock />
      </div>
    </div>
  );
});

export default TaskBar;
