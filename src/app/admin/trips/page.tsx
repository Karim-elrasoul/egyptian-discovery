import { SiteHeader } from "@/components/site-header";
import { AdminTripManager } from "@/components/admin-trip-manager";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const instant = false;

export default async function AdminTripsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  let isAdmin = false;
  let trips: Array<{ id: string; name_en: string; status: string; max_capacity: number; preferred_dates: string[] }> = [];
  let destinations: Array<{ id: string; name_en: string }> = [];
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    isAdmin = !!profile && ["admin", "main_admin"].includes(profile.role);
    if (isAdmin) {
      const [tripResult, destinationResult] = await Promise.all([
        supabase.from("trips").select("id,name_en,status,max_capacity,preferred_dates").order("created_at", { ascending: false }),
        supabase.from("destinations").select("id,name_en").eq("status", "published").order("sort_order"),
      ]);
      trips = tripResult.data ?? [];
      destinations = destinationResult.data ?? [];
    }
  }
  return <main className="admin-shell"><SiteHeader /><div className="page-shell section-shell"><section className="page-hero"><p className="eyebrow light">Trip operations</p><h1>{isAdmin ? "Manage journeys" : "Authorized staff only"}</h1></section>{isAdmin && <><table className="admin-table"><thead><tr><th>Trip</th><th>Status</th><th>Capacity</th><th>Preferred dates</th></tr></thead><tbody>{trips.map((trip) => <tr key={trip.id}><td>{trip.name_en}</td><td>{trip.status.replaceAll("_", " ")}</td><td>{trip.max_capacity}</td><td>{trip.preferred_dates?.join(", ")}</td></tr>)}</tbody></table><AdminTripManager destinations={destinations} /></>}</div></main>;
}
