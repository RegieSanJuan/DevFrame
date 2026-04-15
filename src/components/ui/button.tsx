import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200",
  {
    variants: {
      variant: {
        default:
          "bg-slate-950 text-white shadow-[0_18px_40px_-22px_rgba(15,23,42,0.75)] hover:bg-slate-800",
        secondary:
          "border border-slate-900/10 bg-white/90 text-slate-900 hover:bg-slate-50",
        accent:
          "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-[0_20px_40px_-24px_rgba(37,99,235,0.7)] hover:from-sky-400 hover:to-blue-500",
        ghost: "text-slate-700 hover:bg-slate-950/5",
        outline:
          "border border-slate-900/15 bg-transparent text-slate-900 hover:bg-white/70",
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
