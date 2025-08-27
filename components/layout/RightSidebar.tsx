"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

interface RightSidebarProps {
  className?: string;
}

export function RightSidebar({ className }: RightSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Sample notifications for the sidebar
  const notifications = [
    {
      id: 1,
      title: "Site Maintenance",
      message: "Scheduled maintenance for Site A completed",
      time: "2 hours ago",
    },
    {
      id: 2,
      title: "Production Alert",
      message: "Site B production below expected threshold",
      time: "5 hours ago",
    },
    {
      id: 3,
      title: "New Report Available",
      message: "Monthly analytics report is ready for review",
      time: "1 day ago",
    },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <div className="fixed top-4 right-4 z-50 lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md bg-background text-foreground border border-border"
        >
          {isOpen ? <X size={20} /> : <Bell size={20} />}
        </button>
      </div>

      {/* Right sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-40 w-64 bg-background border-l border-border transition-transform lg:translate-x-0",
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0",
          className
        )}
      >
        <div className="flex flex-col h-full p-4">
          <div className="py-4 px-2 border-b border-border mb-6 flex items-center justify-between">
            <h3 className="text-lg font-medium">Notifications</h3>
            <ThemeToggle />
          </div>

          <div className="flex-1 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="mb-4 p-3 border border-border rounded-md bg-background-subtle"
              >
                <h4 className="font-medium">{notification.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {notification.message}
                </p>
                <span className="text-xs text-muted-foreground mt-2 block">
                  {notification.time}
                </span>
              </div>
            ))}
          </div>

          <Card className="mt-6">
            <CardHeader className="py-3">
              <CardTitle className="text-sm">System Status</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs">Server Uptime</span>
                <span className="text-xs font-medium">99.9%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs">Data Refresh</span>
                <span className="text-xs font-medium">5 min ago</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
