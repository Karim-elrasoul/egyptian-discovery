import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { getDestinations, getTrips, unsplashUrl } from "@/lib/supabase/data";

export const instant = false;

export default async function Home() {
  const [destinations, trips] = await Promise.all([getDestinations(), getTrips()]);
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
            <span>Check in</span>
            <input name="checkin" type="date" />
          </label>
          <label className="search-field">
            <span>Check out</span>
            <input name="checkout" type="date" />
          </label>
          <label className="search-field">
            <span>Travelers</span>
            <select name="guests" defaultValue="2"><option value="1">1 traveler</option><option value="2">2 travelers</option><option value="3">3 travelers</option><option value="4">4 travelers</option><option value="5">5+ travelers</option></select>
          </label>
          <button className="search-button" type="submit" aria-label="Search trips">Search</button>
        </form>
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
                <Link href={`/trips/${trip.slug}`} className="trip-photo" style={{ backgroundImage: `url(${unsplashUrl(trip.hero_image)})` }}>
                  <span className="favorite">♡</span><span className="availability">{trip.status === "gathering" ? "Now gathering" : trip.status}</span>
                </Link>
                <div className="trip-content">
                  <div className="trip-meta"><span>{trip.duration_days} days</span><strong>★ 4.9</strong></div>
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
          <div className="promo-content"><p className="section-kicker light">Seasonal escape</p><h2>Meet the Nile at golden hour.</h2><p>Save 15% on selected departures through the end of November.</p><Link href="/trips" className="promo-button">Explore the offer <span>→</span></Link></div>
        </div>
      </section>

      <section className="home-section section-shell reviews-section">
        <div className="section-heading"><div><p className="section-kicker">Traveler stories</p><h2>Loved by people who wander</h2></div><div className="review-score"><strong>4.9</strong><span>★ ★ ★ ★ ★<small>From 380+ verified reviews</small></span></div></div>
        <div className="review-grid">
          {[
            ["Mariam Hassan", "Cairo", "Every detail felt considered. We saw a different side of Egypt and never felt rushed."],
            ["Daniel Reed", "London", "Beautiful hotels, warm local guides, and the perfect amount of free time."],
            ["Nour El-Sayed", "Dubai", "The Nile journey was calm, personal, and genuinely memorable."]
          ].map(([name, place, quote]) => <article className="review-card" key={name}><div className="review-stars">★★★★★</div><blockquote>“{quote}”</blockquote><div className="reviewer"><span>{name.slice(0,1)}</span><div><strong>{name}</strong><small>{place}</small></div></div></article>)}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-inner section-shell">
          <div className="footer-brand"><Image src="/egyptian-discovery-logo.png" alt="Egyptian Discovery" width={70} height={70} /><p>Unforgettable journeys across Egypt.</p></div>
          <div><h3>Discover</h3><Link href="/destinations">Destinations</Link><Link href="/trips">Journeys</Link><Link href="/stories">Travel stories</Link></div>
          <div><h3>Company</h3><Link href="/about">About us</Link><Link href="/contact">Contact</Link><Link href="/shop">Shop</Link></div>
          <div className="newsletter"><h3>Travel inspiration</h3><p>Monthly stories and first access to new journeys.</p><form><input type="email" aria-label="Email address" placeholder="Email address" /><button aria-label="Subscribe">→</button></form></div>
        </div>
        <div className="footer-bottom section-shell"><span>© 2026 Egyptian Discovery</span><div><Link href="#">Privacy</Link><Link href="#">Terms</Link><Link href="#">Instagram</Link></div></div>
      </footer>
    </main>
  );
}
