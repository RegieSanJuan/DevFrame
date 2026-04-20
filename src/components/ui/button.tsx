import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
  {
    variants: {
      variant: {
        default:
          "border-border bg-surface text-foreground hover:border-border-strong hover:bg-surface-strong",
        secondary:
          "border-border bg-surface-soft text-foreground hover:border-border hover:bg-surface",
        accent:
          "border-accent bg-accent text-background shadow-[0_20px_40px_-24px_rgba(255,255,255,0.15)] hover:bg-accent-strong hover:border-accent-strong",
        ghost:
          "border-transparent bg-transparent text-foreground-muted hover:text-foreground hover:bg-surface-strong",
        outline:
          "border-border bg-transparent text-foreground hover:border-border-strong hover:bg-surface",
      },
      size: {
        xs: "h-8 px-3 text-xs",
        default: "h-11 px-5",
        sm: "h-9 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
