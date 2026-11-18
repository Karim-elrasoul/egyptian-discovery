import { SiteHeader } from "@/components/site-header";
import { getGovernorates, getProducts, unsplashUrl } from "@/lib/supabase/data";
import { AddToCartButton, ShopCart } from "@/components/shop-cart";

export const instant = false;

export default async function ShopPage() {
  const products = await getProducts();
  const governorates = await getGovernorates();
  return <main><SiteHeader /><ShopCart governorates={governorates} /><div className="page-shell section-shell"><section className="page-hero"><p className="eyebrow">Take a little Egypt home</p><h1>Objects with a story.</h1><p className="muted">Small-batch goods from makers we meet on the road.</p></section><div className="simple-grid">{products.map((product) => <article className="panel" key={product.id}><div className="trip-image" style={{ backgroundImage: `url(${unsplashUrl(product.images?.[0] || null)})`, margin: "-2rem -2rem 1.5rem" }} /><h3>{product.name_en}</h3><p className="muted">{product.description_en}</p><div className="trip-card-footer"><strong>{Number(product.price).toLocaleString("en-EG")} {product.currency}</strong>{product.availability ? <AddToCartButton id={product.id} name={product.name_en} price={Number(product.price)} /> : <button className="button button-dark" type="button" disabled>Out of stock</button>}</div></article>)}</div></div></main>;
}
