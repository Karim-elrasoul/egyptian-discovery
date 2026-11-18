"use client";

import { useState } from "react";

export function PaymentProofForm({ reservationId, amountDue }: { reservationId: string; amountDue?: number }) {
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

  return <form className="panel proof-form" onSubmit={submit}><p className="eyebrow">Payment review</p><h3>Submit payment proof</h3><p className="muted">{amountDue ? `Amount due: ${Number(amountDue).toLocaleString("en-EG")} EGP` : "Check the exact amount from your reservation before paying."}</p><label><span>Amount</span><input name="amount" type="number" min="1" step="0.01" value={amountDue || undefined} readOnly={!!amountDue} required /></label><label><span>Method</span><select name="method" defaultValue="instapay"><option value="instapay">InstaPay</option><option value="bank_transfer">Bank transfer</option></select></label><label><span>Proof file</span><input name="proof" type="file" accept=".jpg,.jpeg,.png,.pdf" required /></label><button className="button button-dark" disabled={busy} type="submit">{busy ? "Uploading securely…" : "Submit for review ↗"}</button>{message && <p className="muted" role="status">{message}</p>}</form>;
}
