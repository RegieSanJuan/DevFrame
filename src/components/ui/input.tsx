import * as React from "react";

import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "flex h-12 w-full rounded-xl border border-border bg-surface px-4 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] outline-none transition placeholder:text-foreground-soft focus:border-accent focus:bg-surface-strong focus:ring-2 focus:ring-accent/20",
        className,
      )}
      {...props}
    />
  );
}
