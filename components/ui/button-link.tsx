"use client";

import * as React from "react";
import Link from "next/link";
import { VariantProps } from "class-variance-authority";
import { ChevronRight, ExternalLink } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

// Define railway-specific variants
type RailwayVariants = "railway-primary" | "railway-secondary";

export interface ButtonLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: VariantProps<typeof buttonVariants>["variant"] | RailwayVariants;
  size?: VariantProps<typeof buttonVariants>["size"];
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  showChevron?: boolean;
  showExternalIcon?: boolean;
  isExternal?: boolean;
  activeClassName?: string;
  isActive?: boolean;
}

/**
 * ButtonLink - A versatile link component styled as a button
 *
 * Features:
 * - All button variants from the existing button component
 * - Optional icons on left or right
 * - Automatic external link detection with icon
 * - Chevron option for navigation links
 * - Active state styling
 */
export function ButtonLink({
  className,
  href,
  variant = "default",
  size = "default",
  children,
  icon,
  iconPosition = "left",
  showChevron = false,
  showExternalIcon,
  isExternal,
  activeClassName,
  isActive,
  ...props
}: ButtonLinkProps) {
  // Check if the link is external (starts with http or https)
  const isExternalLink =
    isExternal ?? (href.startsWith("http") || href.startsWith("https"));

  // For special railway-branded links
  const isRailwayVariant =
    variant === "railway-primary" || variant === "railway-secondary";

  // Dynamically generate classes based on railway variants
  const getLinkClasses = () => {
    if (variant === "railway-primary") {
      return cn(
        "relative inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium bg-railway-gradient text-slate-900 shadow-railway hover:shadow-lg hover:translate-y-[-1px] transition-all duration-200",
        size === "sm"
          ? "py-1.5 px-3 text-xs"
          : size === "lg"
          ? "py-3 px-6"
          : "py-2 px-4",
        className
      );
    }

    if (variant === "railway-secondary") {
      return cn(
        "relative inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium border-2 border-[rgb(var(--logo-amber))] text-[rgb(var(--logo-amber))] hover:bg-[rgb(var(--logo-amber))]/10 hover:translate-y-[-1px] transition-all duration-200",
        size === "sm"
          ? "py-1 px-2.5 text-xs"
          : size === "lg"
          ? "py-2.5 px-5.5"
          : "py-1.5 px-3.5",
        className
      );
    }

    // Use the standard button variants
    return cn(
      buttonVariants({
        variant: variant as VariantProps<typeof buttonVariants>["variant"],
        size,
      }),
      isActive && activeClassName,
      className
    );
  };

  // The link content with icons
  const linkContent = (
    <>
      {icon && iconPosition === "left" && (
        <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === "right" && (
        <span className="shrink-0">{icon}</span>
      )}
      {showChevron && <ChevronRight className="size-4 ml-0.5" />}
      {isExternalLink && (showExternalIcon ?? true) && (
        <ExternalLink className="size-3.5 ml-0.5" />
      )}
    </>
  );

  // Render as Next.js Link for internal links or regular anchor for external
  if (isExternalLink) {
    return (
      <a
        href={href}
        className={getLinkClasses()}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {linkContent}
      </a>
    );
  }

  return (
    <Link href={href} className={getLinkClasses()} {...props}>
      {linkContent}
    </Link>
  );
}
