"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { ButtonLink } from "@/components/ui/button-link";
import {
  LayoutDashboard,
  MapPin,
  Bolt,
  LineChart,
  LayoutGrid,
  PanelTop,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/",
      label: "Overview",
      icon: <LayoutDashboard className="size-4" />,
    },
    { href: "/sites", label: "Sites", icon: <MapPin className="size-4" /> },
    { href: "/epc", label: "EPC Projects", icon: <Bolt className="size-4" /> },
    { href: "/map", label: "Map", icon: <LayoutGrid className="size-4" /> },
    {
      href: "/analytics",
      label: "Analytics",
      icon: <LineChart className="size-4" />,
    },
    {
      href: "/ui-showcase",
      label: "UI Components",
      icon: <PanelTop className="size-4" />,
    },
  ];

  return (
    <nav className="bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center">
            <Link href="/" className="flex items-center mr-8">
              <span className="text-railway-gradient font-bold text-lg">
                Railway Solar
              </span>
            </Link>

            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <ButtonLink
                  key={item.href}
                  href={item.href}
                  variant={
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href))
                      ? "railway-primary"
                      : "ghost"
                  }
                  size="sm"
                  icon={item.icon}
                  className="rounded-md"
                >
                  {item.label}
                </ButtonLink>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <ButtonLink
              href="/login"
              variant="railway-secondary"
              size="sm"
              className="mr-2"
            >
              Login
            </ButtonLink>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
