"use client";

import React from "react";
import { AppProvider } from "@/context/AppContext";
import type { DesktopIconDef } from "@/context/AppContext";
import Shell from "@/components/Shell";
import type { AppSettings } from "@/types/window";

import HomePage from "@/components/pages/Home";
import AboutPage from "@/components/pages/About";
import DocsPage from "@/components/pages/Docs";
import BlogPage from "@/components/pages/Blog";
import DisplaySettings from "@/components/pages/DisplaySettings";
import Explorer from "@/components/Explorer";
import Chat from "@/components/Chat";

import {
  HomeIcon,
  InformationCircleIcon,
  BookOpenIcon,
  PencilSquareIcon,
  FolderIcon,
  Cog6ToothIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/outline";

import type { ComponentType } from "react";

const DESKTOP_ICONS: DesktopIconDef[] = [
  {
    id: "home",
    label: "Home",
    icon: HomeIcon,
    component: HomePage as ComponentType<Record<string, unknown>>,
    title: "Home",
    category: "Pages",
    description: "Welcome page and quick start guide",
    settings: {
      defaultSize: { width: 700, height: 520 },
      sizeConstraints: { min: { width: 400, height: 300 }, max: { width: 1200, height: 900 } },
      center: true,
    } satisfies AppSettings,
  },
  {
    id: "about",
    label: "About",
    icon: InformationCircleIcon,
    component: AboutPage as ComponentType<Record<string, unknown>>,
    title: "About",
    category: "Pages",
    description: "About this desktop environment",
    settings: {
      defaultSize: { width: 640, height: 480 },
      sizeConstraints: { min: { width: 400, height: 300 }, max: { width: 900, height: 700 } },
      center: true,
    } satisfies AppSettings,
  },
  {
    id: "docs",
    label: "Docs",
    icon: BookOpenIcon,
    component: DocsPage as ComponentType<Record<string, unknown>>,
    title: "Documentation",
    category: "Pages",
    description: "Technical documentation and guides",
    settings: {
      defaultSize: { width: 860, height: 580 },
      sizeConstraints: { min: { width: 500, height: 400 }, max: { width: 1400, height: 1000 } },
      center: true,
    } satisfies AppSettings,
  },
  {
    id: "blog",
    label: "Blog",
    icon: PencilSquareIcon,
    component: BlogPage as ComponentType<Record<string, unknown>>,
    title: "Blog",
    category: "Pages",
    description: "Articles powered by MDX",
    settings: {
      defaultSize: { width: 780, height: 560 },
      sizeConstraints: { min: { width: 400, height: 300 }, max: { width: 1200, height: 1000 } },
      center: true,
    } satisfies AppSettings,
  },
  {
    id: "product-os",
    label: "Product OS",
    icon: FolderIcon,
    component: Explorer as ComponentType<Record<string, unknown>>,
    title: "Product OS",
    category: "Apps",
    description: "Browse and launch all apps",
    settings: {
      defaultSize: { width: 680, height: 520 },
      sizeConstraints: { min: { width: 420, height: 360 }, max: { width: 1000, height: 800 } },
      center: true,
    } satisfies AppSettings,
  },
  {
    id: "display-settings",
    label: "Settings",
    icon: Cog6ToothIcon,
    component: DisplaySettings as ComponentType<Record<string, unknown>>,
    title: "Display settings",
    category: "System",
    description: "Theme and appearance settings",
    settings: {
      defaultSize: { width: 480, height: 420 },
      sizeConstraints: { min: { width: 360, height: 320 }, max: { width: 640, height: 600 } },
      center: true,
    } satisfies AppSettings,
  },
  {
    id: "ask-max",
    label: "Ask Max",
    icon: ChatBubbleBottomCenterTextIcon,
    component: Chat as ComponentType<Record<string, unknown>>,
    title: "Ask Max",
    category: "Apps",
    description: "AI assistant with hardcoded responses",
    settings: {
      defaultSize: { width: 360, height: 480 },
      sizeConstraints: { min: { width: 300, height: 360 }, max: { width: 480, height: 640 } },
      fixedSize: false,
      center: false,
    } satisfies AppSettings,
  },
];

export default function DesktopBootstrap() {
  return (
    <AppProvider desktopIcons={DESKTOP_ICONS}>
      <Shell />
    </AppProvider>
  );
}
