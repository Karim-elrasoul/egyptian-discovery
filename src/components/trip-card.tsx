import Link from "next/link";
import type { trips } from "@/lib/content";

type Trip = (typeof trips)[number];

export function TripCard({ trip }: { trip: Trip }) {
  return (
    <article className="trip-card">
      <div className="trip-image" style={{ backgroundImage: `url(${trip.image})` }}>
        <span className="pill">{trip.status}</span>
      </div>
      <div className="trip-card-body">
        <p className="eyebrow">{trip.location}</p>
        <h3>{trip.title}</h3>
        <p className="muted">{trip.duration} · {trip.date}</p>
        <div className="trip-card-footer">
          <div><strong>{trip.price}</strong><span>{trip.deposit}</span></div>
          <Link href={`/trips/${trip.title.toLowerCase().replaceAll(" ", "-")}`} className="text-link">View journey <span>↗</span></Link>
        </div>
      </div>
    </article>
  );
}
