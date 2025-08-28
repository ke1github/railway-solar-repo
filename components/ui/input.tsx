import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md bg-transparent px-3 py-1 text-base border-subtle transition-all duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      variant: {
        default: "dark:bg-input/30",
        railway: "focus-visible:ring-[rgb(var(--logo-amber))]",
      },
      borderStyle: {
        none: "border-0",
        subtle: "border-subtle",
        standard: "border-standard",
        prominent: "border-prominent",
      },
    },
    defaultVariants: {
      variant: "default",
      borderStyle: "subtle",
    },
  }
);

interface InputProps
  extends React.ComponentProps<"input">,
    VariantProps<typeof inputVariants> {
  withBorder?: boolean;
}

function Input({
  className,
  type,
  variant,
  borderStyle,
  withBorder = true,
  ...props
}: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        inputVariants({
          variant,
          borderStyle: withBorder ? borderStyle : "none",
          className,
        })
      )}
      {...props}
    />
  );
}

export { Input, inputVariants };
