"use client";

import { useState } from "react";

export function ReservationForm({ tripSlug }: { tripSlug: string }) {
  const [seats, setSeats] = useState(1);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tripSlug, seats }),
      });
      const result = await response.json();
      setMessage(response.ok ? "Your 12-hour seat hold is ready. Continue to payment review from your account." : result.error);
    } catch {
      setMessage("We could not start the hold. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return <div className="panel reservation-form"><p className="eyebrow">Reserve a place</p><h3>Hold your seats for 12 hours</h3><p className="muted">A hold is temporary. Your place is only confirmed after staff approve your payment proof.</p><label><span>Seats</span><input type="number" min={1} max={12} value={seats} onChange={(event) => setSeats(Number(event.target.value))} /></label><button className="button button-dark" disabled={busy} onClick={submit} type="button">{busy ? "Starting hold…" : "Start secure hold ↗"}</button>{message && <p className="muted" role="status">{message}</p>}</div>;
}
