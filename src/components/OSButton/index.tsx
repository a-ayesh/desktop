"use client";

import React from "react";

type OSButtonSize = "xs" | "sm" | "md" | "lg";
type OSButtonVariant = "default" | "ghost";
type OSButtonAlign = "left" | "center" | "right";
type OSButtonWidth = "auto" | "full";

interface OSButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: OSButtonSize;
  variant?: OSButtonVariant;
  icon?: React.ReactNode;
  active?: boolean;
  align?: OSButtonAlign;
  width?: OSButtonWidth;
}

const sizeClasses: Record<OSButtonSize, string> = {
  xs: "px-1 py-0.5 text-xs gap-0.5 rounded",
  sm: "px-1 py-0.5 text-[13px] gap-1 rounded",
  md: "px-1.5 py-1 gap-1 rounded text-sm",
  lg: "px-2 py-1.5 text-[15px] gap-1 rounded-[6px]",
};

const iconSizeClasses: Record<OSButtonSize, string> = {
  xs: "size-3.5",
  sm: "size-4",
  md: "size-4",
  lg: "size-5",
};

const alignClasses: Record<OSButtonAlign, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

export default function OSButton({
  size = "md",
  variant = "default",
  icon,
  active = false,
  align = "center",
  width = "auto",
  className = "",
  children,
  ...props
}: OSButtonProps) {
  const base =
    "relative inline-flex items-center rounded border text-primary transition-colors focus:outline-none select-none";

  const variantClasses =
    variant === "ghost"
      ? "border-transparent hover:border-primary hover:bg-accent/50 active:bg-accent/50"
      : "border-transparent hover:border-primary active:bg-accent/50";

  const activeClasses = active ? "bg-accent/60 border-primary" : "";
  const widthClass = width === "full" ? "w-full" : "";

  const sizedIcon = icon
    ? React.isValidElement(icon)
      ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
          className: iconSizeClasses[size],
        })
      : icon
    : null;

  return (
    <button
      className={[
        base,
        variantClasses,
        sizeClasses[size],
        alignClasses[align],
        activeClasses,
        widthClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {sizedIcon}
      {children}
    </button>
  );
}
