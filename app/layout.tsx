import type { Metadata } from "next";
import { inter, satoshi } from "@/lib/fonts";
import "./globals.css";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "PulseVest - The Rhythm of Investment",
  description: "The heartbeat of African creativity. The engine of investment.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          "antialiased min-h-screen",
          inter.variable,
          satoshi.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
