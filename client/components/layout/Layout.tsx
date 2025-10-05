"use client";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
