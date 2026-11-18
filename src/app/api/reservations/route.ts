import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (process.env.NEXT_PUBLIC_APP_MODE !== "production") {
    return NextResponse.json(
      { error: "Demo mode is active. No real reservations are created." },
      { status: 409 },
    );
  }

  const payload = await request.json().catch(() => null) as { tripSlug?: string; seats?: number } | null;
  const tripSlug = payload?.tripSlug;
  const seats = payload?.seats;
  if (!tripSlug || typeof seats !== "number" || !Number.isInteger(seats) || seats < 1 || seats > 12) {
    return NextResponse.json({ error: "Choose between 1 and 12 seats." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in before starting a reservation." }, { status: 401 });
  }

  const { data: trip } = await supabase.from("trips").select("id").eq("slug", tripSlug).eq("status", "gathering").single();
  if (!trip) return NextResponse.json({ error: "This journey is not available for reservation." }, { status: 400 });
  const { data, error } = await supabase.rpc("create_reservation", {
    p_trip_id: trip.id,
    p_seats: seats,
    p_preferred_dates: [],
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ reservation: data });
}
