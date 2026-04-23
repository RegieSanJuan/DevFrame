import { Database, KeyRound, ServerCog } from "lucide-react";

import {
  isClerkConfigured,
  isSupabaseReadConfigured,
  isSupabaseWriteConfigured,
} from "@/lib/env";

export function SetupStatus() {
  const items = [
    {
      title: "Clerk auth",
      description: isClerkConfigured
        ? "Authentication is ready for real sign-in and dashboard protection."
        : "Add your Clerk publishable key and secret key to enable sign-up and sign-in.",
      icon: KeyRound,
      ready: isClerkConfigured,
    },
    {
      title: "Supabase read access",
      description: isSupabaseReadConfigured
        ? "Public portfolio reads and API access can use your Supabase project."
        : "Add the project URL and publishable key so public portfolio pages can read live data.",
      icon: Database,
      ready: isSupabaseReadConfigured,
    },
    {
      title: "Supabase write access",
      description: isSupabaseWriteConfigured
        ? "Builder submissions can now persist to PostgreSQL."
        : "Add the service role key to let server actions save portfolios from Clerk-authenticated users.",
      icon: ServerCog,
      ready: isSupabaseWriteConfigured,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="group flex flex-col gap-4 rounded-[26px] border border-border bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-strong"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="flex size-12 items-center justify-center rounded-[18px] border border-border bg-surface-strong text-accent transition-colors group-hover:bg-surface">
                <Icon className="size-5" />
              </span>
              {item.ready ? (
                <span className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Ready
                </span>
              ) : (
                <span className="rounded-full border border-warning/20 bg-warning/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-warning">
                  Needs setup
                </span>
              )}
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
                {item.ready
                  ? "Integrated into the app"
                  : "Preview mode stays usable"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
