// src/server/getCurrentTenantId.ts
"use server";

import type { SupabaseClient } from "@supabase/supabase-js";

export async function getCurrentTenantId(
  supabase: SupabaseClient,
): Promise<string> {
  const { data, error } = await supabase.rpc("current_tenant");

  if (error) {
    throw new Error(`Nao foi possivel obter o tenant atual: ${error.message}`);
  }

  if (!data) {
    throw new Error(
      "Nenhum tenant associado ao usuario atual. Verifique user_profiles.",
    );
  }

  return data;
}
