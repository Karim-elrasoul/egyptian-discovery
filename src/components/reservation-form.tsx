"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ReservationForm({ tripSlug, tripId, preferredDates, status }: { tripSlug: string; tripId: string; preferredDates: string[]; status: string }) {
  const router = useRouter();
  const [seats, setSeats] = useState(1);
  const [selectedDates, setSelectedDates] = useState<string[]>(preferredDates[0] ? [preferredDates[0]] : []);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tripSlug, seats, preferredDates: selectedDates }),
      });
      const result = await response.json();
      if (response.status === 401) {
        router.push(`/account?next=${encodeURIComponent(`/trips/${tripSlug}`)}`);
        return;
      }
      if (response.ok && result.reservation?.id) {
        router.push(`/account?reservation=${result.reservation.id}&payment=1`);
        return;
      }
      setMessage(result.error);
    } catch {
      setMessage("We could not start the hold. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function joinWaitlist() {
    if (!selectedDates.length) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tripId, seats, preferredDates: selectedDates }),
      });
      const result = await response.json();
      setMessage(response.ok ? "Added to the waitlist. This does not reserve a seat." : result.error);
    } catch {
      setMessage("Could not join the waitlist.");
    } finally {
      setBusy(false);
    }
  }

  function toggleDate(date:string) {
    setSelectedDates((current) => current.includes(date) ? current.filter((item) => item !== date) : current.length < 4 ? [...current,date] : current);
  }
  return <div className="panel reservation-form"><p className="eyebrow">{status === "fully_booked" ? "Waitlist" : "Reserve a place"}</p><h3>{status === "fully_booked" ? "Join when seats open" : "Hold your seats for 12 hours"}</h3><p className="muted">{status === "fully_booked" ? "Joining the waitlist does not reserve a seat." : "A hold is temporary. Your place is only confirmed after staff approve your payment proof."}</p><fieldset className="preferred-dates"><legend>Preferred dates — choose up to 4</legend>{preferredDates.map((date) => <label key={date}><input type="checkbox" checked={selectedDates.includes(date)} onChange={() => toggleDate(date)} /><span>{date}</span></label>)}</fieldset><label><span>Seats</span><input type="number" min={1} max={10} value={seats} onChange={(event) => setSeats(Number(event.target.value))} /></label>{status === "fully_booked" ? <button className="button button-dark" disabled={busy || !selectedDates.length} onClick={joinWaitlist} type="button">{busy ? "Joining…" : "Join waitlist"}</button> : <button className="button button-dark" disabled={busy || !selectedDates.length} onClick={submit} type="button">{busy ? "Starting hold…" : "Start secure hold ↗"}</button>}{message && <p className="muted" role="status">{message}</p>}</div>;
}
