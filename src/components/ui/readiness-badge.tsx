import { cn } from "@/lib/utils";

type ReadinessBadgeProps = {
  ready: boolean;
  readyLabel?: string;
  pendingLabel?: string;
};

export function ReadinessBadge({
  ready,
  readyLabel = "Ready",
  pendingLabel = "Needs setup",
}: ReadinessBadgeProps) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider",
        ready
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "border border-warning/20 bg-warning/10 text-warning",
      )}
    >
      {ready ? readyLabel : pendingLabel}
    </span>
  );
}
