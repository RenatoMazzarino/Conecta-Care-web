import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured.");
}

type ShiftStatus = "scheduled" | "published" | "assigned" | "in_progress" | "completed" | "cancelled";

type Payload = {
  shiftId: string;
  status: ShiftStatus;
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

  let payload: Payload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400 });
  }

  if (!payload.shiftId || !payload.status) {
    return new Response(JSON.stringify({ error: "shiftId and status are required" }), { status: 400 });
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

  const { data: shift, error: updateError } = await authedClient
    .from("shifts")
    .update({
      status: payload.status,
      meta: payload.meta ?? {},
    })
    .eq("id", payload.shiftId)
    .select("id, tenant_id, status, meta, updated_at")
    .single();

  if (updateError || !shift) {
    return new Response(JSON.stringify({ error: updateError?.message ?? "Failed to update shift" }), { status: 500 });
  }

  await adminClient.from("audit_logs").insert({
    tenant_id: shift.tenant_id,
    entity: "shifts",
    entity_id: shift.id,
    action: "UPDATE_STATUS",
    actor_id: userId,
    payload: {
      status: payload.status,
      meta: payload.meta ?? {},
    },
  });

  return new Response(
    JSON.stringify({
      ok: true,
      shift,
    }),
    { status: 200 }
  );
});
