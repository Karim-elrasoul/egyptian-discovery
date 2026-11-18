import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as {
    name_en?: string; name_ar?: string; destination_id?: string; trip_type?: string;
    duration_days?: number; price_per_person?: number; deposit_percent?: number;
    min_travelers?: number; max_capacity?: number; booking_deadline?: string;
    preferred_dates?: string[]; hero_image?: string; status?: string;
  } | null;
  if (!body?.name_en || !body.name_ar || !body.destination_id || !body.preferred_dates?.length) {
    return NextResponse.json({ error: "Name, destination, and at least one date are required." }, { status: 400 });
  }
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || !["admin", "main_admin"].includes(profile.role)) return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  const slug = `${body.name_en.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${Date.now().toString().slice(-6)}`;
  const { data, error } = await supabase.from("trips").insert({
    slug,
    destination_id: body.destination_id,
    name_en: body.name_en,
    name_ar: body.name_ar,
    trip_type: body.trip_type || "multi-day",
    duration_days: Number(body.duration_days || 1),
    price_per_person: Number(body.price_per_person || 0),
    currency: "EGP",
    deposit_percent: Number(body.deposit_percent || 10),
    min_travelers: Number(body.min_travelers || 1),
    max_capacity: Number(body.max_capacity || 10),
    booking_deadline: body.booking_deadline || null,
    preferred_dates: body.preferred_dates,
    minimum_target_deadline: body.booking_deadline || new Date(Date.now() + 30 * 86400000).toISOString(),
    hero_image: body.hero_image || null,
    status: body.status || "draft",
    itinerary_en: [],
    itinerary_ar: [],
    included_en: [],
    included_ar: [],
    excluded_en: [],
    excluded_ar: [],
    requirements_en: [],
    requirements_ar: [],
    bring_en: [],
    bring_ar: [],
  }).select("id,slug,name_en,status").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await supabase.from("admin_audit_log").insert({ actor_id: user.id, action: "trip.created", entity: "trip", entity_id: data.id, details: { name: body.name_en } });
  return NextResponse.json({ trip: data });
}
