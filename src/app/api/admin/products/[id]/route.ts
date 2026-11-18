import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function DELETE(_request:Request,{params}:{params:Promise<{id:string}>}) {
  const supabase=await createSupabaseServerClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return NextResponse.json({error:"Authentication required."},{status:401});
  const {data:profile}=await supabase.from("profiles").select("role").eq("id",user.id).single();
  if(!profile||!["admin","main_admin"].includes(profile.role)) return NextResponse.json({error:"Admin access required."},{status:403});
  const {id}=await params;
  const {count}=await supabase.from("order_items").select("id",{count:"exact",head:true}).eq("product_id",id);
  if((count??0)>0) return NextResponse.json({error:"This product has orders and cannot be deleted."},{status:400});
  const {error}=await supabase.from("products").delete().eq("id",id);
  if(error) return NextResponse.json({error:error.message},{status:400});
  await supabase.from("admin_audit_log").insert({actor_id:user.id,action:"product.deleted",entity:"product",entity_id:id,details:{}});
  return NextResponse.json({deleted:true});
}
