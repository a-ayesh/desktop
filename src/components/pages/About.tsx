"use client";

import React from "react";
import Editor from "@/components/apps/Editor";

export default function AboutPage() {
  return (
    <Editor>
      <div className="space-y-4 text-sm leading-relaxed">
        <h1 className="text-xl font-semibold text-primary">About</h1>
        <p className="text-secondary">
          This codebase is a lean, GitHub Pages-hostable desktop OS UI built in
          Next.js. It takes inspiration from the PostHog.com website which uses
          a windowed desktop metaphor to navigate content.
        </p>
        <h2 className="text-base font-semibold text-primary pt-2">Stack</h2>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-primary">
              <th className="text-left py-1 pr-4 text-muted font-medium">Layer</th>
              <th className="text-left py-1 text-muted font-medium">Technology</th>
            </tr>
          </thead>
          <tbody className="text-secondary">
            {[
              ["Framework", "Next.js 16 (static export)"],
              ["UI", "React 19"],
              ["Styling", "Tailwind CSS v4"],
              ["Animation", "Framer Motion 12"],
              ["Hosting", "GitHub Pages"],
            ].map(([layer, tech]) => (
              <tr key={layer} className="border-b border-primary/50">
                <td className="py-1 pr-4 font-medium text-primary">{layer}</td>
                <td className="py-1">{tech}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2 className="text-base font-semibold text-primary pt-2">Key features</h2>
        <ul className="list-disc pl-5 space-y-1 text-secondary">
          <li>Draggable, resizable windows constrained to viewport</li>
          <li>Window stacking with z-index management</li>
          <li>Minimize, maximize, and restore</li>
          <li>Light / dark mode with CSS-variable theming</li>
          <li>Responsive "boring mode" for mobile</li>
          <li>Fully static — no server, no API calls</li>
        </ul>
      </div>
    </Editor>
  );
}
