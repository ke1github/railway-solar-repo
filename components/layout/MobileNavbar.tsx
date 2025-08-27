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
} from "lucide-react";

export function MobileNavbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: LayoutDashboard },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/sites", label: "Sites", icon: MapPin },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border lg:hidden">
      <div className="flex justify-around items-center py-2">
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
                "flex flex-col items-center justify-center p-2 w-16",
                isActive ? "text-accent" : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
