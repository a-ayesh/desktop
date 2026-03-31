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
  AppRegistry,
  AppSettings,
  AppWindow,
  ColorMode,
  ExperienceMode,
  SiteSettings,
  WindowPosition,
  WindowSize,
} from "@/types/window";
import type { ComponentType } from "react";

// ─── Default app settings ──────────────────────────────────────────────────

const DEFAULT_APP_SETTINGS: AppSettings = {
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
  // Window actions
  openWindow: (
    id: string,
    component: ComponentType<Record<string, unknown>>,
    title: string,
    props?: Record<string, unknown>,
    settings?: Partial<AppSettings>
  ) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  updateWindowPosition: (id: string, position: WindowPosition) => void;
  updateWindowSize: (id: string, size: WindowSize) => void;
  // Site settings
  toggleColorMode: () => void;
  setExperience: (mode: ExperienceMode) => void;
  // App registry
  registerApp: (id: string, settings: AppSettings) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function getDesktopCenter(
  size: WindowSize,
  taskbarHeight: number
): WindowPosition {
  if (typeof window === "undefined") return { x: 0, y: 0 };
  const x = Math.max(0, (window.innerWidth - size.width) / 2);
  const y = Math.max(
    0,
    (window.innerHeight - taskbarHeight - size.height) / 2 + taskbarHeight
  );
  return { x, y };
}

function getNextZIndex(windows: AppWindow[]): number {
  return windows.length === 0
    ? 10
    : Math.max(...windows.map((w) => w.zIndex)) + 1;
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
    : { x: 80 + existingWindows.length * 24, y: taskbarHeight + 24 + existingWindows.length * 24 };

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

export function AppProvider({ children }: { children: React.ReactNode }) {
  const isSSR = typeof window === "undefined";

  const [isMobile, setIsMobile] = useState(
    () => !isSSR && window.innerWidth < 768
  );
  const [windows, setWindows] = useState<AppWindow[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => ({
    colorMode: "light",
    experience: !isSSR && window.innerWidth < 768 ? "boring" : "desktop",
    wallpaper: "default",
  }));
  const [taskbarHeight, setTaskbarHeight] = useState(28);
  const [appRegistry, setAppRegistry] = useState<AppRegistry>({});

  const constraintsRef = useRef<HTMLDivElement | null>(null);
  const taskbarHeightRef = useRef(taskbarHeight);

  const websiteMode = siteSettings.experience === "boring";

  // Keep ref in sync so callbacks don't close over stale height
  taskbarHeightRef.current = taskbarHeight;

  // ── Mobile detection ──────────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSiteSettings((s) => ({ ...s, experience: "boring" }));
      }
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ── Apply color mode class to <html> ───────────────────────────────────
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("light", "dark");
    html.classList.add(siteSettings.colorMode);
  }, [siteSettings.colorMode]);

  // ── Apply wallpaper to <body> ──────────────────────────────────────────
  useEffect(() => {
    document.body.setAttribute("data-wallpaper", siteSettings.wallpaper);
  }, [siteSettings.wallpaper]);

  // ─── Derived ───────────────────────────────────────────────────────────
  const focusedWindow = useMemo(() => {
    const visible = windows.filter((w) => !w.minimized);
    if (visible.length === 0) return null;
    return visible.reduce((a, b) => (a.zIndex > b.zIndex ? a : b));
  }, [windows]);

  // ─── Actions ───────────────────────────────────────────────────────────

  const registerApp = useCallback(
    (id: string, settings: AppSettings) => {
      setAppRegistry((r) => ({ ...r, [id]: settings }));
    },
    []
  );

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
          // Bring to front and unminimize
          const maxZ = getNextZIndex(prev);
          return prev.map((w) =>
            w.id === id ? { ...w, minimized: false, zIndex: maxZ } : w
          );
        }
        const registeredSettings = appRegistry[id] ?? DEFAULT_APP_SETTINGS;
        const settings = { ...registeredSettings, ...overrideSettings };
        const win = createWindow(id, component, title, props, settings, prev, taskbarHeightRef.current);
        return [...prev, win];
      });
    },
    [appRegistry]
  );

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
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

  const maximizeWindow = useCallback(
    (id: string) => {
      if (typeof window === "undefined") return;
      setWindows((prev) =>
        prev.map((w) => {
          if (w.id !== id) return w;
          return {
            ...w,
            previousSize: w.size,
            previousPosition: w.position,
            size: {
              width: window.innerWidth,
              height: window.innerHeight - taskbarHeight,
            },
            position: { x: 0, y: taskbarHeight },
            zIndex: getNextZIndex(prev),
          };
        })
      );
    },
    [taskbarHeight]
  );

  const restoreWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        return {
          ...w,
          size: w.previousSize,
          position: w.previousPosition,
        };
      })
    );
  }, []);

  const updateWindowPosition = useCallback(
    (id: string, position: WindowPosition) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, position } : w))
      );
    },
    []
  );

  const updateWindowSize = useCallback((id: string, size: WindowSize) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, size } : w))
    );
  }, []);

  const toggleColorMode = useCallback(() => {
    setSiteSettings((s) => ({
      ...s,
      colorMode: (s.colorMode === "light" ? "dark" : "light") as ColorMode,
    }));
  }, []);

  const setExperience = useCallback((mode: ExperienceMode) => {
    setSiteSettings((s) => ({ ...s, experience: mode }));
  }, []);

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
      openWindow,
      closeWindow,
      focusWindow,
      minimizeWindow,
      maximizeWindow,
      restoreWindow,
      updateWindowPosition,
      updateWindowSize,
      toggleColorMode,
      setExperience,
      registerApp,
    }),
    [
      windows,
      focusedWindow,
      isMobile,
      websiteMode,
      siteSettings,
      taskbarHeight,
      openWindow,
      closeWindow,
      focusWindow,
      minimizeWindow,
      maximizeWindow,
      restoreWindow,
      updateWindowPosition,
      updateWindowSize,
      toggleColorMode,
      setExperience,
      registerApp,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
