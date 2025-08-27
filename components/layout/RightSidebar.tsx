"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bell,
  X,
  Sun,
  AlertTriangle,
  FileText,
  Battery,
  BatteryCharging,
} from "lucide-react";
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
      title: "Solar Production Peak",
      message: "Howrah Station array reached 98% efficiency",
      time: "30 minutes ago",
      icon: Sun,
      color: "text-yellow-500",
    },
    {
      id: 2,
      title: "Maintenance Alert",
      message: "Panel cleaning scheduled for East Zone tomorrow",
      time: "2 hours ago",
      icon: AlertTriangle,
      color: "text-amber-500",
    },
    {
      id: 3,
      title: "Battery Status",
      message: "Storage system at KGP Station charged to 85%",
      time: "4 hours ago",
      icon: BatteryCharging,
      color: "text-green-500",
    },
    {
      id: 4,
      title: "New Report Available",
      message: "July 2025 efficiency report ready for review",
      time: "1 day ago",
      icon: FileText,
      color: "text-blue-500",
    },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <div className="fixed top-4 right-4 z-50 lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md bg-background/90 backdrop-blur-sm text-foreground border border-border/50 shadow-sm"
        >
          {isOpen ? <X size={20} /> : <Bell size={20} />}
        </button>
      </div>

      {/* Right sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-40 w-64 bg-background/95 backdrop-blur-sm border-l border-border/50 shadow-sm transition-transform lg:translate-x-0",
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0",
          className
        )}
      >
        <div className="flex flex-col h-full">
          <div className="py-5 px-4 border-b border-border/50 mb-4 flex items-center justify-between bg-gradient-to-l from-primary/10 to-transparent">
            <div className="flex items-center">
              <Bell className="h-5 w-5 mr-2 text-primary" />
              <h3 className="text-lg font-medium">Alerts</h3>
            </div>
            <ThemeToggle />
          </div>

          <div className="flex-1 overflow-y-auto px-4">
            {notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <div
                  key={notification.id}
                  className="mb-4 p-3 border border-border/50 rounded-lg bg-background-subtle/50 hover:bg-background-subtle transition-colors duration-200 cursor-pointer shadow-sm"
                >
                  <div className="flex items-start">
                    <div className={cn("mt-0.5 mr-3", notification.color)}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <h4 className="font-medium">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <span className="text-xs text-muted-foreground mt-2 block">
                        {notification.time}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="px-4 pb-4">
            <Card className="border-border/50 bg-background-subtle/80 shadow-sm overflow-hidden">
              <CardHeader className="py-3 px-4 bg-gradient-to-r from-primary/5 to-transparent border-b border-border/30">
                <CardTitle className="text-sm flex items-center">
                  <Battery className="h-4 w-4 mr-2 text-primary" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/30">
                  <div className="flex items-center justify-between p-3">
                    <span className="text-xs">Energy Production</span>
                    <span className="text-xs font-medium px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full">
                      2.1 MW
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3">
                    <span className="text-xs">Server Uptime</span>
                    <span className="text-xs font-medium">99.9%</span>
                  </div>
                  <div className="flex items-center justify-between p-3">
                    <span className="text-xs">Data Refresh</span>
                    <span className="text-xs font-medium">3 min ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/10 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
