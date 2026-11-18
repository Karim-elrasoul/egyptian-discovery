import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const allowedTypes = new Set(["image/jpeg", "image/png", "application/pdf"]);
const maxBytes = 8 * 1024 * 1024;

export async function POST(request: Request) {
  if (process.env.NEXT_PUBLIC_APP_MODE !== "production") {
    return NextResponse.json({ error: "Demo mode is active. No payment proof is stored." }, { status: 409 });
  }

  const formData = await request.formData();
  const reservationId = formData.get("reservationId");
  const amount = Number(formData.get("amount"));
  const method = formData.get("method");
  const file = formData.get("proof");

  if (typeof reservationId !== "string" || !Number.isFinite(amount) || amount <= 0 || (method !== "instapay" && method !== "bank_transfer") || !(file instanceof File)) {
    return NextResponse.json({ error: "Reservation, amount, payment method, and proof file are required." }, { status: 400 });
  }
  if (!allowedTypes.has(file.type) || file.size > maxBytes) {
    return NextResponse.json({ error: "Upload a JPG, PNG, or PDF smaller than 8 MB." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in before submitting payment proof." }, { status: 401 });

  const { data: reservation, error: reservationError } = await supabase
    .from("reservations")
    .select("id, customer_id, status")
    .eq("id", reservationId)
    .eq("customer_id", user.id)
    .single();
  if (reservationError || !reservation || !["held", "payment_review"].includes(reservation.status)) {
    return NextResponse.json({ error: "This reservation is not available for payment review." }, { status: 400 });
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `${user.id}/${reservationId}/${crypto.randomUUID()}.${extension}`;
  const upload = await supabase.storage.from("payment-proofs").upload(path, file, { contentType: file.type, upsert: false });
  if (upload.error) return NextResponse.json({ error: "The proof could not be uploaded securely." }, { status: 400 });

  const { error } = await supabase.rpc("submit_reservation_payment", {
    p_reservation_id: reservationId,
    p_amount: amount,
    p_method: method,
    p_proof_path: path,
  });
  if (error) {
    await supabase.storage.from("payment-proofs").remove([path]);
    return NextResponse.json({ error: "The payment proof could not be recorded." }, { status: 400 });
  }
  return NextResponse.json({ submitted: true });
}
