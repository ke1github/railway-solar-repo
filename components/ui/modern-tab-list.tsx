"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface TabItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  content: React.ReactNode;
  badge?: number | string;
  disabled?: boolean;
}

interface ModernTabListProps {
  tabs: TabItem[];
  defaultValue?: string;
  className?: string;
  tabsListClassName?: string;
  tabsTriggerClassName?: string;
  tabsContentClassName?: string;
  orientation?: "horizontal" | "vertical";
  animated?: boolean;
  variant?: "default" | "pills" | "underlined" | "railway" | "minimal";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  onChange?: (value: string) => void;
}

/**
 * ModernTabList - An enhanced tab component with multiple styling variants, animations,
 * and responsive options
 */
export function ModernTabList({
  tabs,
  defaultValue,
  className,
  tabsListClassName,
  tabsTriggerClassName,
  tabsContentClassName,
  orientation = "horizontal",
  animated = true,
  variant = "default",
  size = "md",
  fullWidth = false,
  onChange,
}: ModernTabListProps) {
  const [activeTab, setActiveTab] = React.useState(
    defaultValue || tabs[0]?.id || ""
  );

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onChange?.(value);
  };

  // Generate variant classes
  const getVariantClasses = () => {
    switch (variant) {
      case "pills":
        return {
          list: "bg-background rounded-xl p-1 gap-1",
          trigger:
            "rounded-lg data-[state=active]:bg-railway-gradient data-[state=active]:text-slate-900 transition-all",
        };
      case "underlined":
        return {
          list: "bg-transparent gap-4",
          trigger:
            "rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-1 py-2",
        };
      case "railway":
        return {
          list: "bg-background/80 backdrop-blur-sm rounded-xl p-1 gap-1 shadow-sm",
          trigger:
            "rounded-lg data-[state=active]:bg-railway-gradient data-[state=active]:text-slate-900 font-medium transition-all data-[state=active]:shadow-railway",
        };
      case "minimal":
        return {
          list: "bg-transparent gap-6",
          trigger:
            "border-0 bg-transparent hover:bg-accent/20 data-[state=active]:bg-transparent data-[state=active]:text-railway-gradient",
        };
      default:
        return {
          list: "",
          trigger: "",
        };
    }
  };

  // Generate size classes
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-xs py-1 px-2";
      case "lg":
        return "text-base py-2.5 px-4";
      default: // md
        return "text-sm py-1.5 px-3";
    }
  };

  const variantClasses = getVariantClasses();
  const sizeClasses = getSizeClasses();

  return (
    <Tabs
      defaultValue={activeTab}
      value={activeTab}
      onValueChange={handleTabChange}
      className={cn(
        "w-full",
        orientation === "vertical" && "flex flex-row gap-6",
        className
      )}
    >
      <TabsList
        className={cn(
          orientation === "vertical" && "flex-col h-auto",
          fullWidth && orientation !== "vertical" && "w-full",
          variantClasses.list,
          tabsListClassName
        )}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            disabled={tab.disabled}
            className={cn(
              fullWidth && "flex-1",
              sizeClasses,
              variantClasses.trigger,
              tabsTriggerClassName
            )}
          >
            {tab.icon && <span className="mr-1.5">{tab.icon}</span>}
            {tab.label}
            {tab.badge && (
              <span className="ml-1.5 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {tab.badge}
              </span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>

      {animated ? (
        <AnimatePresence mode="wait">
          {tabs.map(
            (tab) =>
              tab.id === activeTab && (
                <TabsContent
                  key={tab.id}
                  value={tab.id}
                  className={cn(
                    "mt-2",
                    orientation === "vertical" && "flex-1",
                    tabsContentClassName
                  )}
                  asChild
                >
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {tab.content}
                  </motion.div>
                </TabsContent>
              )
          )}
        </AnimatePresence>
      ) : (
        tabs.map((tab) => (
          <TabsContent
            key={tab.id}
            value={tab.id}
            className={cn(
              "mt-2",
              orientation === "vertical" && "flex-1",
              tabsContentClassName
            )}
          >
            {tab.content}
          </TabsContent>
        ))
      )}
    </Tabs>
  );
}
