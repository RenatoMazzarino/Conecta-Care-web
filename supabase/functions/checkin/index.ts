import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured.");
}

type CheckInPayload = {
  shiftId: string;
  state?: "offline" | "online" | "on_break" | "unresponsive";
  meta?: Record<string, unknown>;
};

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Missing bearer token" }), { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");
  let payload: CheckInPayload;

  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400 });
  }

  if (!payload.shiftId) {
    return new Response(JSON.stringify({ error: "shiftId is required" }), { status: 400 });
  }

  const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const { data: authResult, error: authError } = await adminClient.auth.getUser(token);
  if (authError || !authResult?.user) {
    return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
  }

  const userId = authResult.user.id;

  const authedClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const now = new Date().toISOString();
  const state = payload.state ?? "online";

  const { data: presence, error: presenceError } = await authedClient
    .from("shift_presence")
    .upsert(
      {
        shift_id: payload.shiftId,
        user_id: userId,
        state,
        meta: payload.meta ?? {},
        last_seen: now,
      },
      { onConflict: "shift_id,user_id" }
    )
    .select("id, tenant_id, state, shift_id, user_id, last_seen")
    .single();

  if (presenceError || !presence) {
    return new Response(JSON.stringify({ error: presenceError?.message ?? "Failed to update presence" }), {
      status: 500,
    });
  }

  await adminClient.from("audit_logs").insert({
    tenant_id: presence.tenant_id,
    entity: "shift_presence",
    entity_id: presence.id,
    action: "CHECKIN",
    actor_id: userId,
    payload: {
      state,
      meta: payload.meta ?? {},
      last_seen: now,
    },
  });

  return new Response(
    JSON.stringify({
      ok: true,
      presence,
    }),
    { status: 200 }
  );
});
