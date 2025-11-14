const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

const fallbackEnabled =
  (process.env.NEXT_PUBLIC_ALLOW_SUPABASE_FALLBACK ?? "1") !== "0";

const fallbackConfig = fallbackEnabled
  ? {
      url: "http://127.0.0.1:54321",
      anonKey: "sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH",
    }
  : null;

const resolvedUrl = supabaseUrl ?? fallbackConfig?.url;
const resolvedAnonKey = supabaseAnonKey ?? fallbackConfig?.anonKey;

if (!resolvedUrl || !resolvedAnonKey) {
  throw new Error(
    "Supabase environment variables are not set. Execute `.\\scripts\\switch-env.ps1 -Mode <local|cloud>` to generate .env.local.dev with the correct keys or define NEXT_PUBLIC_ALLOW_SUPABASE_FALLBACK=1 to use the local defaults."
  );
}

if (!supabaseUrl || !supabaseAnonKey) {
  const envLabel =
    process.env.NODE_ENV === "production" ? "production fallback" : "development fallback";
  const note =
    process.env.NODE_ENV === "production"
      ? "Never deploy with these keys—configure the cloud credentials instead."
      : "Run `.\\scripts\\switch-env.ps1` to generate a proper .env.local.dev file.";
  console.warn(`[Supabase] Using ${envLabel} keys. ${note}`);
}

export const supabaseConfig = {
  url: resolvedUrl,
  anonKey: resolvedAnonKey,
};
