import { SiteHeader } from "@/components/site-header";
import { AuthPanel } from "@/components/auth-panel";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PaymentProofForm } from "@/components/payment-proof-form";
import { OrderProofForm } from "@/components/order-proof-form";
import { SignOutButton } from "@/components/sign-out-button";

export const instant = false;

export default async function AccountPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  let reservations: Array<{ id: string; reference: string; status: string; seats: number; held_until: string; deposit_due: number; amount_due: number; balance_due_at: string | null }> = [];
  let payments: Array<{ id: string; amount: number; method: string; status: string }> = [];
  let orders: Array<{ id: string; reference: string; status: string; total: number }> = [];
  if (user) {
    const [reservationResult, paymentResult, orderResult] = await Promise.all([
      supabase.from("reservations").select("id,reference,status,seats,held_until,deposit_due,amount_due,balance_due_at").eq("customer_id", user.id).order("created_at", { ascending: false }),
      supabase.from("payments").select("id,amount,method,status").eq("customer_id", user.id).order("created_at", { ascending: false }),
      supabase.from("orders").select("id,reference,status,total").eq("customer_id", user.id).order("created_at", { ascending: false }),
    ]);
    reservations = reservationResult.data ?? [];
    payments = paymentResult.data ?? [];
    orders = orderResult.data ?? [];
  }

  return (
    <main>
      <SiteHeader />
      <div className="page-shell section-shell">
        <section className="page-hero"><p className="eyebrow">Your travel desk</p><h1>{user ? "Your journeys and next steps." : "Welcome to Egyptian Discovery."}</h1></section>
        {!user ? (
          <div className="account-grid"><AuthPanel /><div className="panel"><h3>Secure account</h3><p className="muted">Sign in or create an account to reserve seats, submit payment proof, track orders, and manage traveler details.</p></div></div>
        ) : (
          <div className="account-grid">
            <div className="panel">
              <SignOutButton />
              <p className="eyebrow">Reservations</p>
              {reservations.length === 0 ? <p className="muted">No reservations yet. Explore a journey to reserve your first seats.</p> : reservations.map((reservation) => (
                <div className="account-row" key={reservation.id}><div><strong>{reservation.reference}</strong><p className="muted">{reservation.seats} seats · {reservation.status.replaceAll("_", " ")}</p>{reservation.status === "held" && <p className="muted">Hold expires: {new Date(reservation.held_until).toLocaleString()}</p>}<p className="muted">Deposit due: {Number(reservation.deposit_due).toLocaleString("en-EG")} EGP · Balance due: {Number(reservation.amount_due).toLocaleString("en-EG")} EGP</p>{reservation.balance_due_at && <p className="muted">Balance deadline: {new Date(reservation.balance_due_at).toLocaleString()}</p>}</div></div>
              ))}
              <p className="eyebrow" style={{ marginTop: 28 }}>Orders</p>
              {orders.length === 0 ? <p className="muted">No store orders yet.</p> : orders.map((order) => (
                <div className="account-row" key={order.id}><div><strong>{order.reference}</strong><p className="muted">{Number(order.total).toLocaleString("en-EG")} EGP · {order.status}</p></div></div>
              ))}
            </div>
            <div>
              {reservations[0] && ["held", "awaiting_payment", "payment_review", "deposit_paid", "confirmed"].includes(reservations[0].status) && <PaymentProofForm reservationId={reservations[0].id} amountDue={reservations[0].status === "confirmed" ? reservations[0].amount_due : reservations[0].deposit_due} />}
              {orders[0] && <div style={{ marginTop: 20 }}><OrderProofForm orderId={orders[0].id} /></div>}
              <div className="panel account-payments">
                <p className="eyebrow">Payment activity</p>
                {payments.length === 0 ? <p className="muted">No payment proofs submitted yet.</p> : payments.map((payment) => <div className="account-row" key={payment.id}><strong>{Number(payment.amount).toLocaleString("en-EG")} EGP</strong><span className="muted">{payment.method} · {payment.status}</span></div>)}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
