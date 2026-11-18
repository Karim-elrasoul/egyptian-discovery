import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { getDestinations, getTrips, getProducts, unsplashUrl } from "@/lib/supabase/data";
import { FavoriteButton } from "@/components/favorite-button";

export const instant = false;

export default async function Home() {
  const [destinations, trips, products] = await Promise.all([getDestinations(), getTrips(), getProducts()]);
  return (
    <main>
      <SiteHeader />
      <section className="hero">
        <div className="hero-shade" />
        <div className="hero-inner">
          <p className="hero-kicker">Discover Egypt differently</p>
          <h1>Your next great story starts here.</h1>
          <p className="hero-copy">Thoughtful escapes, unforgettable places, and local experiences made for curious travelers.</p>
        </div>
        <form className="booking-search" action="/trips">
          <label className="search-field">
            <span>Where</span>
            <input name="destination" placeholder="Destination or landmark" />
          </label>
          <label className="search-field">
            <span>Travelers</span>
            <select name="guests" defaultValue="2"><option value="1">1 traveler</option><option value="2">2 travelers</option><option value="3">3 travelers</option><option value="4">4 travelers</option><option value="5">5+ travelers</option></select>
          </label>
          <button className="search-button" type="submit" aria-label="Search trips">Search</button>
        </form>
      </section>

      <section className="home-section section-shell">
        <div className="section-heading"><div><p className="section-kicker">Made for the journey</p><h2>From the Egyptian Discovery shop</h2></div><Link href="/shop" className="view-link">Visit the shop <span>→</span></Link></div>
        <div className="trip-grid">{products.slice(0,3).map((product) => <article className="trip-card" key={product.id}><Link href="/shop" className="trip-photo" style={{ backgroundImage:`url(${unsplashUrl(product.images?.[0]||null,900)})` }} /><div className="trip-content"><h3>{product.name_en}</h3><p>{product.description_en}</p><div className="trip-price"><strong>{Number(product.price).toLocaleString("en-EG")} EGP</strong><Link href="/shop">View product</Link></div></div></article>)}</div>
      </section>

      <section className="home-section section-shell">
        <div className="section-heading">
          <div><p className="section-kicker">Made for the curious</p><h2>Explore iconic destinations</h2></div>
          <Link href="/destinations" className="view-link">View all destinations <span>→</span></Link>
        </div>
        <div className="destination-grid">
          {destinations.map((destination, index) => (
            <Link href="/destinations" className={`destination-card destination-card-${index + 1}`} key={destination.id}>
              <span className="destination-photo" style={{ backgroundImage: `url(${unsplashUrl(destination.hero_image)})` }} />
              <span className="destination-content"><small>{destination.region_en}</small><strong>{destination.name_en}</strong><em>Explore destination</em></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section home-section-tint">
        <div className="section-shell">
          <div className="section-heading">
            <div><p className="section-kicker">Handpicked experiences</p><h2>Popular journeys</h2></div>
            <Link href="/trips" className="view-link">Explore all trips <span>→</span></Link>
          </div>
          <div className="trip-grid">
            {trips.map((trip) => (
              <article className="trip-card" key={trip.id}>
                <div className="trip-photo" style={{ backgroundImage: `url(${unsplashUrl(trip.hero_image)})` }}>
                  <Link href={`/trips/${trip.slug}`} className="trip-photo-link" aria-label={`View ${trip.name_en}`} />
                  <span className="availability">{trip.status === "gathering" ? "Now gathering" : trip.status}</span>
                  <FavoriteButton tripId={trip.id} />
                </div>
                <div className="trip-content">
                  <div className="trip-meta"><span>{trip.duration_days} days</span><strong>{trip.max_capacity} seats</strong></div>
                  <h3>{trip.name_en}</h3>
                  <p>{trip.preferred_dates?.length ? `${trip.preferred_dates.length} preferred departures` : "Flexible departure"} · {trip.deposit_percent}% deposit</p>
                  <div className="trip-price"><span>From</span><strong>{Number(trip.price_per_person).toLocaleString("en-EG")} EGP</strong><Link href={`/trips/${trip.slug}`}>View trip</Link></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section section-shell">
        <div className="section-heading centered-heading"><div><p className="section-kicker">Travel with confidence</p><h2>Why choose Egyptian Discovery</h2></div></div>
        <div className="benefit-grid">
          <article><span className="benefit-icon">◎</span><h3>Local expertise</h3><p>Designed by people who know Egypt beyond the guidebook.</p></article>
          <article><span className="benefit-icon">◇</span><h3>Secure booking</h3><p>Clear prices, protected reservations, and verified payment review.</p></article>
          <article><span className="benefit-icon">♢</span><h3>Flexible support</h3><p>Friendly help before, during, and after every journey.</p></article>
          <article><span className="benefit-icon">✦</span><h3>Small groups</h3><p>More connection, more discovery, and room to travel slowly.</p></article>
        </div>
      </section>

      <section className="promo-section section-shell">
        <div className="promo-card">
          <div className="promo-content"><p className="section-kicker light">A journey worth considering</p><h2>Meet Egypt at golden hour.</h2><p>Compare current departures, preferred dates, deposits, and group requirements in one place.</p><Link href="/trips" className="promo-button">Explore journeys <span>→</span></Link></div>
        </div>
      </section>

      <section className="home-section section-shell reviews-section">
        <div className="section-heading"><div><p className="section-kicker">Traveler stories</p><h2>Review from the road</h2></div></div>
        <div className="review-card"><p className="muted">Verified traveler reviews will appear here after customers submit and staff approve them.</p><Link href="/contact" className="view-link">Share feedback <span>→</span></Link></div>
      </section>

    </main>
  );
}
