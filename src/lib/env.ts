import { getAppUrl, normalizeOrigin } from "@/lib/app-url";

const appUrl = getAppUrl();

function getClerkAuthorizedParties() {
  const configuredOrigins = (process.env.CLERK_AUTHORIZED_PARTIES?.trim() || "")
    .split(",")
    .map((origin) => normalizeOrigin(origin))
    .filter((origin): origin is string => Boolean(origin));

  if (configuredOrigins.length > 0) {
    return Array.from(new Set(configuredOrigins));
  }

  return Array.from(
    new Set(
      [
        appUrl,
        process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() || "",
        process.env.VERCEL_BRANCH_URL?.trim() || "",
        process.env.VERCEL_URL?.trim() || "",
      ]
        .map((origin) => normalizeOrigin(origin))
        .filter((origin): origin is string => Boolean(origin)),
    ),
  );
}

export const appEnv = {
  appUrl,
  clerkAuthorizedParties: getClerkAuthorizedParties(),
  clerkPublishableKey:
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() || "",
  clerkSecretKey: process.env.CLERK_SECRET_KEY?.trim() || "",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "",
  supabasePublishableKey:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() || "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "",
};

export const isClerkConfigured = Boolean(
  appEnv.clerkPublishableKey && appEnv.clerkSecretKey,
);

export const isSupabaseReadConfigured = Boolean(
  appEnv.supabaseUrl && appEnv.supabasePublishableKey,
);

export const isSupabaseWriteConfigured = Boolean(
  isSupabaseReadConfigured && appEnv.supabaseServiceRoleKey,
);
