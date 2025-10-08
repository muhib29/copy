"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/admin/Header";
import { Sidebar } from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (!session && pathname !== "/admin/login") {
      router.push("/admin/login");
      return;
    }

    if (session && session.user.role !== "admin" && pathname !== "/admin/login") {
      router.push("/admin/login");
      return;
    }

    if (session && session.user.role === "admin" && pathname === "/admin/login") {
      router.push("/admin/dashboard");
      return;
    }
  }, [session, status, router, pathname]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!session || session.user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={mobileMenuOpen} setIsOpen={setMobileMenuOpen} />
      <div className="flex-1 lg:pl-64">
        <Header toggleMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
