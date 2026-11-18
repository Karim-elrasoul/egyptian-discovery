import { SiteHeader } from "@/components/site-header";
import { getDestinations, unsplashUrl } from "@/lib/supabase/data";

export const instant = false;

export default async function DestinationsPage() {
  const destinations = await getDestinations();
  return <main><SiteHeader /><div className="page-shell section-shell"><section className="page-hero"><p className="eyebrow">The map is only the beginning</p><h1>Places with a pulse.</h1><p className="muted">Explore the landscapes, neighborhoods, and quiet corners that shape our journeys.</p></section><div className="simple-grid">{destinations.map((destination) => <article className="panel" key={destination.id}><div className="trip-image" style={{ backgroundImage: `url(${unsplashUrl(destination.hero_image)})`, margin: "-2rem -2rem 1.5rem" }} /><p className="eyebrow">{destination.region_en}</p><h3>{destination.name_en}</h3><p className="muted">{destination.description_en}</p></article>)}</div></div></main>;
}
