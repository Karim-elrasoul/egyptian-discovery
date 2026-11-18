"use client";

import { useState } from "react";

export function AdminSettingsManager({ settings }: { settings: Array<{ key: string; value: unknown }> }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/settings", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.fromEntries(form.entries())) });
    const result = await response.json();
    setMessage(response.ok ? "Settings saved. Changes are live." : result.error);
    setBusy(false);
  }
  const editable = settings.filter((item) => ["instapay_handle","bank_name","bank_account_name","bank_iban","whatsapp_contact_number","reservation_hold_hours","remaining_balance_hours","priority_period_hours","cancellation_policy_en","cancellation_policy_ar"].includes(item.key));
  return <form className="panel admin-trip-form" onSubmit={submit}><p className="eyebrow">Editable business settings</p><div className="admin-form-grid">{editable.map((item) => <label key={item.key}><span>{item.key.replaceAll("_"," ")}</span><input name={item.key} defaultValue={String(item.value ?? "")} /></label>)}</div><button className="button button-accent" disabled={busy} type="submit">{busy ? "Saving…" : "Save settings"}</button>{message && <p className="muted" role="status">{message}</p>}</form>;
}
