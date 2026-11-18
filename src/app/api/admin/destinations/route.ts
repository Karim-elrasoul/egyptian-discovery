import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request:Request) {
  const body=await request.json().catch(()=>null) as Record<string,string>|null;
  if(!body?.name_en||!body.name_ar) return NextResponse.json({error:"English and Arabic names are required."},{status:400});
  const supabase=await createSupabaseServerClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return NextResponse.json({error:"Authentication required."},{status:401});
  const {data:profile}=await supabase.from("profiles").select("role").eq("id",user.id).single();
  if(!profile||!["admin","main_admin"].includes(profile.role)) return NextResponse.json({error:"Admin access required."},{status:403});
  const slug=body.name_en.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  const {data,error}=await supabase.from("destinations").insert({slug,name_en:body.name_en,name_ar:body.name_ar,region_en:body.region_en||null,region_ar:body.region_ar||null,description_en:body.description_en||null,description_ar:body.description_ar||null,status:"draft"}).select("id,name_en,status").single();
  if(error) return NextResponse.json({error:error.message},{status:400});
  await supabase.from("admin_audit_log").insert({actor_id:user.id,action:"destination.created",entity:"destination",entity_id:data.id,details:{name:body.name_en}});
  return NextResponse.json({destination:data});
}
