import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arboretum Console - Master Gardener's Office",
  description: "Timeless stewardship platform for high-end horticultural consultancy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
