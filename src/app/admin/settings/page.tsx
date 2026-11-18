import { SiteHeader } from "@/components/site-header";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const instant = false;

export default async function AdminSettingsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  let isAdmin = false;
  let settings: Array<{ key: string; value: unknown }> = [];
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    isAdmin = !!profile && ["main_admin"].includes(profile.role);
    if (isAdmin) {
      const { data } = await supabase.from("business_settings").select("key,value").order("key");
      settings = data ?? [];
    }
  }
  return <main className="admin-shell"><SiteHeader /><div className="page-shell section-shell"><section className="page-hero"><p className="eyebrow light">Main admin settings</p><h1>{isAdmin ? "Business settings" : "Main admin access required"}</h1></section>{isAdmin && <table className="admin-table"><thead><tr><th>Setting</th><th>Value</th></tr></thead><tbody>{settings.map((item) => <tr key={item.key}><td>{item.key}</td><td>{String(item.value ?? "")}</td></tr>)}</tbody></table>}</div></main>;
}
