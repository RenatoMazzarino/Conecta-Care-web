'use server';

import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { supabaseConfig } from '@/lib/supabaseEnv';

export function createSupabaseServerClient(): SupabaseClient {
  const cookieStore = cookies();

  return createClient(supabaseConfig.url, supabaseConfig.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    cookies: {
      get(key: string) {
        return cookieStore.get(key)?.value;
      },
      set() {
        // handled by Next.js
      },
      remove() {
        // handled by Next.js
      },
    },
  });
}
