"use client";

import { useState } from "react";

export function AdminPaymentReview({ paymentId }: { paymentId: string }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function review(decision: "approved" | "rejected") {
    setBusy(true);
    const response = await fetch(`/api/admin/payments/${paymentId}/review`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ decision }) });
    const result = await response.json();
    setMessage(response.ok ? `Payment ${result.status}.` : result.error);
    setBusy(false);
  }
  return <div className="admin-actions"><button className="button button-accent" disabled={busy} onClick={() => review("approved")} type="button">Approve</button><button className="button button-ghost" disabled={busy} onClick={() => review("rejected")} type="button">Reject</button>{message && <span className="admin-feedback">{message}</span>}</div>;
}
