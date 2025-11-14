const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

const fallbackConfig =
  process.env.NODE_ENV !== "production"
    ? {
        url: "http://127.0.0.1:54321",
        anonKey:
          "sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH",
      }
    : null;

const resolvedUrl = supabaseUrl ?? fallbackConfig?.url;
const resolvedAnonKey = supabaseAnonKey ?? fallbackConfig?.anonKey;

if (!resolvedUrl || !resolvedAnonKey) {
  throw new Error(
    "Supabase environment variables are not set. Execute `.\\scripts\\switch-env.ps1 -Mode <local|cloud>` to generate .env.local.dev with the correct keys."
  );
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[Supabase] Using fallback development keys. Run `.\\scripts\\switch-env.ps1` to generate a proper .env.local.dev file."
  );
}

export const supabaseConfig = {
  url: resolvedUrl,
  anonKey: resolvedAnonKey,
};
