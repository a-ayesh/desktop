import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Desktop",
  description: "Desktop OS UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light h-full" data-skin="modern">
      <body className="h-full overflow-hidden font-os">{children}</body>
    </html>
  );
}
