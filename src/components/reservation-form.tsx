"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ReservationForm({ tripSlug, tripId, preferredDates, status }: { tripSlug: string; tripId: string; preferredDates: string[]; status: string }) {
  const router = useRouter();
  const [seats, setSeats] = useState(1);
  const [selectedDate, setSelectedDate] = useState(preferredDates[0] ?? "");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tripSlug, seats, preferredDates: selectedDate ? [selectedDate] : [] }),
      });
      const result = await response.json();
      if (response.status === 401) {
        router.push(`/account?next=${encodeURIComponent(`/trips/${tripSlug}`)}`);
        return;
      }
      setMessage(response.ok ? "Your 12-hour seat hold is ready. Continue to payment review from your account." : result.error);
    } catch {
      setMessage("We could not start the hold. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function joinWaitlist() {
    if (!selectedDate) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tripId, seats, preferredDates: [selectedDate] }),
      });
      const result = await response.json();
      setMessage(response.ok ? "Added to the waitlist. This does not reserve a seat." : result.error);
    } catch {
      setMessage("Could not join the waitlist.");
    } finally {
      setBusy(false);
    }
  }

  return <div className="panel reservation-form"><p className="eyebrow">{status === "fully_booked" ? "Waitlist" : "Reserve a place"}</p><h3>{status === "fully_booked" ? "Join when seats open" : "Hold your seats for 12 hours"}</h3><p className="muted">{status === "fully_booked" ? "Joining the waitlist does not reserve a seat." : "A hold is temporary. Your place is only confirmed after staff approve your payment proof."}</p><label><span>Preferred date</span><select value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} required>{preferredDates.map((date) => <option value={date} key={date}>{date}</option>)}</select></label><label><span>Seats</span><input type="number" min={1} max={10} value={seats} onChange={(event) => setSeats(Number(event.target.value))} /></label>{status === "fully_booked" ? <button className="button button-dark" disabled={busy || !selectedDate} onClick={joinWaitlist} type="button">{busy ? "Joining…" : "Join waitlist"}</button> : <button className="button button-dark" disabled={busy || !selectedDate} onClick={submit} type="button">{busy ? "Starting hold…" : "Start secure hold ↗"}</button>}{message && <p className="muted" role="status">{message}</p>}</div>;
}
