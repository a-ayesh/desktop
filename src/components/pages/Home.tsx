"use client";

import React from "react";
import Editor from "@/components/apps/Editor";

export default function HomePage() {
  return (
    <Editor>
      <div className="prose-desktop space-y-4">
        <h1>Welcome</h1>
        <p>
          This is a desktop OS-style environment. You can open multiple windows,
          drag them around, resize them, minimize, and maximize.
        </p>
        <ul>
          <li>Click icons on the desktop to open apps</li>
          <li>Drag windows by their title bar</li>
          <li>Resize by dragging window edges or corners</li>
          <li>Use the window controls on the right to close, minimize, or maximize</li>
          <li>Press <code>/</code> or <code>Cmd+K</code> to search</li>
          <li>Press <code>?</code> to open Ask Max</li>
        </ul>
        <hr />
        <p>
          Built with Next.js 16 · Framer Motion · Tailwind CSS v4 · MDX
        </p>
      </div>
    </Editor>
  );
}
