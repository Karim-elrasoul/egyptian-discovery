"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AuthPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOpen, setForgotOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  async function forgotPassword() {
    setBusy(true);
    setMessage("");
    if (!forgotEmail.trim()) {
      setMessage("Enter your email address.");
      setBusy(false);
      return;
    }
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    });
    setMessage(error ? error.message : "If the email is registered, a password-reset link has been sent.");
    setBusy(false);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    const phone = String(form.get("phone") || "").trim();
    const name = String(form.get("name") || "").trim();
    if (mode === "signup" && (!phone || !name)) {
      setMessage("Full name and phone number are required.");
      setBusy(false);
      return;
    }
    if (mode === "signup" && password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setBusy(false);
      return;
    }
    if (!/^(?:\+20|0)?1[0-2,5]\d{8}$/.test(phone) && mode === "signup") {
      setMessage("Enter a valid Egyptian phone number.");
      setBusy(false);
      return;
    }
    const supabase = createSupabaseBrowserClient();

    const result = mode === "signin"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: { display_name: name, phone },
          },
        });

    if (result.error) {
      setMessage(result.error.message);
    } else if (mode === "signup") {
      setMessage("Account created. Check your email if confirmation is required.");
    } else {
      setMessage("Signed in securely.");
      router.push(next && next.startsWith("/") ? next : "/account");
      router.refresh();
    }
    setBusy(false);
  }

  return (
    <div className="panel auth-panel">
      <div className="auth-tabs">
        <button type="button" className={mode === "signin" ? "active" : ""} onClick={() => setMode("signin")}>Sign in</button>
        <button type="button" className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>Create account</button>
      </div>
      <button className="forgot-password" type="button" onClick={() => setForgotOpen(!forgotOpen)} disabled={busy}>Forgot password?</button>
      {forgotOpen && <><label className="forgot-email"><span>Email for reset</span><input type="email" value={forgotEmail} onChange={(event) => setForgotEmail(event.target.value)} placeholder="you@example.com" /></label><button className="button button-dark" type="button" onClick={forgotPassword} disabled={busy}>Send reset email</button></>}
      <form className="search-form" onSubmit={submit}>
        {mode === "signup" && <><label><span>Full name</span><input name="name" required autoComplete="name" /></label><label><span>Phone</span><input name="phone" type="tel" required autoComplete="tel" placeholder="+20..." /></label></>}
        <label><span>Email</span><input name="email" type="email" required autoComplete="email" /></label>
        <label><span>Password</span><div className="password-field"><input name="password" type={showPassword ? "text" : "password"} required minLength={8} autoComplete={mode === "signin" ? "current-password" : "new-password"} /><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide" : "Show"}</button></div></label>
        {mode === "signup" && <label><span>Confirm password</span><input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required minLength={8} autoComplete="new-password" /></label>}
        <button className="button button-dark" disabled={busy} type="submit">{busy ? "Please wait…" : mode === "signin" ? "Continue securely" : "Create account"} <span>→</span></button>
      </form>
      {message && <p className="muted" role="status">{message}</p>}
    </div>
  );
}
