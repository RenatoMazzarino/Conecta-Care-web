// src/server/supabaseServerClient.ts
"use server";

import { cookies } from "next/headers";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseConfig } from "@/lib/supabaseEnv";

/**
 * Cria um cliente do Supabase para uso no SERVIDOR (Server Components / Server Actions).
 * Tenta reaproveitar o token presente nos cookies para respeitar o RLS.
 */
export async function createSupabaseServerClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("sb-access-token")?.value;
  const refreshToken = cookieStore.get("sb-refresh-token")?.value;

  const client = createClient(supabaseConfig.url, supabaseConfig.anonKey, {
    auth: {
      autoRefreshToken: Boolean(refreshToken),
      persistSession: false,
      detectSessionInUrl: false,
    },
  });

  if (accessToken) {
    await client.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken ?? "",
    });
  }

  return client;
}

/** Alias para manter compatibilidade com imports existentes nas actions */
export const getSupabaseServerClient = createSupabaseServerClient;
