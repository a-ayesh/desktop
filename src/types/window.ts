import type { ComponentType } from "react";

export interface WindowSize {
  width: number;
  height: number;
}

export interface WindowPosition {
  x: number;
  y: number;
}

export interface SizeConstraints {
  min: WindowSize;
  max: WindowSize;
}

export interface AppWindow {
  id: string;
  title: string;
  /** The React component to render inside the window */
  component: ComponentType<Record<string, unknown>>;
  /** Props forwarded to the component */
  props?: Record<string, unknown>;
  zIndex: number;
  minimized: boolean;
  position: WindowPosition;
  previousPosition: WindowPosition;
  size: WindowSize;
  previousSize: WindowSize;
  sizeConstraints: SizeConstraints;
  /** If true the window cannot be resized */
  fixedSize: boolean;
}

/** Per-app default configuration registered at startup */
export interface AppSettings {
  defaultSize: WindowSize;
  sizeConstraints: SizeConstraints;
  fixedSize?: boolean;
  /** Center the window on the screen when first opened */
  center?: boolean;
}

export type ExperienceMode = "desktop" | "boring";
export type WallpaperMode = "default";

export interface SiteSettings {
  experience: ExperienceMode;
  wallpaper: WallpaperMode;
}

/** Registry mapping app IDs to their settings */
export type AppRegistry = Record<string, AppSettings>;
