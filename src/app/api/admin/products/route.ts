import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request:Request) {
  const body=await request.json().catch(()=>null) as Record<string,string|number>|null;
  if(!body?.name_en||!body.name_ar) return NextResponse.json({error:"English and Arabic names are required."},{status:400});
  const supabase=await createSupabaseServerClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return NextResponse.json({error:"Authentication required."},{status:401});
  const {data:profile}=await supabase.from("profiles").select("role").eq("id",user.id).single();
  if(!profile||!["admin","main_admin"].includes(profile.role)) return NextResponse.json({error:"Admin access required."},{status:403});
  const slug=String(body.name_en).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")+"-"+Date.now().toString().slice(-6);
  const {data,error}=await supabase.from("products").insert({slug,name_en:body.name_en,name_ar:body.name_ar,description_en:body.description_en||null,description_ar:body.description_ar||null,price:Number(body.price||0),currency:"EGP",stock_quantity:Number(body.stock_quantity||0),availability:Number(body.stock_quantity||0)>0,status:body.status||"draft",images:Array.isArray(body.images)?body.images:[]}).select("id,name_en,status").single();
  if(error) return NextResponse.json({error:error.message},{status:400});
  await supabase.from("admin_audit_log").insert({actor_id:user.id,action:"product.created",entity:"product",entity_id:data.id,details:{name:body.name_en}});
  return NextResponse.json({product:data});
}
