"use client";

import "./globals.css";
import type { Metadata } from "next";
import Layout from "@/components/layout/Layout";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Nasir All Fabrics",
  description: "Elegant ladies unstitched collections for every season.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
