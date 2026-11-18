import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { ReservationForm } from "@/components/reservation-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { unsplashUrl } from "@/lib/supabase/data";

export const instant = false;

export default async function TripDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: trip } = await supabase.from("trips").select("*").eq("slug", slug).maybeSingle();
  if (!trip) notFound();

  const itinerary = Array.isArray(trip.itinerary_en) ? trip.itinerary_en : [];
  return (
    <main>
      <SiteHeader />
      <div className="page-shell section-shell">
        <section className="page-hero">
          <p className="eyebrow">{trip.trip_type} · {trip.duration_days} days</p>
          <h1>{trip.name_en}</h1>
          <p className="muted">{Number(trip.price_per_person).toLocaleString("en-EG")} {trip.currency} · {trip.deposit_percent}% deposit · {trip.max_capacity} seats</p>
        </section>
        <div className="detail-layout">
          <div>
            <div className="detail-image" style={{ backgroundImage: `url(${unsplashUrl(trip.hero_image)})` }} />
            <div className="panel detail-copy">
              <p className="eyebrow">The rhythm</p>
              <h3>A considered way through Egypt</h3>
              {trip.description_en && <p className="muted">{trip.description_en}</p>}
              {itinerary.length > 0 && itinerary.map((day: { day: number; title: string; desc: string }) => (
                <div key={day.day} className="itinerary-row"><strong>{day.day}</strong><div><h3>{day.title}</h3><p className="muted">{day.desc}</p></div></div>
              ))}
            </div>
          </div>
          <ReservationForm tripSlug={slug} />
        </div>
      </div>
    </main>
  );
}
