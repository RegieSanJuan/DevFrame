"use client";

import { Database, KeyRound, ServerCog, type LucideIcon } from "lucide-react";

import { ReadinessBadge } from "@/components/ui/readiness-badge";
import { useSetupStatus } from "@/hooks/use-setup-status";
import type { SetupStatusIcon, SetupStatusItem } from "@/lib/setup-status";

type SetupStatusClientProps = {
  initialItems: SetupStatusItem[];
};

const setupStatusIcons: Record<SetupStatusIcon, LucideIcon> = {
  clerk: KeyRound,
  supabaseRead: Database,
  supabaseWrite: ServerCog,
};

export function SetupStatusClient({
  initialItems,
}: SetupStatusClientProps) {
  const { items, isRefreshing, error } = useSetupStatus(initialItems);

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => {
        const Icon = setupStatusIcons[item.icon];

        return (
          <div
            key={item.id}
            className="group flex flex-col gap-4 rounded-[26px] border border-border bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-strong"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="flex size-12 items-center justify-center rounded-[18px] border border-border bg-surface-strong text-accent transition-colors group-hover:bg-surface">
                <Icon className="size-5" />
              </span>
              <ReadinessBadge ready={item.ready} />
            </div>

            <div>
              <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                {item.description}
              </p>
            </div>

            <div className="mt-auto border-t border-border pt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                {item.statusLabel}
              </p>
            </div>
          </div>
        );
      })}

      {isRefreshing ? (
        <p className="text-xs uppercase tracking-[0.22em] text-foreground-soft">
          Refreshing setup status...
        </p>
      ) : null}

      {error ? (
        <p className="text-sm text-warning">
          {error} Showing the last known setup snapshot instead.
        </p>
      ) : null}
    </div>
  );
}
