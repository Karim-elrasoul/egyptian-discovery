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
  const { data: reservations } = await supabase.from("reservations").select("seats,status").eq("trip_id", trip.id);
  const bookedSeats=(reservations??[]).reduce((sum,reservation)=>["deposit_paid","confirmed","fully_paid"].includes(reservation.status)?sum+reservation.seats:sum,0);
  const progress=Math.min(100,Math.round((bookedSeats/trip.min_travelers)*100));
  const {data:products}=await supabase.from("products").select("id,slug,name_en,price,currency,images").eq("status","published").eq("availability",true).limit(3);

  const itinerary = Array.isArray(trip.itinerary_en) ? trip.itinerary_en : [];
  const included = Array.isArray(trip.included_en) ? trip.included_en : [];
  const excluded = Array.isArray(trip.excluded_en) ? trip.excluded_en : [];
  const requirements = Array.isArray(trip.requirements_en) ? trip.requirements_en : [];
  const bring = Array.isArray(trip.bring_en) ? trip.bring_en : [];
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
              <div className="trip-facts">
                <div><p className="eyebrow">Departure</p><p className="muted">{trip.departure_date || "Date selection required"}</p></div>
                <div><p className="eyebrow">Minimum group</p><p className="muted">{trip.min_travelers} travelers</p></div>
                <div><p className="eyebrow">Capacity</p><p className="muted">{trip.max_capacity} seats</p></div>
                <div><p className="eyebrow">Booking deadline</p><p className="muted">{trip.booking_deadline ? new Date(trip.booking_deadline).toLocaleString() : "No deadline set"}</p></div>
              </div>
              <div className="trip-progress"><div><p className="eyebrow">Trip progress</p><strong>{bookedSeats} of {trip.min_travelers} minimum seats booked</strong></div><div className="progress-track"><span style={{width:`${progress}%`}} /></div><p className="muted">{Math.max(0,trip.max_capacity-bookedSeats)} seats remaining</p></div>
              {products&&products.length>0&&<div className="trip-gadgets"><p className="eyebrow">Useful for this trip</p><div className="trip-grid">{products.map((product)=><a className="panel" href={`/shop/${product.slug}`} key={product.id}><h3>{product.name_en}</h3><p className="muted">{Number(product.price).toLocaleString("en-EG")} {product.currency}</p></a>)}</div></div>}
              {trip.accommodation_en && <><p className="eyebrow">Accommodation</p><p className="muted">{trip.accommodation_en}</p></>}
              {trip.transport_en && <><p className="eyebrow">Transport</p><p className="muted">{trip.transport_en}</p></>}
              {included.length > 0 && <><p className="eyebrow">Included</p><ul>{included.map((item: string) => <li key={item}>{item}</li>)}</ul></>}
              {excluded.length > 0 && <><p className="eyebrow">Excluded</p><ul>{excluded.map((item: string) => <li key={item}>{item}</li>)}</ul></>}
              {requirements.length > 0 && <><p className="eyebrow">Requirements</p><ul>{requirements.map((item: string) => <li key={item}>{item}</li>)}</ul></>}
              {bring.length > 0 && <><p className="eyebrow">What to bring</p><ul>{bring.map((item: string) => <li key={item}>{item}</li>)}</ul></>}
              {trip.cancellation_policy_en && <><p className="eyebrow">Cancellation policy</p><p className="muted">{trip.cancellation_policy_en}</p></>}
            </div>
          </div>
          <ReservationForm tripSlug={slug} tripId={trip.id} preferredDates={trip.preferred_dates ?? []} status={trip.status} />
        </div>
      </div>
    </main>
  );
}
