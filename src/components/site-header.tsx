"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Locale = "en" | "ar";

export function SiteHeader() {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window === "undefined") return "en";
    const saved = window.localStorage.getItem("egyptian-discovery-language");
    return saved === "ar" ? "ar" : "en";
  });
  const [menuOpen, setMenuOpen] = useState(false);
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
        <Link href="/account" className="account-link">Account</Link>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation">
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>
    </header>
  );
}
