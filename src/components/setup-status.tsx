import { Database, KeyRound, ServerCog } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <div className="grid gap-4 lg:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <Card
            key={item.title}
            className="border-border transition-transform duration-200 hover:-translate-y-1 hover:border-accent/24"
          >
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <span className="flex size-12 items-center justify-center rounded-2xl border border-border bg-surface-strong text-accent">
                  <Icon className="size-5" />
                </span>
                <Badge variant={item.ready ? "success" : "warning"}>
                  {item.ready ? "Ready" : "Needs setup"}
                </Badge>
              </div>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-foreground-soft">
                {item.ready
                  ? "Integrated into the app"
                  : "Preview mode stays usable until this is added"}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
