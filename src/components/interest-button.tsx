"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function InterestButton({ destinationId }: { destinationId: string }) {
  const router=useRouter();
  const [saved,setSaved]=useState(false);
  const [busy,setBusy]=useState(false);
  async function toggle() {
    setBusy(true);
    const response=await fetch("/api/destination-interest",{method:saved?"DELETE":"POST",headers:{"content-type":"application/json"},body:JSON.stringify({destinationId})});
    if(response.status===401) { router.push("/account?next=%2Fdestinations"); return; }
    if(response.ok) setSaved(!saved);
    setBusy(false);
  }
  return <button className="button button-dark" type="button" disabled={busy} onClick={toggle}>{saved?"Interested":"I’m interested"}</button>;
}
