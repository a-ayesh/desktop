"use client";

import React from "react";
import Editor from "@/components/apps/Editor";
import { useApp } from "@/context/AppContext";

export default function HomePage() {
  const { openWindow } = useApp();

  return (
    <Editor>
      <div className="space-y-4 text-sm leading-relaxed">
        <h1 className="text-xl font-semibold text-primary">Welcome</h1>
        <p className="text-secondary">
          This is a desktop OS-style environment. You can open multiple windows,
          drag them around, resize them, minimize, and maximize.
        </p>
        <ul className="list-disc pl-5 space-y-1 text-secondary">
          <li>Click icons on the desktop to open apps</li>
          <li>Drag windows by their title bar</li>
          <li>Resize by dragging window edges</li>
          <li>Use the traffic-light controls to close / minimize / maximize</li>
          <li>Toggle light/dark mode from the top bar</li>
        </ul>
        <div className="pt-2 border-t border-primary">
          <p className="text-muted text-xs">
            Built with Next.js 16 · Framer Motion · Tailwind CSS v4
          </p>
        </div>
      </div>
    </Editor>
  );
}
