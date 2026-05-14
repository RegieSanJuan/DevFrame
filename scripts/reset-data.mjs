/**
 * Reset all DevFrame app data via Supabase service-role client.
 * Preserves schema, RLS, indexes, and triggers.
 *
 * Usage: node scripts/reset-data.mjs
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

const TABLES_IN_DELETE_ORDER = [
  "portfolio_domains",
  "portfolio_sections",
  "portfolio_assets",
  "portfolio_recommendations",
  "portfolio_experience",
  "portfolio_projects",
  "portfolios",
  "profiles",
];

async function resetData() {
  console.log("Starting DevFrame data reset...\n");

  for (const table of TABLES_IN_DELETE_ORDER) {
    const { count: beforeCount } = await supabase
      .from(table)
      .select("*", { count: "exact", head: true });

    const { error } = await supabase.from(table).delete().gte("created_at", "1970-01-01");

    if (error) {
      console.error(`  ✗ ${table}: ${error.message}`);
    } else {
      console.log(`  ✓ ${table} cleared (had ${beforeCount ?? 0} rows)`);
    }
  }

  console.log("\nVerifying tables are empty...\n");

  let allEmpty = true;
  for (const table of TABLES_IN_DELETE_ORDER) {
    const { count } = await supabase
      .from(table)
      .select("*", { count: "exact", head: true });

    const status = count === 0 ? "✓ empty" : `✗ ${count} rows remaining`;
    console.log(`  ${status}  ${table}`);

    if (count !== 0) {
      allEmpty = false;
    }
  }

  console.log(
    allEmpty
      ? "\n✓ All data cleared. Schema, RLS, indexes, and triggers are intact."
      : "\n⚠ Some tables still have data. Check RLS policies or FK constraints.",
  );
}

resetData().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
