import React from "react";
import type { ComponentPropsWithoutRef } from "react";

// MDXComponents type defined locally to avoid requiring @types/mdx before install
type MDXComponents = Record<string, React.ComponentType<ComponentPropsWithoutRef<never>>>;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

function AnchorHeading({
  level,
  children,
  className,
}: {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children?: React.ReactNode;
  className?: string;
}) {
  const Tag = `h${level}` as HeadingTag;
  const text = typeof children === "string" ? children : "";
  const id = slugify(text);
  return (
    <Tag id={id} className={className}>
      <a href={`#${id}`} className="no-underline hover:underline text-inherit">
        {children}
      </a>
    </Tag>
  );
}

// ─── Callout box ───────────────────────────────────────────────────────────

type CalloutType = "note" | "warning" | "danger" | "success";

export function CalloutBox({
  type = "note",
  children,
}: {
  type?: CalloutType;
  children: React.ReactNode;
}) {
  return <div className={`callout-box callout-${type}`}>{children}</div>;
}

// ─── Product screenshot ────────────────────────────────────────────────────

export function ProductScreenshot({
  src,
  alt,
  caption,
}: {
  src: string;
  alt?: string;
  caption?: string;
}) {
  return (
    <figure className="my-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt ?? ""}
        className="w-full rounded-lg border border-primary shadow-sm"
      />
      {caption && (
        <figcaption className="text-xs text-muted text-center mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// ─── MDX component map ─────────────────────────────────────────────────────

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => <AnchorHeading level={1} {...(props as { children?: React.ReactNode; className?: string })} />,
    h2: (props) => <AnchorHeading level={2} {...(props as { children?: React.ReactNode; className?: string })} />,
    h3: (props) => <AnchorHeading level={3} {...(props as { children?: React.ReactNode; className?: string })} />,
    h4: (props) => <AnchorHeading level={4} {...(props as { children?: React.ReactNode; className?: string })} />,
    h5: (props) => <AnchorHeading level={5} {...(props as { children?: React.ReactNode; className?: string })} />,
    h6: (props) => <AnchorHeading level={6} {...(props as { children?: React.ReactNode; className?: string })} />,

    // Tables with horizontal scroll wrapper
    table: ({ children, ...props }: { children?: React.ReactNode }) => (
      <div className="overflow-x-auto my-4">
        <table {...props}>{children}</table>
      </div>
    ),

    // Pass-through pre (styling via prose-desktop CSS)
    pre: ({ children, ...props }: { children?: React.ReactNode }) => (
      <pre {...props}>{children}</pre>
    ),

    // Links: open external in new tab
    a: ({ href, children, ...props }: { href?: string; children?: React.ReactNode }) => {
      const isExternal = href?.startsWith("http") || href?.startsWith("//");
      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          {...props}
        >
          {children}
        </a>
      );
    },

    // Custom components available in MDX files
    CalloutBox: CalloutBox as React.ComponentType<ComponentPropsWithoutRef<never>>,
    ProductScreenshot: ProductScreenshot as React.ComponentType<ComponentPropsWithoutRef<never>>,

    // User-provided overrides spread last
    ...components,
  };
}
