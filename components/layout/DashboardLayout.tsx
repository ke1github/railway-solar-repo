"use client";

import { Sidebar } from "./Sidebar";
import { RightSidebar } from "./RightSidebar";
import { MobileNavbar } from "./MobileNavbar";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Right Sidebar */}
      <RightSidebar />

      {/* Mobile Navigation */}
      <MobileNavbar />

      {/* Main Content */}
      <main
        className={cn(
          "pt-8 pb-20 lg:pb-8", // Add bottom padding for mobile navbar
          "lg:ml-64 lg:mr-64", // Adjust for both sidebars on desktop
          "transition-all duration-300 ease-in-out" // Smooth transitions
        )}
      >
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="relative z-10 backdrop-blur-sm bg-background/40 rounded-xl p-6 shadow-sm border border-border/50">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
