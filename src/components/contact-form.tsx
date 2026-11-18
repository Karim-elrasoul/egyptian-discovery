"use client";

export function ContactForm() {
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    const message = String(form.get("message") || "");
    const text = encodeURIComponent(`Hello Egyptian Discovery,\n\n${message}\n\nName: ${name}\nEmail: ${email}`);
    window.open(`https://wa.me/201140915876?text=${text}`, "_blank", "noopener,noreferrer");
  }

  return <form className="search-form" onSubmit={submit}><label><span>Name</span><input name="name" required /></label><label><span>Email</span><input name="email" type="email" required /></label><label><span>Message</span><textarea name="message" required /></label><button className="button button-dark" type="submit">Send via WhatsApp ↗</button></form>;
}
