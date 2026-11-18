"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  async function signOut() {
    await createSupabaseBrowserClient().auth.signOut();
    router.refresh();
  }
  return <button className="button button-dark" type="button" onClick={signOut}>Sign out</button>;
}
