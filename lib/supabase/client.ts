import { createBrowserClient } from "@supabase/ssr";
import { createServerClient as _createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export function createServerClient() {
  return _createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      async getAll() {
        const c = await cookies();
        return c.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string }>) {
        // handled by middleware
      },
    },
  });
}
