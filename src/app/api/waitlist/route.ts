import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (process.env.NEXT_PUBLIC_APP_MODE !== "production") return NextResponse.json({ error: "Demo mode is active. No waitlist entry was created." }, { status: 409 });
  const body = await request.json().catch(() => null) as { tripId?: string; seats?: number; preferredDates?: string[] } | null;
  if (!body?.tripId || typeof body.seats !== "number" || !Number.isInteger(body.seats) || body.seats < 1 || body.seats > 12) return NextResponse.json({ error: "Choose between 1 and 12 seats." }, { status: 400 });
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in before joining a waitlist." }, { status: 401 });
  const { data: trip } = await supabase.from("trips").select("id,preferred_dates").eq("id", body.tripId).single();
  if (!trip) return NextResponse.json({ error: "Journey not found." }, { status: 400 });
  const { error } = await supabase.rpc("join_trip_waitlist", {
    p_trip_id: trip.id,
    p_seats: body.seats,
    p_preferred_dates: body.preferredDates ?? [],
  });
  if (error) return NextResponse.json({ error: "Could not join the waitlist." }, { status: 400 });
  return NextResponse.json({ joined: true });
}
