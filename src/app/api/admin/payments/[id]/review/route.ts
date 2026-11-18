import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (process.env.NEXT_PUBLIC_APP_MODE !== "production") {
    return NextResponse.json({ error: "Demo mode is active. No payment state was changed." }, { status: 409 });
  }
  const { id } = await params;
  const body = await request.json().catch(() => null) as { decision?: string } | null;
  if (body?.decision !== "approved" && body?.decision !== "rejected") {
    return NextResponse.json({ error: "Choose approved or rejected." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || !["admin", "main_admin"].includes(profile.role)) {
    return NextResponse.json({ error: "Staff access required." }, { status: 403 });
  }

  const nextStatus = body.decision === "approved" ? "approved" : "rejected";
  const { error } = await supabase.rpc("review_payment", {
    p_payment_id: id,
    p_approve: body.decision === "approved",
    p_note: body.decision === "approved" ? "Approved through admin console" : "Rejected through admin console",
  });
  if (error) return NextResponse.json({ error: "Payment review could not be saved." }, { status: 400 });
  return NextResponse.json({ reviewed: true, status: nextStatus });
}
