import { SiteHeader } from "@/components/site-header";
import { ContactForm } from "@/components/contact-form";

export default function ContactPage() {
  return <main><SiteHeader /><div className="page-shell section-shell"><section className="page-hero"><p className="eyebrow">Say hello</p><h1>Let&apos;s plan something meaningful.</h1></section><div className="account-grid"><div className="panel" style={{ maxWidth: 650 }}><p className="muted">Tell us what you would like to explore, and continue the conversation directly with the travel team on WhatsApp.</p><ContactForm /></div><div className="panel"><p className="eyebrow">WhatsApp</p><h3>Talk to the team</h3><p className="muted">Contact Egyptian Discovery directly for travel questions and booking help.</p><a className="button button-dark" href="https://wa.me/201140915876" target="_blank" rel="noreferrer">Open WhatsApp ↗</a></div></div></div></main>;
}
