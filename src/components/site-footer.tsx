import Link from "next/link";
import Image from "next/image";

export function SiteFooter() {
  return <footer className="footer"><div className="footer-inner section-shell"><div className="footer-brand"><Image src="/egyptian-discovery-logo.png" alt="Egyptian Discovery" width={70} height={70} /><p>Unforgettable journeys across Egypt.</p></div><div><h3>Discover</h3><Link href="/destinations">Destinations</Link><Link href="/trips">Journeys</Link><Link href="/stories">Travel stories</Link></div><div><h3>Company</h3><Link href="/about">About us</Link><Link href="/contact">Contact</Link><Link href="/shop">Shop</Link></div><div className="newsletter"><h3>Travel inspiration</h3><p>Talk to the team for updates and new journeys.</p><a className="button button-accent" href="https://wa.me/201140915876" target="_blank" rel="noreferrer">WhatsApp updates</a></div></div><div className="footer-bottom section-shell"><span>© 2026 Egyptian Discovery</span><div><Link href="/terms">Terms</Link><Link href="/privacy">Privacy</Link><a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram</a></div></div></footer>;
}
