import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as Record<string,string> | null;
  if (!body) return NextResponse.json({ error: "Settings are required." }, { status: 400 });
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || profile.role !== "main_admin") return NextResponse.json({ error: "Main admin access required." }, { status: 403 });
  for (const [key, value] of Object.entries(body)) {
    if (!key || typeof value !== "string") continue;
    const { error } = await supabase.from("business_settings").upsert({ key, value, updated_by: user.id, updated_at: new Date().toISOString() });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  }
  await supabase.from("admin_audit_log").insert({ actor_id: user.id, action: "settings.updated", entity: "business_settings", entity_id: "settings", details: body });
  return NextResponse.json({ saved: true });
}
