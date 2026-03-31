"use client";

import React from "react";
import Editor from "@/components/apps/Editor";

export default function AboutPage() {
  return (
    <Editor>
      <div className="prose-desktop space-y-4">
        <h1>About this desktop</h1>

        <p>
          A browser-based desktop OS experience built with modern web tech.
          Inspired by <a href="https://posthog.com" target="_blank" rel="noopener noreferrer">PostHog.com</a>'s
          innovative windowed interface.
        </p>

        <h2>Tech stack</h2>
        <ul>
          <li><strong>Next.js 16</strong> — Static export, App Router</li>
          <li><strong>Framer Motion</strong> — Drag, resize, and animation</li>
          <li><strong>Tailwind CSS v4</strong> — Semantic color token system</li>
          <li><strong>Radix UI</strong> — Accessible primitives (menus, dropdowns)</li>
          <li><strong>MDX</strong> — Rich content authoring</li>
        </ul>

        <h2>Features</h2>
        <ul>
          <li>Draggable, resizable, minimizable windows</li>
          <li>PostHog-inspired light theme</li>
          <li>Mobile responsive (linear "boring" mode)</li>
          <li>Spotlight-style search</li>
          <li>Ask Max AI chat (hardcoded)</li>
          <li>Product OS app explorer</li>
          <li>MDX content rendering</li>
        </ul>

        <h2>Keyboard shortcuts</h2>
        <table>
          <thead>
            <tr>
              <th>Key</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><code>/</code> or <code>⌘K</code></td><td>Open search</td></tr>
            <tr><td><code>?</code></td><td>Open Ask Max</td></tr>
            <tr><td><code>Esc</code></td><td>Close panel / search</td></tr>
          </tbody>
        </table>
      </div>
    </Editor>
  );
}
