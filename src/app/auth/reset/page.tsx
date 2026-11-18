"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function reset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password"));
    const confirm = String(form.get("confirm"));
    if (password !== confirm) {
      setMessage("Passwords do not match.");
      setBusy(false);
      return;
    }
    if (password.length < 8) {
      setMessage("Use at least 8 characters.");
      setBusy(false);
      return;
    }
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({ password });
    setMessage(error ? error.message : "Password updated. Sign in with your new password.");
    setBusy(false);
  }

  return (
    <main className="page-shell section-shell">
      <section className="page-hero"><p className="eyebrow">Administrator security</p><h1>Choose a new password.</h1></section>
      <form className="panel auth-reset-form" onSubmit={reset}>
        <label><span>New password</span><input name="password" type="password" minLength={8} required /></label>
        <label><span>Confirm password</span><input name="confirm" type="password" minLength={8} required /></label>
        <button className="button button-dark" disabled={busy} type="submit">{busy ? "Updating…" : "Update password"}</button>
        {message && <p className="muted" role="status">{message}</p>}
      </form>
    </main>
  );
}
