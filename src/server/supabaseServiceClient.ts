'use server';

import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { supabaseConfig } from '@/lib/supabaseEnv';

export async function getSupabaseServiceRoleClient(): Promise<SupabaseClient> {
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRole) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for service client operations.');
  }

  return createClient(supabaseConfig.url, serviceRole, {
    auth: {
      persistSession: false,
    },
  });
}
