import { SiteHeader } from "@/components/site-header";
import Link from "next/link";
import { getTrips, unsplashUrl } from "@/lib/supabase/data";

export const instant = false;

export default async function TripsPage({ searchParams }: { searchParams: Promise<{ destination?: string }> }) {
  const params = await searchParams;
  const trips = await getTrips();
  const destination = params.destination?.trim().toLowerCase();
  const filtered = destination ? trips.filter((trip) => `${trip.name_en} ${trip.name_ar} ${trip.slug}`.toLowerCase().includes(destination)) : trips;
  return <main><SiteHeader /><div className="page-shell section-shell"><section className="page-hero"><p className="eyebrow">The calendar</p><h1>Journeys worth making time for.</h1><p className="muted">Every departure has a clear price, deposit, capacity, and booking deadline. No mystery, no rush.</p></section>{destination && <p className="muted">Results for “{params.destination}”</p>}<div className="trip-grid-page">{filtered.map((trip) => <article className="trip-card" key={trip.id}><Link href={`/trips/${trip.slug}`} className="trip-photo" style={{ backgroundImage: `url(${unsplashUrl(trip.hero_image)})` }}><span className="availability">{trip.status.replaceAll("_", " ")}</span></Link><div className="trip-content"><p className="eyebrow">{trip.duration_days} days</p><h3>{trip.name_en}</h3><p>{Number(trip.price_per_person).toLocaleString("en-EG")} {trip.currency} · {trip.deposit_percent}% deposit</p><div className="trip-price"><strong>{trip.max_capacity} seats</strong><Link href={`/trips/${trip.slug}`}>View trip</Link></div></div></article>)}</div>{filtered.length === 0 && <div className="panel"><h3>No journeys match that search</h3><p className="muted">Try a destination or browse all current departures.</p></div>}</div></main>;
}
