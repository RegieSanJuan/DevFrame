import { createClient } from "@supabase/supabase-js";

import { appEnv, isSupabaseReadConfigured, isSupabaseWriteConfigured } from "@/lib/env";

export function createSupabasePublicClient() {
  if (!isSupabaseReadConfigured) {
    return null;
  }

  return createClient(appEnv.supabaseUrl, appEnv.supabasePublishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function createSupabaseAdminClient() {
  if (!isSupabaseWriteConfigured) {
    return null;
  }

  return createClient(appEnv.supabaseUrl, appEnv.supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
