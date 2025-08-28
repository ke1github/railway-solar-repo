import React from "react";
import { cn } from "@/lib/utils";

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

// Heading Components
export function TypographyH1({ children, className }: TypographyProps) {
  return (
    <h1 className={cn("text-heading-1 scroll-m-20", className)}>{children}</h1>
  );
}

export function TypographyH2({ children, className }: TypographyProps) {
  return (
    <h2 className={cn("text-heading-2 scroll-m-20", className)}>{children}</h2>
  );
}

export function TypographyH3({ children, className }: TypographyProps) {
  return (
    <h3 className={cn("text-heading-3 scroll-m-20", className)}>{children}</h3>
  );
}

export function TypographyH4({ children, className }: TypographyProps) {
  return (
    <h4 className={cn("text-heading-4 scroll-m-20", className)}>{children}</h4>
  );
}

// Paragraph Components
export function TypographyP({ children, className }: TypographyProps) {
  return <p className={cn("text-body", className)}>{children}</p>;
}

export function TypographyLarge({ children, className }: TypographyProps) {
  return <p className={cn("text-body-lg", className)}>{children}</p>;
}

export function TypographySmall({ children, className }: TypographyProps) {
  return <p className={cn("text-body-sm", className)}>{children}</p>;
}

export function TypographyCaption({ children, className }: TypographyProps) {
  return <p className={cn("text-caption", className)}>{children}</p>;
}

// Inline Components
export function TypographyInlineCode({ children, className }: TypographyProps) {
  return (
    <code
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm",
        className
      )}
    >
      {children}
    </code>
  );
}

// List Components
export function TypographyList({ children, className }: TypographyProps) {
  return (
    <ul className={cn("text-body my-2 ml-6 list-disc", className)}>
      {children}
    </ul>
  );
}

// Lead Text
export function TypographyLead({ children, className }: TypographyProps) {
  return (
    <p className={cn("text-heading-4 font-normal", className)}>{children}</p>
  );
}
