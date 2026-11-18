import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request:Request) {
  const body=await request.json().catch(()=>null) as {destinationId?:string}|null;
  if(!body?.destinationId) return NextResponse.json({error:"Destination is required."},{status:400});
  const supabase=await createSupabaseServerClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return NextResponse.json({error:"Sign in required."},{status:401});
  const {error}=await supabase.from("saved_destinations").upsert({profile_id:user.id,destination_id:body.destinationId},{onConflict:"profile_id,destination_id"});
  if(error) return NextResponse.json({error:error.message},{status:400});
  return NextResponse.json({saved:true});
}

export async function DELETE(request:Request) {
  const body=await request.json().catch(()=>null) as {destinationId?:string}|null;
  if(!body?.destinationId) return NextResponse.json({error:"Destination is required."},{status:400});
  const supabase=await createSupabaseServerClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return NextResponse.json({error:"Sign in required."},{status:401});
  const {error}=await supabase.from("saved_destinations").delete().eq("profile_id",user.id).eq("destination_id",body.destinationId);
  if(error) return NextResponse.json({error:error.message},{status:400});
  return NextResponse.json({saved:false});
}
