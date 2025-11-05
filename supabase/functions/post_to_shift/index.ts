import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured.");
}

type PostPayload = {
  shiftId: string;
  content: string;
  pinned?: boolean;
  attachments?: Record<string, unknown>[];
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

  let payload: PostPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400 });
  }

  if (!payload.shiftId || !payload.content) {
    return new Response(JSON.stringify({ error: "shiftId and content are required" }), { status: 400 });
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

  const { data: post, error: insertError } = await authedClient
    .from("shift_posts")
    .insert({
      shift_id: payload.shiftId,
      content: payload.content,
      pinned: payload.pinned ?? false,
      attachments: payload.attachments ?? [],
    })
    .select("id, tenant_id, shift_id, author_id, content, pinned, created_at")
    .single();

  if (insertError || !post) {
    return new Response(JSON.stringify({ error: insertError?.message ?? "Failed to create post" }), {
      status: 500,
    });
  }

  await adminClient.from("audit_logs").insert({
    tenant_id: post.tenant_id,
    entity: "shift_posts",
    entity_id: post.id,
    action: "CREATE_POST",
    actor_id: userId,
    payload: {
      content: payload.content,
      pinned: payload.pinned ?? false,
    },
  });

  return new Response(
    JSON.stringify({
      ok: true,
      post,
    }),
    { status: 201 }
  );
});
