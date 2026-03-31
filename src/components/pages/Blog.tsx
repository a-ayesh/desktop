"use client";

import React, { Suspense, lazy } from "react";
import Reader from "@/components/apps/Reader";

const HelloWorld = lazy(() => import("@/content/blog/hello-world.mdx"));

const OUTLINE = [
  { label: "What is MDX?" },
  { label: "Why MDX for a desktop OS?" },
  { label: "Keyboard shortcuts recap" },
  { label: "Code example" },
];

export default function BlogPage() {
  return (
    <Reader outline={OUTLINE}>
      <div className="prose-desktop">
        <Suspense fallback={<div className="text-muted text-xs">Loading…</div>}>
          <HelloWorld />
        </Suspense>
      </div>
    </Reader>
  );
}
