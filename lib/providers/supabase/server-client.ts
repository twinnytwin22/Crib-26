import { SupabaseClient, createClient } from "@supabase/supabase-js";

let supabaseServerClient: SupabaseClient | null = null;

function getEnv(key: string) {
  return process.env[key]?.trim();
}

/**
 * Returns a cached Supabase service-role client for server-side mutations.
 * Falls back gracefully when credentials are not configured so existing
 * workflows keep operating without persistence.
 */
export function getSupabaseServerClient(): SupabaseClient | null {
  if (supabaseServerClient) {
    return supabaseServerClient;
  }

  const supabaseUrl =
    getEnv("SUPABASE_URL") ?? getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    console.warn(
      "Supabase service role credentials are missing; chat persistence is disabled."
    );
    return null;
  }

  supabaseServerClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        "X-Client-Info": "crib-chat-server",
      },
    },
  });

  return supabaseServerClient;
}
