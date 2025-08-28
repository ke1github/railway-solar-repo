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
  Sun,
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
          className="p-2 rounded-md bg-background text-foreground"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar for desktop */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-background/90 backdrop-blur-md shadow-md transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo and Brand Header */}
          <div className="py-6 px-5 mb-6 bg-gradient-to-r from-primary/15 to-transparent">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-railway-gradient flex items-center justify-center text-slate-900 shadow-railway">
                <Sun size={20} className="animate-pulse" />
              </div>
              <h2 className="text-xl font-semibold tracking-tight">
                Railway Solar
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mt-1 pl-11">
              Project Management
            </p>
          </div>

          <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
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
                    "flex items-center px-4 py-3 text-sm rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-railway-gradient text-slate-900 font-medium shadow-railway"
                      : "text-foreground hover:bg-background-accent hover:translate-x-1"
                  )}
                >
                  <Icon
                    className={cn(
                      "mr-3 h-5 w-5",
                      isActive ? "animate-pulse" : ""
                    )}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-4 pb-4 px-3 bg-background-subtle/50">
            <div className="px-4 py-3 mb-3 rounded-lg bg-background-accent/50 text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">
                Railway Solar v1.2.0
              </p>
              <p>Last synced: Today at 14:30</p>
            </div>
            <Link
              href="/settings"
              className="flex items-center px-4 py-3 text-sm rounded-lg text-foreground hover:bg-background-accent group transition-all duration-200"
            >
              <Settings className="mr-3 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
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
