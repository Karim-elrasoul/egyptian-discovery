"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AuthPanel() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    const supabase = createSupabaseBrowserClient();

    const result = mode === "signin"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/account`,
            data: { display_name: String(form.get("name") || "") },
          },
        });

    if (result.error) {
      setMessage(result.error.message);
    } else if (mode === "signup") {
      setMessage("Account created. Check your email if confirmation is required.");
    } else {
      router.refresh();
      setMessage("Signed in securely.");
    }
    setBusy(false);
  }

  return (
    <div className="panel auth-panel">
      <div className="auth-tabs">
        <button type="button" className={mode === "signin" ? "active" : ""} onClick={() => setMode("signin")}>Sign in</button>
        <button type="button" className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>Create account</button>
      </div>
      <form className="search-form" onSubmit={submit}>
        {mode === "signup" && <label><span>Full name</span><input name="name" required autoComplete="name" /></label>}
        <label><span>Email</span><input name="email" type="email" required autoComplete="email" /></label>
        <label><span>Password</span><input name="password" type="password" required minLength={8} autoComplete={mode === "signin" ? "current-password" : "new-password"} /></label>
        <button className="button button-dark" disabled={busy} type="submit">{busy ? "Please wait…" : mode === "signin" ? "Continue securely" : "Create account"} <span>→</span></button>
      </form>
      {message && <p className="muted" role="status">{message}</p>}
    </div>
  );
}
