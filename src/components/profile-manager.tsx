"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function ProfileManager({ name, phone }: { name: string; phone: string }) {
  const router=useRouter();
  const [message,setMessage]=useState("");
  const [busy,setBusy]=useState(false);
  async function submit(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault();setBusy(true);setMessage("");
    const form=new FormData(event.currentTarget);
    const response=await fetch("/api/account/profile",{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({display_name:form.get("name"),phone:form.get("phone")})});
    const result=await response.json();
    setMessage(response.ok?"Profile saved.":result.error);
    setBusy(false);
  }
  async function signOutAll() {
    await createSupabaseBrowserClient().auth.signOut({ scope:"global" });
    router.push("/account");
  }
  return <div className="panel"><p className="eyebrow">Profile</p><form className="search-form" onSubmit={submit}><label><span>Name</span><input name="name" defaultValue={name} /></label><label><span>Phone</span><input name="phone" defaultValue={phone} placeholder="+20..." /></label><button className="button button-dark" disabled={busy} type="submit">{busy?"Saving…":"Save profile"}</button>{message&&<p className="muted" role="status">{message}</p>}</form><button className="button button-ghost" type="button" onClick={signOutAll}>Sign out of all devices</button></div>;
}
