import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const textareaVariants = cva(
  "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md bg-transparent px-3 py-2 text-base transition-all duration-200 outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      variant: {
        default: "",
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

interface TextareaProps
  extends React.ComponentProps<"textarea">,
    VariantProps<typeof textareaVariants> {
  withBorder?: boolean;
}

function Textarea({
  className,
  variant,
  borderStyle,
  withBorder = true,
  ...props
}: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      data-variant={variant}
      className={cn(
        textareaVariants({
          variant,
          borderStyle: withBorder ? borderStyle : "none",
          className,
        })
      )}
      {...props}
    />
  );
}

export { Textarea, textareaVariants };
