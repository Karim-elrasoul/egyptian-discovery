"use client";

import { useEffect, useMemo, useState } from "react";

type Item = { id: string; name: string; price: number; quantity: number };

export function ShopCart({ governorates }: { governorates: Array<{ code: string; name_en: string }> }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const total = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);

  useEffect(() => {
    function handleAdd(event: Event) {
      const detail = (event as CustomEvent<{ id: string; name: string; price: number }>).detail;
      setItems((current) => {
        const existing = current.find((item) => item.id === detail.id);
        if (existing) return current.map((item) => item.id === detail.id ? { ...item, quantity: item.quantity + 1 } : item);
        return [...current, { id: detail.id, name: detail.name, price: detail.price, quantity: 1 }];
      });
      setOpen(true);
    }
    window.addEventListener("egyptian-discovery:add-cart", handleAdd);
    return () => window.removeEventListener("egyptian-discovery:add-cart", handleAdd);
  }, []);

  async function checkout(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        governorateCode: form.get("governorate"),
        address: form.get("address"),
        recipientName: form.get("name"),
        recipientPhone: form.get("phone"),
        items: items.map((item) => ({ product_id: item.id, quantity: item.quantity })),
      }),
    });
    const result = await response.json();
    if (response.ok) {
      setItems([]);
      setMessage(`Order ${result.order?.reference || "created"} successfully.`);
    } else setMessage(result.error);
    setBusy(false);
  }

  return (
    <>
      <button className="shop-cart-button" type="button" onClick={() => setOpen(true)}>Cart <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span></button>
      {open && <aside className="cart-drawer" aria-label="Shopping cart">
        <div className="cart-heading"><h2>Your cart</h2><button type="button" onClick={() => setOpen(false)}>Close</button></div>
        {items.length === 0 ? <p className="muted">Your cart is empty.</p> : <>
          {items.map((item) => <div className="cart-row" key={item.id}><div><strong>{item.name}</strong><span>{item.quantity} × {item.price.toLocaleString("en-EG")} EGP</span></div><button type="button" onClick={() => setItems((current) => current.map((row) => row.id === item.id ? { ...row, quantity: Math.max(0, row.quantity - 1) } : row).filter((row) => row.quantity > 0))}>Remove</button></div>)}
          <div className="cart-total"><span>Total</span><strong>{total.toLocaleString("en-EG")} EGP</strong></div>
          <form className="checkout-form" onSubmit={checkout}>
            <label><span>Recipient name</span><input name="name" required /></label>
            <label><span>Phone</span><input name="phone" required /></label>
            <label><span>Governorate</span><select name="governorate" required><option value="">Choose governorate</option>{governorates.map((governorate) => <option value={governorate.code} key={governorate.code}>{governorate.name_en}</option>)}</select></label>
            <label><span>Delivery address</span><textarea name="address" required /></label>
            <button className="button button-dark" disabled={busy} type="submit">{busy ? "Creating order…" : "Create order →"}</button>
            {message && <p className="muted" role="status">{message}</p>}
          </form>
        </>}
      </aside>}
      <div id="shop-cart-events" data-update-cart="true" />
    </>
  );
}

export function AddToCartButton({ id, name, price }: { id: string; name: string; price: number }) {
  function add() {
    window.dispatchEvent(new CustomEvent("egyptian-discovery:add-cart", { detail: { id, name, price } }));
  }
  return <button className="button button-dark" type="button" onClick={add}>Add to cart</button>;
}
