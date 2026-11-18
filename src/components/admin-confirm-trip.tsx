"use client";

import { useState } from "react";

export function AdminConfirmTrip({tripId,minSeats,paidSeats}:{tripId:string;minSeats:number;paidSeats:number}) {
  const [date,setDate]=useState("");
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");
  async function confirm() {
    if(!date) { setMessage("Choose a confirmed travel date."); return; }
    setBusy(true);setMessage("");
    const response=await fetch(`/api/admin/trips/${tripId}/confirm`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({departureDate:date})});
    const result=await response.json();
    setMessage(response.ok?"Trip confirmed and departures updated.":result.error);
    setBusy(false);
  }
  return <div className="confirm-trip-control"><strong>{paidSeats}/{minSeats} paid seats</strong>{paidSeats>=minSeats?<><input type="date" value={date} onChange={(event)=>setDate(event.target.value)} aria-label="Confirmed departure date" /><button className="button button-accent" disabled={busy} type="button" onClick={confirm}>{busy?"Confirming…":"Confirm trip"}</button></>:<span className="muted">Waiting for minimum</span>}<p role="status">{message}</p></div>;
}
