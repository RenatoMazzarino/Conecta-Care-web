import { cookies } from 'next/headers';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase environment variables are not set. Define NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
  );
}

export const supabaseBrowserClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

export function createSupabaseServerClient(): SupabaseClient {
  const cookieStore = cookies();

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
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

export function getSupabaseServiceRoleClient(): SupabaseClient {
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRole) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for service client operations.');
  }

  // Nunca utilizar este client no frontend; restrito a ambientes seguros (CI/backends).
  return createClient(supabaseUrl, serviceRole, {
    auth: {
      persistSession: false,
    },
  });
}
