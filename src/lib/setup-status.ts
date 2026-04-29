import {
  isClerkConfigured,
  isSupabaseReadConfigured,
  isSupabaseWriteConfigured,
} from "@/lib/env";

export type SetupStatusIcon = "clerk" | "supabaseRead" | "supabaseWrite";

export type SetupStatusItem = {
  id: SetupStatusIcon;
  title: string;
  description: string;
  icon: SetupStatusIcon;
  ready: boolean;
  statusLabel: string;
};

export type SetupStatusResponse = {
  items: SetupStatusItem[];
};

export function getSetupStatusItems(): SetupStatusItem[] {
  return [
    {
      id: "clerk",
      title: "Clerk auth",
      description: isClerkConfigured
        ? "Authentication is ready for real sign-in and dashboard protection."
        : "Add your Clerk publishable key and secret key to enable sign-up and sign-in.",
      icon: "clerk",
      ready: isClerkConfigured,
      statusLabel: isClerkConfigured
        ? "Integrated into the app"
        : "Preview mode stays usable",
    },
    {
      id: "supabaseRead",
      title: "Supabase read access",
      description: isSupabaseReadConfigured
        ? "Public portfolio reads and API access can use your Supabase project."
        : "Add the project URL and publishable key so public portfolio pages can read live data.",
      icon: "supabaseRead",
      ready: isSupabaseReadConfigured,
      statusLabel: isSupabaseReadConfigured
        ? "Integrated into the app"
        : "Preview mode stays usable",
    },
    {
      id: "supabaseWrite",
      title: "Supabase write access",
      description: isSupabaseWriteConfigured
        ? "Builder submissions can now persist to PostgreSQL."
        : "Add the service role key to let server actions save portfolios from Clerk-authenticated users.",
      icon: "supabaseWrite",
      ready: isSupabaseWriteConfigured,
      statusLabel: isSupabaseWriteConfigured
        ? "Integrated into the app"
        : "Preview mode stays usable",
    },
  ];
}
