import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null) as { display_name?: string; phone?: string } | null;
  if (!body) return NextResponse.json({ error: "Profile details are required." }, { status: 400 });
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const { error } = await supabase.from("profiles").update({ display_name: body.display_name?.trim() || null, phone: body.phone?.trim() || null, updated_at: new Date().toISOString() }).eq("id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ updated: true });
}
