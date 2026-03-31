"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  AppSettings,
  AppWindow,
  ExperienceMode,
  SiteSettings,
  WindowPosition,
  WindowSize,
} from "@/types/window";
import type { ComponentType } from "react";

// ─── Types ────────────────────────────────────────────────────────────────

export interface DesktopIconDef {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  component: ComponentType<Record<string, unknown>>;
  title: string;
  props?: Record<string, unknown>;
  settings?: Partial<AppSettings>;
  category?: string;
  description?: string;
}

// ─── Default app settings ──────────────────────────────────────────────────

export const DEFAULT_APP_SETTINGS: AppSettings = {
  defaultSize: { width: 760, height: 560 },
  sizeConstraints: {
    min: { width: 400, height: 300 },
    max: { width: 1400, height: 1200 },
  },
  fixedSize: false,
  center: true,
};

// ─── Context shape ─────────────────────────────────────────────────────────

interface AppContextValue {
  windows: AppWindow[];
  focusedWindow: AppWindow | null;
  isMobile: boolean;
  websiteMode: boolean;
  siteSettings: SiteSettings;
  constraintsRef: React.RefObject<HTMLDivElement | null>;
  taskbarHeight: number;
  setTaskbarHeight: (h: number) => void;
  desktopIcons: DesktopIconDef[];
  openWindow: (
    id: string,
    component: ComponentType<Record<string, unknown>>,
    title: string,
    props?: Record<string, unknown>,
    settings?: Partial<AppSettings>
  ) => void;
  closeWindow: (id: string) => void;
  closeAllWindows: () => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  updateWindowPosition: (id: string, position: WindowPosition) => void;
  updateWindowSize: (id: string, size: WindowSize) => void;
  setExperience: (mode: ExperienceMode) => void;
  isActiveWindowsPanelOpen: boolean;
  setIsActiveWindowsPanelOpen: (open: boolean) => void;
  searchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  openNewChat: (opts?: { initialQuestion?: string }) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function getDesktopCenter(size: WindowSize, taskbarHeight: number): WindowPosition {
  if (typeof window === "undefined") return { x: 0, y: 0 };
  const x = Math.max(0, (window.innerWidth - size.width) / 2);
  const y = Math.max(0, (window.innerHeight - taskbarHeight - size.height) / 2 + taskbarHeight);
  return { x, y };
}

function getNextZIndex(windows: AppWindow[]): number {
  return windows.length === 0 ? 10 : Math.max(...windows.map((w) => w.zIndex)) + 1;
}

function getCascadePosition(existingWindows: AppWindow[], taskbarHeight: number): WindowPosition {
  const offset = (existingWindows.length % 8) * 24;
  return {
    x: 80 + offset,
    y: taskbarHeight + 24 + offset,
  };
}

function createWindow(
  id: string,
  component: ComponentType<Record<string, unknown>>,
  title: string,
  props: Record<string, unknown> | undefined,
  settings: AppSettings,
  existingWindows: AppWindow[],
  taskbarHeight: number
): AppWindow {
  const size = settings.defaultSize;
  const position = settings.center
    ? getDesktopCenter(size, taskbarHeight)
    : getCascadePosition(existingWindows, taskbarHeight);

  return {
    id,
    title,
    component,
    props,
    zIndex: getNextZIndex(existingWindows),
    minimized: false,
    position,
    previousPosition: position,
    size,
    previousSize: size,
    sizeConstraints: settings.sizeConstraints,
    fixedSize: settings.fixedSize ?? false,
  };
}

// ─── Provider ─────────────────────────────────────────────────────────────

interface AppProviderProps {
  children: React.ReactNode;
  desktopIcons?: DesktopIconDef[];
}

export function AppProvider({ children, desktopIcons = [] }: AppProviderProps) {
  const isSSR = typeof window === "undefined";

  const [isMobile, setIsMobile] = useState(() => !isSSR && window.innerWidth < 768);
  const [windows, setWindows] = useState<AppWindow[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => ({
    experience: !isSSR && window.innerWidth < 768 ? "boring" : "desktop",
    wallpaper: "default",
  }));
  const [taskbarHeight, setTaskbarHeight] = useState(37);
  const [isActiveWindowsPanelOpen, setIsActiveWindowsPanelOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const autoBoringRef = useRef(false);

  const constraintsRef = useRef<HTMLDivElement | null>(null);
  const taskbarHeightRef = useRef(taskbarHeight);
  taskbarHeightRef.current = taskbarHeight;

  const websiteMode = siteSettings.experience === "boring";

  // ── Mobile detection + symmetric restore ──────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSiteSettings((s) => {
          if (s.experience !== "boring") {
            autoBoringRef.current = true;
          }
          return { ...s, experience: "boring" };
        });
      } else if (autoBoringRef.current) {
        autoBoringRef.current = false;
        setSiteSettings((s) => ({ ...s, experience: "desktop" }));
      }
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ── Wallpaper → <body> attr ────────────────────────────────────────────
  useEffect(() => {
    document.body.setAttribute("data-wallpaper", siteSettings.wallpaper);
  }, [siteSettings.wallpaper]);

  // ── Global keyboard shortcuts ──────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (e.key === "Escape") {
        if (isActiveWindowsPanelOpen) { setIsActiveWindowsPanelOpen(false); return; }
        if (searchOpen) { setSearchOpen(false); return; }
        return;
      }

      if (isInput) return;

      if (
        (e.key === "k" && (e.metaKey || e.ctrlKey) && !e.shiftKey) ||
        (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.shiftKey)
      ) {
        e.preventDefault();
        setSearchOpen((v) => !v);
        return;
      }

      if (e.key === "?" || (e.key === "/" && e.shiftKey)) {
        e.preventDefault();
        openNewChatImpl();
        return;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActiveWindowsPanelOpen, searchOpen]);

  // ─── Derived ───────────────────────────────────────────────────────────
  const focusedWindow = useMemo(() => {
    const visible = windows.filter((w) => !w.minimized);
    if (visible.length === 0) return null;
    return visible.reduce((a, b) => (a.zIndex > b.zIndex ? a : b));
  }, [windows]);

  // ─── Window actions ────────────────────────────────────────────────────

  const openWindow = useCallback(
    (
      id: string,
      component: ComponentType<Record<string, unknown>>,
      title: string,
      props?: Record<string, unknown>,
      overrideSettings?: Partial<AppSettings>
    ) => {
      setWindows((prev) => {
        const existing = prev.find((w) => w.id === id);
        if (existing) {
          const maxZ = getNextZIndex(prev);
          return prev.map((w) =>
            w.id === id ? { ...w, minimized: false, zIndex: maxZ } : w
          );
        }
        const settings = { ...DEFAULT_APP_SETTINGS, ...overrideSettings };
        const win = createWindow(id, component, title, props, settings, prev, taskbarHeightRef.current);
        return [...prev, win];
      });
    },
    []
  );

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const closeAllWindows = useCallback(() => {
    setWindows([]);
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const maxZ = getNextZIndex(prev);
      return prev.map((w) =>
        w.id === id ? { ...w, zIndex: maxZ, minimized: false } : w
      );
    });
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: true } : w))
    );
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    if (typeof window === "undefined") return;
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        return {
          ...w,
          previousSize: w.size,
          previousPosition: w.position,
          size: { width: window.innerWidth, height: window.innerHeight - taskbarHeightRef.current },
          position: { x: 0, y: taskbarHeightRef.current },
          zIndex: getNextZIndex(prev),
        };
      })
    );
  }, []);

  const restoreWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        return { ...w, size: w.previousSize, position: w.previousPosition };
      })
    );
  }, []);

  const updateWindowPosition = useCallback((id: string, position: WindowPosition) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, position } : w)));
  }, []);

  const updateWindowSize = useCallback((id: string, size: WindowSize) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, size } : w)));
  }, []);

  const setExperience = useCallback((mode: ExperienceMode) => {
    if (mode === "desktop") autoBoringRef.current = false;
    setSiteSettings((s) => ({ ...s, experience: mode }));
  }, []);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  function openNewChatImpl(opts?: { initialQuestion?: string }) {
    const chatIcon = desktopIcons.find((i) => i.id === "ask-max");
    if (!chatIcon) return;
    setWindows((prev) => {
      const existing = prev.find((w) => w.id === "ask-max");
      if (existing) {
        const maxZ = getNextZIndex(prev);
        return prev.map((w) =>
          w.id === "ask-max" ? { ...w, minimized: false, zIndex: maxZ } : w
        );
      }
      const chatWidth = 360;
      const chatHeight = 480;
      const x = typeof window !== "undefined" ? window.innerWidth - chatWidth - 16 : 400;
      const y = typeof window !== "undefined" ? window.innerHeight - chatHeight - 16 : 100;
      const win: AppWindow = {
        id: "ask-max",
        title: opts?.initialQuestion ? opts.initialQuestion.slice(0, 40) : "Ask Max",
        component: chatIcon.component,
        props: { initialQuestion: opts?.initialQuestion },
        zIndex: getNextZIndex(prev),
        minimized: false,
        position: { x, y },
        previousPosition: { x, y },
        size: { width: chatWidth, height: chatHeight },
        previousSize: { width: chatWidth, height: chatHeight },
        sizeConstraints: {
          min: { width: 300, height: 360 },
          max: { width: 480, height: 640 },
        },
        fixedSize: false,
      };
      return [...prev, win];
    });
  }

  const openNewChat = useCallback((opts?: { initialQuestion?: string }) => {
    openNewChatImpl(opts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desktopIcons]);

  const value = useMemo<AppContextValue>(
    () => ({
      windows,
      focusedWindow,
      isMobile,
      websiteMode,
      siteSettings,
      constraintsRef,
      taskbarHeight,
      setTaskbarHeight,
      desktopIcons,
      openWindow,
      closeWindow,
      closeAllWindows,
      focusWindow,
      minimizeWindow,
      maximizeWindow,
      restoreWindow,
      updateWindowPosition,
      updateWindowSize,
      setExperience,
      isActiveWindowsPanelOpen,
      setIsActiveWindowsPanelOpen,
      searchOpen,
      openSearch,
      closeSearch,
      openNewChat,
    }),
    [
      windows,
      focusedWindow,
      isMobile,
      websiteMode,
      siteSettings,
      taskbarHeight,
      desktopIcons,
      openWindow,
      closeWindow,
      closeAllWindows,
      focusWindow,
      minimizeWindow,
      maximizeWindow,
      restoreWindow,
      updateWindowPosition,
      updateWindowSize,
      setExperience,
      isActiveWindowsPanelOpen,
      searchOpen,
      openSearch,
      closeSearch,
      openNewChat,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
