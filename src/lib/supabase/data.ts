import { createSupabaseServerClient } from "@/lib/supabase/server";

export function unsplashUrl(photo: string | null, width = 1200) {
  const id = photo?.startsWith("http") ? photo : `https://images.unsplash.com/${photo || "photo-1500530855697-b586d89ba3ee"}`;
  return `${id}?auto=format&fit=crop&w=${width}&q=85`;
}

export async function getDestinations() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("destinations").select("id,slug,name_en,name_ar,region_en,region_ar,description_en,description_ar,hero_image,status").eq("status", "published").order("sort_order");
  return data ?? [];
}

export async function getTrips() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("trips").select("id,slug,name_en,name_ar,trip_type,duration_days,price_per_person,currency,deposit_percent,min_travelers,max_capacity,status,preferred_dates,booking_deadline,hero_image,images,description_en,description_ar").in("status", ["gathering", "under_review", "confirmed", "fully_booked"]).order("created_at");
  return data ?? [];
}

export async function getProducts() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("products").select("id,slug,name_en,name_ar,description_en,description_ar,price,currency,images,stock_quantity,availability,status").eq("status", "published").order("sort_order");
  return data ?? [];
}

export async function getGovernorates() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("governorates").select("code,name_en").order("name_en");
  return data ?? [];
}
