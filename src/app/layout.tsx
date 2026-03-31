import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Desktop OS",
  description: "A browser-based desktop OS experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" data-skin="modern">
      <body
        className="h-full overflow-hidden font-os"
        data-wallpaper="default"
        data-scheme="primary"
      >
        {children}
      </body>
    </html>
  );
}
