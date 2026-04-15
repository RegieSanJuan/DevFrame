export const appEnv = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://localhost:3000",
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
