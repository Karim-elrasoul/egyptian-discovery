"use client";

import { useState } from "react";

export function OrderProofForm({ orderId }: { orderId: string }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    form.set("orderId", orderId);
    const response = await fetch("/api/orders/payment", { method: "POST", body: form });
    const result = await response.json();
    setMessage(response.ok ? "Payment proof submitted for review." : result.error);
    setBusy(false);
  }

  return <form className="panel proof-form" onSubmit={submit}><p className="eyebrow">Order payment</p><h3>Submit payment proof</h3><label><span>Method</span><select name="method" defaultValue="instapay"><option value="instapay">InstaPay</option><option value="bank_transfer">Bank transfer</option></select></label><label><span>Proof file</span><input name="proof" type="file" accept=".jpg,.jpeg,.png,.pdf" required /></label><button className="button button-dark" disabled={busy} type="submit">{busy ? "Uploading…" : "Submit for review"}</button>{message && <p className="muted" role="status">{message}</p>}</form>;
}
