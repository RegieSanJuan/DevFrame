import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
  {
    variants: {
      variant: {
        default:
          "border-white/10 bg-white/[0.06] text-foreground hover:border-white/16 hover:bg-white/[0.08]",
        secondary:
          "border-white/10 bg-white/[0.03] text-foreground hover:border-white/16 hover:bg-white/[0.05]",
        accent:
          "border-accent bg-accent text-[#04130c] shadow-[0_20px_40px_-24px_rgba(62,207,142,0.65)] hover:border-[#5fe0a4] hover:bg-[#5fe0a4]",
        ghost:
          "border-transparent bg-transparent text-foreground-muted hover:text-foreground hover:bg-white/[0.05]",
        outline:
          "border-white/12 bg-transparent text-foreground hover:border-accent/40 hover:bg-accent/8",
      },
      size: {
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
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
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
