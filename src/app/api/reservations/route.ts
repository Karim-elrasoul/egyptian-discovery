import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (process.env.NEXT_PUBLIC_APP_MODE !== "production") {
    return NextResponse.json(
      { error: "Demo mode is active. No real reservations are created." },
      { status: 409 },
    );
  }

  const payload = await request.json().catch(() => null) as { tripSlug?: string; seats?: number; preferredDates?: string[] } | null;
  const tripSlug = payload?.tripSlug;
  const seats = payload?.seats;
  const preferredDates = payload?.preferredDates;
  if (!tripSlug || typeof seats !== "number" || !Number.isInteger(seats) || seats < 1 || seats > 10) {
    return NextResponse.json({ error: "Choose between 1 and 10 seats." }, { status: 400 });
  }
  if (!preferredDates?.length) return NextResponse.json({ error: "Choose one or more dates offered for this trip." }, { status: 400 });

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in before starting a reservation." }, { status: 401 });
  }

  const { data: trip } = await supabase.from("trips").select("id,preferred_dates").eq("slug", tripSlug).in("status", ["gathering", "confirmed"]).single();
  if (!trip) return NextResponse.json({ error: "This journey is not available for reservation." }, { status: 400 });
  const { data: takenReservations } = await supabase
    .from("reservations")
    .select("seats,status,customer_id,held_until")
    .eq("trip_id", trip.id);
  const occupied = (takenReservations ?? []).reduce((sum, reservation) => {
    if (["deposit_paid", "confirmed", "fully_paid"].includes(reservation.status)) return sum + reservation.seats;
    if (["held", "awaiting_payment", "payment_review"].includes(reservation.status) && new Date(reservation.held_until).getTime() > Date.now()) return sum + reservation.seats;
    return sum;
  }, 0);
  const { data: tripCapacity } = await supabase.from("trips").select("max_capacity").eq("id", trip.id).single();
  if (tripCapacity && occupied + seats > tripCapacity.max_capacity) {
    return NextResponse.json({ error: "Not enough seats available." }, { status: 400 });
  }
  const activeUserSeats = (takenReservations ?? []).reduce((sum, reservation) => {
    if (reservation.customer_id !== user.id) return sum;
    if (["held", "awaiting_payment", "payment_review"].includes(reservation.status) && new Date(reservation.held_until).getTime() > Date.now()) return sum + reservation.seats;
    return sum;
  }, 0);
  if (activeUserSeats >= 10) return NextResponse.json({ error: "You already have the maximum number of active holds." }, { status: 400 });
  const invalidDates = preferredDates.filter((date) => !trip.preferred_dates.includes(date));
  if (invalidDates.length) return NextResponse.json({ error: "Choose a date offered for this trip." }, { status: 400 });
  const { data, error } = await supabase.rpc("create_reservation", {
    p_trip_id: trip.id,
    p_seats: seats,
    p_preferred_dates: preferredDates,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ reservation: data });
}
