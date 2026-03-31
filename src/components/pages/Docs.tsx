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
          <code>next.config.ts</code>, producing a static{" "}
          <code>out/</code> directory. For GitHub project pages (
          <code>
            https://&lt;user&gt;.github.io/&lt;repo&gt;/
          </code>
          ), CI sets <code>GITHUB_REPOSITORY</code> so{" "}
          <code>basePath</code> matches the repo name. Repos named{" "}
          <code>*.github.io</code> use no subpath (user/org root site).
        </p>
        <p>
          Enable <strong>Settings → Pages → GitHub Actions</strong> as the
          source; the workflow <code>.github/workflows/deploy-github-pages.yml</code>{" "}
          builds and uploads <code>out/</code>. A <code>public/.nojekyll</code>{" "}
          file ensures the <code>_next</code> assets are not stripped by Jekyll.
        </p>
        <pre><code>{`pnpm build   # writes to out/`}</code></pre>
      </div>
    </Reader>
  );
}
