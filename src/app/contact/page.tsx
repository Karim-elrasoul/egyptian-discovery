import { SiteHeader } from "@/components/site-header";

export default function ContactPage() {
  return <main><SiteHeader /><div className="page-shell section-shell"><section className="page-hero"><p className="eyebrow">Say hello</p><h1>Let&apos;s plan something meaningful.</h1></section><div className="panel" style={{ maxWidth: 650 }}><p className="muted">For a live build, this form will connect to a protected support inbox. For now, share the essentials and we&apos;ll shape the conversation.</p><form className="search-form" style={{ display: "flex", flexDirection: "column", alignItems: "stretch" }}><label><span>Name</span><input placeholder="Your name" /></label><label><span>Email</span><input type="email" placeholder="you@example.com" /></label><label><span>Message</span><input placeholder="Tell us what you are dreaming about" /></label><button className="button button-dark" type="button">Send enquiry ↗</button></form></div></div></main>;
}
