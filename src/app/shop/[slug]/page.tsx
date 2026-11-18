import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { unsplashUrl } from "@/lib/supabase/data";
import Link from "next/link";

export const instant=false;

export default async function ProductPage({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const supabase=await createSupabaseServerClient();
  const {data:product}=await supabase.from("products").select("*").eq("slug",slug).maybeSingle();
  if(!product) notFound();
  const image=product.images?.[0]||null;
  return <main><SiteHeader /><div className="page-shell section-shell"><section className="page-hero"><p className="eyebrow">Shop</p><h1>{product.name_en}</h1></section><div className="detail-layout"><div className="detail-image" style={{backgroundImage:`url(${unsplashUrl(image,1600)})`}}/><aside className="panel"><p className="eyebrow">{product.availability?"In stock":"Out of stock"}</p><h2>{Number(product.price).toLocaleString("en-EG")} {product.currency}</h2><p className="muted">{product.description_en}</p><p className="muted">Stock: {product.stock_quantity}</p><Link className="button button-dark" href="/shop">Add through the shop cart</Link></aside></div></div></main>;
}
