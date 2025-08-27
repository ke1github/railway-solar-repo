"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MapPin,
  BarChart3,
  Zap,
  Settings,
  FileText,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home", icon: LayoutDashboard },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/sites", label: "Sites", icon: MapPin },
    { href: "/epc", label: "EPC Projects", icon: Zap },
    { href: "/map", label: "Map", icon: MapPin },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/solar/dashboard", label: "Solar Dashboard", icon: Zap },
    { href: "/ai/site-optimizer", label: "AI Optimizer", icon: FileText },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-md bg-background text-foreground border border-border"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar for desktop */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-background border-r border-border transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="flex flex-col h-full p-4">
          <div className="py-6 px-4 border-b border-border mb-6">
            <h2 className="text-xl font-semibold">Railway Solar</h2>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm rounded-md transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-4 border-t border-border">
            <Link
              href="/settings"
              className="flex items-center px-4 py-3 text-sm rounded-md text-foreground hover:bg-muted"
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </Link>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
