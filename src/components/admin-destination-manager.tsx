"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AdminDestinationManager() {
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");
  async function submit(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault();setBusy(true);setMessage("");
    const form=new FormData(event.currentTarget);
    let heroImage="";
    const file=form.get("photo") as File|null;
    if(file&&file.size>0) {
      const supabase=createSupabaseBrowserClient();
      const path=`${crypto.randomUUID()}-${file.name}`;
      const uploaded=await supabase.storage.from("destination-media").upload(path,file,{contentType:file.type,upsert:false});
      if(uploaded.error){setMessage(uploaded.error.message);setBusy(false);return;}
      heroImage=supabase.storage.from("destination-media").getPublicUrl(path).data.publicUrl;
    }
    const body={...Object.fromEntries(form.entries()),hero_image:heroImage};
    const response=await fetch("/api/admin/destinations",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)});
    const result=await response.json();
    setMessage(response.ok?`Created ${result.destination.name_en}.`:result.error);
    if(response.ok) event.currentTarget.reset();
    setBusy(false);
  }
  return <form className="panel admin-trip-form" onSubmit={submit}><p className="eyebrow">Create destination</p><div className="admin-form-grid"><label><span>Name in English</span><input name="name_en" required /></label><label><span>الاسم بالعربية</span><input name="name_ar" required /></label><label><span>Region in English</span><input name="region_en" /></label><label><span>Region in Arabic</span><input name="region_ar" /></label><label><span>Description in English</span><input name="description_en" /></label><label><span>الوصف بالعربية</span><input name="description_ar" /></label><label><span>Main photo</span><input name="photo" type="file" accept="image/jpeg,image/png,image/webp" /></label></div><button className="button button-accent" disabled={busy} type="submit">{busy?"Creating…":"Create destination"}</button>{message&&<p className="muted" role="status">{message}</p>}</form>;
}
