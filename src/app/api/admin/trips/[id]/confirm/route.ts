import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request:Request,{params}:{params:Promise<{id:string}>}) {
  const body=await request.json().catch(()=>null) as {departureDate?:string}|null;
  if(!body?.departureDate) return NextResponse.json({error:"Departure date is required."},{status:400});
  const supabase=await createSupabaseServerClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return NextResponse.json({error:"Authentication required."},{status:401});
  const {data:profile}=await supabase.from("profiles").select("role").eq("id",user.id).single();
  if(!profile||!["admin","main_admin"].includes(profile.role)) return NextResponse.json({error:"Admin access required."},{status:403});
  const {id}=await params;
  const {error}=await supabase.rpc("confirm_trip",{p_trip_id:id,p_departure_date:body.departureDate});
  if(error) return NextResponse.json({error:error.message},{status:400});
  return NextResponse.json({confirmed:true});
}
