"use client";

import { useState } from "react";

export function PaymentProofForm({ reservationId }: { reservationId: string }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const formData = new FormData(event.currentTarget);
    formData.set("reservationId", reservationId);
    try {
      const response = await fetch("/api/payments/proof", { method: "POST", body: formData });
      const result = await response.json();
      setMessage(response.ok ? "Proof submitted for staff review. It does not confirm payment yet." : result.error);
    } catch {
      setMessage("We could not submit the proof. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return <form className="panel proof-form" onSubmit={submit}><p className="eyebrow">Payment review</p><h3>Submit your deposit proof</h3><label><span>Amount</span><input name="amount" type="number" min="1" step="0.01" required /></label><label><span>Method</span><select name="method" defaultValue="instapay"><option value="instapay">InstaPay</option><option value="bank_transfer">Bank transfer</option></select></label><label><span>Proof file</span><input name="proof" type="file" accept=".jpg,.jpeg,.png,.pdf" required /></label><button className="button button-dark" disabled={busy} type="submit">{busy ? "Uploading securely…" : "Submit for review ↗"}</button>{message && <p className="muted" role="status">{message}</p>}</form>;
}
