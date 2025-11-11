"use server";

import { z } from "zod";
import { getSupabaseServerClient } from "@/server/supabaseServerClient";
import { getCurrentTenantId } from "@/server/getCurrentTenantId";

const DeleteMemberPayloadZ = z.object({
  id: z.string().uuid(),
});

export async function deleteSupportMember(payload: unknown) {
  const supabase = await getSupabaseServerClient();
  const tenantId = await getCurrentTenantId(supabase);

  const input =
    typeof payload === "object" && payload !== null ? payload : {};

  const { id } = DeleteMemberPayloadZ.parse(input);

  // Delete will be filtered by RLS policies automatically
  const { error } = await supabase
    .from("patient_support_members")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  return { ok: true };
}
