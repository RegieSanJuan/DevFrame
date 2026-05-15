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

const setupDiagnosticsFlag =
  process.env.DEVFRAME_SHOW_SETUP_STATUS?.trim().toLowerCase();

export const isSetupDiagnosticsEnabled =
  process.env.NODE_ENV !== "production" || setupDiagnosticsFlag === "true";

export function getSetupStatusItems(): SetupStatusItem[] {
  return [
    {
      id: "clerk",
      title: "Clerk auth",
      description: isClerkConfigured
        ? "Authentication is ready for real sign-in and dashboard protection."
        : "Configure authentication credentials to enable sign-up and sign-in.",
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
        : "Connect database read access so public portfolio pages can read live data.",
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
        ? "Structured editor submissions can now persist to PostgreSQL."
        : "Enable server-side write access so saved portfolios can persist.",
      icon: "supabaseWrite",
      ready: isSupabaseWriteConfigured,
      statusLabel: isSupabaseWriteConfigured
        ? "Integrated into the app"
        : "Preview mode stays usable",
    },
  ];
}
