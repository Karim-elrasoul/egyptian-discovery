"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Locale = "en" | "ar";

export function SiteHeader() {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window === "undefined") return "en";
    const saved = window.localStorage.getItem("egyptian-discovery-language");
    return saved === "ar" ? "ar" : "en";
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const nav = locale === "ar"
    ? ["الوجهات", "الرحلات", "الحكايات", "المتجر"]
    : ["Destinations", "Journeys", "Stories", "Shop"];
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem("egyptian-discovery-language", locale);
  }, [locale]);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        setSignedIn(false);
        setUserName("");
        return;
      }
      setSignedIn(true);
      const { data: profile } = await supabase.from("profiles").select("display_name,email,role").eq("id", data.user.id).single();
      setUserName(profile?.display_name || profile?.email || data.user.email || "My account");
      setIsAdmin(!!profile && ["admin","main_admin"].includes(profile.role));
    });
  }, []);

  async function signOut() {
    await createSupabaseBrowserClient().auth.signOut();
    setSignedIn(false);
    setUserName("");
    setIsAdmin(false);
    setProfileOpen(false);
    router.push("/");
    router.refresh();
  }

  function toggleLanguage() {
    setLocale((current) => current === "en" ? "ar" : "en");
  }

  return (
    <header className={isHome ? "site-header" : "site-header site-header-solid"}>
      <Link href="/" className="brand" aria-label="Egyptian Discovery home">
        <Image src="/egyptian-discovery-logo.png" alt="" width={58} height={58} className="brand-logo" priority />
        <span><strong>Egyptian</strong><small>Discovery</small></span>
      </Link>
      <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Main navigation">
        {nav.map((item, index) => (
          <Link
            href={["/destinations", "/trips", "/stories", "/shop"][index]}
            key={item}
            onClick={() => setMenuOpen(false)}
          >
            {item}
          </Link>
        ))}
      </nav>
      <div className="header-actions">
        <button className="language-toggle" onClick={toggleLanguage} aria-label="Change language">
          {locale === "en" ? "العربية" : "English"}
        </button>
        {signedIn ? <div className="profile-menu"><button className="account-link" type="button" onClick={() => setProfileOpen(!profileOpen)}>{userName}</button>{profileOpen && <div className="profile-dropdown"><Link href="/account" onClick={() => setProfileOpen(false)}>My bookings & orders</Link><Link href="/account/profile" onClick={() => setProfileOpen(false)}>Profile</Link>{isAdmin && <Link href="/admin" onClick={() => setProfileOpen(false)}>Admin dashboard</Link>}<button type="button" onClick={signOut}>Sign out</button></div>}</div> : <Link href={`/account?next=${encodeURIComponent(pathname)}`} className="account-link">Sign in</Link>}
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation">
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>
    </header>
  );
}
