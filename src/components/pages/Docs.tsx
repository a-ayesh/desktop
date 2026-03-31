"use client";

import React from "react";
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
      <div className="prose-desktop">
        <h1>Documentation</h1>

        <h2 id="overview">Overview</h2>
        <p>
          This desktop environment renders every page as a draggable,
          resizable window on a shared canvas. Windows are managed by the{" "}
          <code>AppContext</code> which tracks position, size, z-index, and
          minimize state.
        </p>

        <h2 id="window-system">Window system</h2>
        <p>
          Each window is an <code>AppWindow</code> component wrapping a Framer
          Motion <code>motion.div</code>. Drag is initiated from the title bar
          using <code>useDragControls</code>. Resize uses raw pointer events.
        </p>
        <pre><code>{`openWindow(
  "my-app",       // unique id
  MyComponent,    // React component
  "My App",       // title bar text
  { foo: "bar" }  // props forwarded to component
)`}</code></pre>

        <h2 id="theming">Theming</h2>
        <p>
          Colors are driven by CSS variables set on <code>data-scheme</code>{" "}
          elements. Three schemes exist: <strong>primary</strong> (page
          surface), <strong>secondary</strong> (sidebars), and{" "}
          <strong>tertiary</strong> (window chrome/taskbar). Each scheme
          defines its own set of color variable values.
        </p>

        <h2 id="deployment">Deployment</h2>
        <p>
          The site uses <code>output: &quot;export&quot;</code> in{" "}
          <code>next.config.ts</code>, producing a fully-static{" "}
          <code>out/</code> folder. Deploy to GitHub Pages by pushing that
          folder to your <code>gh-pages</code> branch.
        </p>
        <pre><code>{`# Build static output
pnpm build
# Push to GitHub Pages`}</code></pre>
      </div>
    </Reader>
  );
}
