"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AdminProductManager() {
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");
  async function submit(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault();setBusy(true);setMessage("");
    const form=new FormData(event.currentTarget);
    let images:string[]=[];
    const file=form.get("photo") as File|null;
    if(file&&file.size>0) {
      const supabase=createSupabaseBrowserClient();
      const path=`products/${crypto.randomUUID()}-${file.name}`;
      const uploaded=await supabase.storage.from("trip-media").upload(path,file,{contentType:file.type,upsert:false});
      if(uploaded.error){setMessage(uploaded.error.message);setBusy(false);return;}
      images=[supabase.storage.from("trip-media").getPublicUrl(path).data.publicUrl];
    }
    const body={name_en:form.get("name_en"),name_ar:form.get("name_ar"),description_en:form.get("description_en"),description_ar:form.get("description_ar"),price:Number(form.get("price")),stock_quantity:Number(form.get("stock_quantity")),status:form.get("status"),images};
    const response=await fetch("/api/admin/products",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)});
    const result=await response.json();
    setMessage(response.ok?`Created ${result.product.name_en}.`:result.error);
    if(response.ok) event.currentTarget.reset();
    setBusy(false);
  }
  return <form className="panel admin-trip-form" onSubmit={submit}><p className="eyebrow">Create product</p><div className="admin-form-grid"><label><span>Name in English</span><input name="name_en" required /></label><label><span>الاسم بالعربية</span><input name="name_ar" required /></label><label><span>Description in English</span><input name="description_en" /></label><label><span>الوصف بالعربية</span><input name="description_ar" /></label><label><span>Price (EGP)</span><input name="price" type="number" min="0" required /></label><label><span>Stock quantity</span><input name="stock_quantity" type="number" min="0" defaultValue="0" required /></label><label><span>Status</span><select name="status"><option value="draft">Draft</option><option value="published">Published</option></select></label><label><span>Product photo</span><input name="photo" type="file" accept="image/jpeg,image/png,image/webp" /></label></div><button className="button button-accent" disabled={busy} type="submit">{busy?"Creating…":"Create product"}</button>{message&&<p className="muted" role="status">{message}</p>}</form>;
}
