'use client';
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabaseBrowserClient: SupabaseClient | null = null;


export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (supabaseBrowserClient) {
    return supabaseBrowserClient;
  }

  const supabaseUrl =  process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    if (typeof window !== "undefined") {
      console.warn(
        "NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY missing; realtime chat updates disabled."
      );
    }
    return null;
  }

  supabaseBrowserClient = createClient(supabaseUrl, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  return supabaseBrowserClient;
}
