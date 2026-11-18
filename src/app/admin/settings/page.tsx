import { SiteHeader } from "@/components/site-header";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminSettingsManager } from "@/components/admin-settings-manager";

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
  return <main className="admin-shell"><SiteHeader /><div className="page-shell section-shell"><section className="page-hero"><p className="eyebrow light">Main admin settings</p><h1>{isAdmin ? "Business settings" : "Main admin access required"}</h1></section>{isAdmin && <AdminSettingsManager settings={settings} />}</div></main>;
}
