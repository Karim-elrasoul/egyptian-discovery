import { SiteHeader } from "@/components/site-header";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const instant = false;

export default async function AdminDestinationsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  let isAdmin = false;
  let destinations: Array<{ id: string; name_en: string; name_ar: string; status: string }> = [];
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    isAdmin = !!profile && ["admin", "main_admin"].includes(profile.role);
    if (isAdmin) {
      const { data } = await supabase.from("destinations").select("id,name_en,name_ar,status").order("sort_order");
      destinations = data ?? [];
    }
  }
  return <main className="admin-shell"><SiteHeader /><div className="page-shell section-shell"><section className="page-hero"><p className="eyebrow light">Destination operations</p><h1>{isAdmin ? "Destinations" : "Authorized staff only"}</h1></section>{isAdmin && <table className="admin-table"><thead><tr><th>English</th><th>Arabic</th><th>Status</th></tr></thead><tbody>{destinations.map((item) => <tr key={item.id}><td>{item.name_en}</td><td>{item.name_ar}</td><td>{item.status}</td></tr>)}</tbody></table>}</div></main>;
}
