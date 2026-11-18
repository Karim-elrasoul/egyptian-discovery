"use client";

import { useState } from "react";

export function AdminDeleteButton({ kind,id,name }: { kind:"trips"|"destinations"|"products";id:string;name:string }) {
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");
  async function removeItem() {
    if(!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    setBusy(true);setMessage("");
    const response=await fetch(`/api/admin/${kind}/${id}`,{method:"DELETE"});
    const result=await response.json();
    setMessage(response.ok?"Deleted.":result.error);
    if(response.ok) window.location.reload();
  }
  return <><button className="admin-delete-button" disabled={busy} type="button" onClick={removeItem}>{busy?"Deleting…":"Delete"}</button>{message&&<span>{message}</span>}</>;
}
