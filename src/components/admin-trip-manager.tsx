"use client";

import { useState } from "react";

export function AdminTripManager({ destinations }: { destinations: Array<{ id: string; name_en: string }> }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const preferredDates = String(form.get("dates") || "").split(",").map((date) => date.trim()).filter(Boolean);
    const body = {
      name_en: form.get("name_en"), name_ar: form.get("name_ar"), destination_id: form.get("destination_id"),
      trip_type: form.get("trip_type"), duration_days: Number(form.get("duration_days")),
      price_per_person: Number(form.get("price_per_person")), deposit_percent: Number(form.get("deposit_percent")),
      min_travelers: Number(form.get("min_travelers")), max_capacity: Number(form.get("max_capacity")),
      booking_deadline: form.get("booking_deadline"), preferred_dates: preferredDates, status: form.get("status"),
    };
    const response = await fetch("/api/admin/trips", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const result = await response.json();
    setMessage(response.ok ? `Created ${result.trip.name_en}.` : result.error);
    if (response.ok) event.currentTarget.reset();
    setBusy(false);
  }
  return <form className="panel admin-trip-form" onSubmit={submit}><p className="eyebrow">Create trip</p><div className="admin-form-grid"><label><span>Name in English</span><input name="name_en" required /></label><label><span>الاسم بالعربية</span><input name="name_ar" required /></label><label><span>Destination</span><select name="destination_id" required><option value="">Choose destination</option>{destinations.map((destination) => <option value={destination.id} key={destination.id}>{destination.name_en}</option>)}</select></label><label><span>Trip type</span><select name="trip_type"><option value="day">Day trip</option><option value="weekend">Weekend</option><option value="multi-day">Multi-day</option></select></label><label><span>Duration (days)</span><input name="duration_days" type="number" min="1" defaultValue="1" required /></label><label><span>Price per person (EGP)</span><input name="price_per_person" type="number" min="1" required /></label><label><span>Deposit (%)</span><input name="deposit_percent" type="number" min="0" max="100" defaultValue="10" required /></label><label><span>Minimum travelers</span><input name="min_travelers" type="number" min="1" defaultValue="10" required /></label><label><span>Maximum capacity</span><input name="max_capacity" type="number" min="1" defaultValue="20" required /></label><label><span>Booking deadline</span><input name="booking_deadline" type="datetime-local" /></label><label><span>Preferred dates</span><input name="dates" placeholder="2027-01-10, 2027-01-17" required /></label><label><span>Status</span><select name="status"><option value="draft">Draft</option><option value="gathering">Gathering</option></select></label></div><button className="button button-accent" disabled={busy} type="submit">{busy ? "Creating…" : "Create trip"}</button>{message && <p className="muted" role="status">{message}</p>}</form>;
}
