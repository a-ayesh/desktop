"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import Editor from "@/components/apps/Editor";

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-primary last:border-b-0">
      <div>
        <div className="text-sm font-medium text-primary">{label}</div>
        {description && <div className="text-xs text-muted mt-0.5">{description}</div>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue ${checked ? "bg-blue" : "bg-accent"}`}
      >
        <span
          className={`inline-block size-4 rounded-full bg-white shadow transition-transform duration-150 mt-0.5 ${checked ? "translate-x-4.5" : "translate-x-0.5"}`}
        />
      </button>
    </div>
  );
}

export default function DisplaySettings() {
  const { siteSettings, setExperience } = useApp();

  return (
    <Editor>
      <div className="p-4 max-w-sm mx-auto">
        <h2 className="text-sm font-semibold text-primary mb-4">Display settings</h2>

        <div className="rounded-lg overflow-hidden border border-primary bg-accent/30 px-4">
          <ToggleRow
            label="OS mode"
            description="Show the full desktop OS experience"
            checked={siteSettings.experience === "desktop"}
            onChange={() =>
              setExperience(siteSettings.experience === "desktop" ? "boring" : "desktop")
            }
          />
        </div>

        <p className="text-xs text-muted mt-4 text-center">
          OS mode is automatically disabled on narrow viewports.
        </p>
      </div>
    </Editor>
  );
}
