"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "../../lib/utils";
import {
  LayoutDashboard,
  Image,
  Settings,
  BarChart3,
  Folder,
  LogOut,
  X,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Textures", href: "/admin/textures", icon: Image },
  { name: "Categories", href: "/admin/categories", icon: Folder },
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "Logout", href: "/admin/login", icon: LogOut, isLogout: true },
];

export function Sidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/admin/login" });
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-1 flex-col bg-card border-r">
          <div className="flex items-center px-4 py-5">
            <h1 className="text-xl font-bold">BT Tiles Admin</h1>
          </div>
          <nav className="mt-4 flex-1 space-y-1 px-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              if (item.isLogout) {
                return (
                  <button
                    key={item.name}
                    onClick={handleLogout}
                    className={cn(
                      "group w-full flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                      "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </button>
                );
              }
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                  onClick={() => setIsOpen(false)} // 👈 Close mobile on click
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-card p-4 border-r relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-red-500"
            >
              <X className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold mb-6">BT Tiles Admin</h1>
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                if (item.isLogout) {
                  return (
                    <button
                      key={item.name}
                      onClick={handleLogout}
                      className={cn(
                        "group w-full flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                        "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </button>
                  );
                }
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setIsOpen(false)}
          ></div>
        </div>
      )}
    </>
  );
}