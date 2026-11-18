import { SiteHeader } from "@/components/site-header";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminPaymentReview } from "@/components/admin-payment-review";
import Link from "next/link";

export const instant = false;

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  let isAdmin = false;
  let payments: Array<{ id: string; amount: number; method: string; status: string; created_at: string; customer_id: string; reservation_id: string | null; proof_path: string | null; customer?: { email: string | null; display_name: string | null } | null; proof_url?: string }> = [];
  let reservations: Array<{ id: string; reference: string; status: string; seats: number }> = [];
  let orders: Array<{ id: string; reference: string; status: string; total: number }> = [];

  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    isAdmin = !!profile && ["admin", "main_admin"].includes(profile.role);
    if (isAdmin) {
      const [paymentResult, reservationResult, orderResult] = await Promise.all([
        supabase.from("payments").select("id,amount,method,status,created_at,customer_id,reservation_id,proof_path").order("created_at", { ascending: false }).limit(20),
        supabase.from("reservations").select("id,reference,status,seats").order("created_at", { ascending: false }).limit(20),
        supabase.from("orders").select("id,reference,status,total").order("created_at", { ascending: false }).limit(20),
      ]);
      payments = paymentResult.data ?? [];
      const customerIds = [...new Set(payments.map((payment) => payment.customer_id))];
      if (customerIds.length) {
        const { data: profiles } = await supabase.from("profiles").select("id,email,display_name").in("id", customerIds);
        const profileMap = new Map((profiles ?? []).map((profile) => [profile.id, profile]));
        payments = await Promise.all(payments.map(async (payment) => {
          let proof_url = "";
          if (payment.proof_path) {
            const { data: signed } = await supabase.storage.from("payment-proofs").createSignedUrl(payment.proof_path, 300);
            proof_url = signed?.signedUrl ?? "";
          }
          return { ...payment, customer: profileMap.get(payment.customer_id) ?? null, proof_url };
        }));
      }
      reservations = reservationResult.data ?? [];
      orders = orderResult.data ?? [];
    }
  }

  return (
    <main className="admin-shell">
      <SiteHeader />
      <div className="page-shell section-shell">
        <section className="page-hero">
          <p className="eyebrow light">Operations console</p>
          <h1>{isAdmin ? "Good morning, team." : "Authorized staff only."}</h1>
          <p className="muted" style={{ color: "#b9bcb3" }}>{isAdmin ? "Live Supabase operational data" : "Sign in with an administrator account to view protected operations."}</p>
        </section>
        {isAdmin && (
          <>
            <nav className="admin-nav"><Link href="/admin">Overview</Link><Link href="/admin/trips">Trips</Link><Link href="/admin/destinations">Destinations</Link><Link href="/admin/products">Products</Link><Link href="/admin/settings">Settings</Link></nav>
            <div className="admin-kpis">
              <div className="kpi"><p className="eyebrow">Reservations</p><strong>{reservations.length}</strong></div>
              <div className="kpi"><p className="eyebrow">Payment proofs</p><strong>{payments.filter((payment) => payment.status === "under_review" || payment.status === "pending").length}</strong></div>
              <div className="kpi"><p className="eyebrow">Confirmed seats</p><strong>{reservations.filter((reservation) => reservation.status === "confirmed").reduce((sum, reservation) => sum + reservation.seats, 0)}</strong></div>
              <div className="kpi"><p className="eyebrow">Orders</p><strong>{orders.length}</strong></div>
            </div>
            <table className="admin-table">
              <thead><tr><th>Customer</th><th>Payment</th><th>Method</th><th>Status</th><th>Amount</th><th>Proof</th><th>Review</th></tr></thead>
              <tbody>{payments.map((payment) => <tr key={payment.id}><td>{payment.customer?.display_name || payment.customer?.email || payment.customer_id.slice(0, 8)}</td><td>{payment.reservation_id ? `R-${payment.reservation_id.slice(0, 8)}` : payment.id.slice(0, 8)}</td><td>{payment.method}</td><td>{payment.status.replaceAll("_", " ")}</td><td>{Number(payment.amount).toLocaleString("en-EG")} EGP</td><td>{payment.proof_url ? <a href={payment.proof_url} target="_blank" rel="noreferrer">View proof</a> : "No file"}</td><td>{payment.status === "under_review" || payment.status === "pending" ? <AdminPaymentReview paymentId={payment.id} /> : "Reviewed"}</td></tr>)}</tbody>
            </table>
          </>
        )}
      </div>
    </main>
  );
}
