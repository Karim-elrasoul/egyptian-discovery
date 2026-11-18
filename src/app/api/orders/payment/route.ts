import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (process.env.NEXT_PUBLIC_APP_MODE !== "production") {
    return NextResponse.json({ error: "Demo mode is active. No payment proof was stored." }, { status: 409 });
  }
  const form = await request.formData();
  const orderId = form.get("orderId");
  const method = form.get("method");
  const file = form.get("proof");
  const allowedTypes = new Set(["image/jpeg", "image/png", "application/pdf"]);
  if (typeof orderId !== "string" || (method !== "instapay" && method !== "bank_transfer") || !(file instanceof File)) {
    return NextResponse.json({ error: "Order, method, and proof file are required." }, { status: 400 });
  }
  if (!allowedTypes.has(file.type) || file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "Upload a JPG, PNG, or PDF smaller than 8 MB." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in before submitting order payment." }, { status: 401 });
  const { data: order } = await supabase.from("orders").select("id,customer_id,status").eq("id", orderId).eq("customer_id", user.id).single();
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `${user.id}/orders/${orderId}/${crypto.randomUUID()}.${extension}`;
  const upload = await supabase.storage.from("payment-proofs").upload(path, file, { contentType: file.type, upsert: false });
  if (upload.error) return NextResponse.json({ error: "Could not upload proof securely." }, { status: 400 });
  const { error } = await supabase.rpc("submit_order_payment", { p_order_id: orderId, p_method: method, p_proof_path: path });
  if (error) {
    await supabase.storage.from("payment-proofs").remove([path]);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ submitted: true });
}
