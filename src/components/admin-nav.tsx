import Link from "next/link";

export function AdminNav() {
  return <nav className="admin-nav" aria-label="Admin sections"><Link href="/admin">Overview</Link><Link href="/admin/trips">Trips</Link><Link href="/admin/destinations">Destinations</Link><Link href="/admin/products">Products</Link><Link href="/admin/settings">Settings</Link></nav>;
}
