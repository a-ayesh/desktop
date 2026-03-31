"use client";

import React, { useState } from "react";
import Reader from "@/components/apps/Reader";

const NAV_ITEMS = [
  { label: "Getting started", onClick: () => {} },
  {
    label: "Concepts",
    children: [
      { label: "Windows", onClick: () => {} },
      { label: "Desktop", onClick: () => {} },
      { label: "Theming", onClick: () => {} },
    ],
  },
  {
    label: "Components",
    children: [
      { label: "AppWindow", onClick: () => {} },
      { label: "TaskBar", onClick: () => {} },
      { label: "Editor", onClick: () => {} },
      { label: "Reader", onClick: () => {} },
    ],
  },
  { label: "Deployment", onClick: () => {} },
];

const OUTLINE = [
  { label: "Overview" },
  { label: "Window system" },
  { label: "Theming" },
  { label: "Deployment" },
];

export default function DocsPage() {
  return (
    <Reader navItems={NAV_ITEMS} outline={OUTLINE}>
      <div className="space-y-5 text-sm leading-relaxed">
        <h1 className="text-xl font-semibold text-primary">Documentation</h1>

        <section className="space-y-2">
          <h2 id="overview" className="text-base font-semibold text-primary">
            Overview
          </h2>
          <p className="text-secondary">
            This desktop environment renders every page as a draggable,
            resizable window on a shared canvas. Windows are managed by the{" "}
            <code className="bg-accent px-1 rounded text-xs">AppContext</code>{" "}
            which tracks position, size, z-index, and minimize state.
          </p>
        </section>

        <section className="space-y-2">
          <h2 id="window-system" className="text-base font-semibold text-primary">
            Window system
          </h2>
          <p className="text-secondary">
            Each window is an{" "}
            <code className="bg-accent px-1 rounded text-xs">AppWindow</code>{" "}
            component wrapping a Framer Motion{" "}
            <code className="bg-accent px-1 rounded text-xs">motion.div</code>.
            Drag is initiated from the title bar using{" "}
            <code className="bg-accent px-1 rounded text-xs">useDragControls</code>.
            Resize uses raw pointer events against the window&apos;s{" "}
            <code className="bg-accent px-1 rounded text-xs">getBoundingClientRect</code>.
          </p>
          <pre className="bg-accent rounded p-3 text-xs overflow-x-auto text-primary">
{`openWindow(
  "my-app",       // unique id
  MyComponent,    // React component
  "My App",       // title bar text
  { foo: "bar" }  // props forwarded to component
)`}
          </pre>
        </section>

        <section className="space-y-2">
          <h2 id="theming" className="text-base font-semibold text-primary">
            Theming
          </h2>
          <p className="text-secondary">
            Colors are driven by CSS variables set on{" "}
            <code className="bg-accent px-1 rounded text-xs">data-scheme</code>{" "}
            elements. Three schemes exist:{" "}
            <strong>primary</strong> (page surface),{" "}
            <strong>secondary</strong> (sidebars), and{" "}
            <strong>tertiary</strong> (window chrome / taskbar). Light and dark
            modes flip the variable values.
          </p>
        </section>

        <section className="space-y-2">
          <h2 id="deployment" className="text-base font-semibold text-primary">
            Deployment
          </h2>
          <p className="text-secondary">
            The site is built with{" "}
            <code className="bg-accent px-1 rounded text-xs">
              output: &quot;export&quot;
            </code>{" "}
            in <code className="bg-accent px-1 rounded text-xs">next.config.ts</code>,
            producing a fully-static <code>out/</code> folder. Deploy by pushing
            that folder to the <code>gh-pages</code> branch of your repo.
          </p>
          <pre className="bg-accent rounded p-3 text-xs overflow-x-auto text-primary">
{`# Build static output
pnpm build

# Push to GitHub Pages (using gh-pages CLI or Actions)`}
          </pre>
        </section>
      </div>
    </Reader>
  );
}
