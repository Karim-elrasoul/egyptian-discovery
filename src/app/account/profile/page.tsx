import { SiteHeader } from "@/components/site-header";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProfileManager } from "@/components/profile-manager";

export const instant=false;

export default async function ProfilePage() {
  const supabase=await createSupabaseServerClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return <main><SiteHeader /><div className="page-shell section-shell"><div className="panel"><p className="eyebrow">Sign in required</p><h1>Profile</h1><p className="muted">Sign in to manage your account.</p><a className="button button-dark" href="/account">Sign in</a></div></div></main>;
  const {data:profile}=await supabase.from("profiles").select("display_name,phone").eq("id",user.id).single();
  return <main><SiteHeader /><div className="page-shell section-shell"><section className="page-hero"><p className="eyebrow">My account</p><h1>Profile and security</h1></section><ProfileManager name={profile?.display_name||""} phone={profile?.phone||""} /></div></main>;
}
