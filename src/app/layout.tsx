import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEFOTrack - Shipment Tracking",
  description: "Track your shipments in real-time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full overflow-x-hidden">{children}</body>
    </html>
  );
}
