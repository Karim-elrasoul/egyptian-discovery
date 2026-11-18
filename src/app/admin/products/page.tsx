import { SiteHeader } from "@/components/site-header";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminProductManager } from "@/components/admin-product-manager";
import { AdminNav } from "@/components/admin-nav";
import { AdminDeleteButton } from "@/components/admin-delete-button";

export const instant = false;

export default async function AdminProductsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  let isAdmin = false;
  let products: Array<{ id: string; name_en: string; price: number; stock_quantity: number; status: string }> = [];
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    isAdmin = !!profile && ["admin", "main_admin"].includes(profile.role);
    if (isAdmin) {
      const { data } = await supabase.from("products").select("id,name_en,price,stock_quantity,status").order("sort_order");
      products = data ?? [];
    }
  }
  return <main className="admin-shell"><SiteHeader /><div className="page-shell section-shell"><AdminNav /><section className="page-hero"><p className="eyebrow light">Shop operations</p><h1>{isAdmin ? "Products" : "Authorized staff only"}</h1></section>{isAdmin && <><table className="admin-table"><thead><tr><th>Product</th><th>Price</th><th>Stock</th><th>Status</th><th>Action</th></tr></thead><tbody>{products.map((item) => <tr key={item.id}><td>{item.name_en}</td><td>{Number(item.price).toLocaleString("en-EG")} EGP</td><td>{item.stock_quantity}</td><td>{item.status}</td><td><AdminDeleteButton kind="products" id={item.id} name={item.name_en} /></td></tr>)}</tbody></table><AdminProductManager /></>}</div></main>;
}
