import * as React from "react";

import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-32 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] outline-none transition placeholder:text-foreground-soft focus:border-accent focus:bg-white/[0.04] focus:ring-2 focus:ring-accent/20",
        className,
      )}
      {...props}
    />
  );
}
