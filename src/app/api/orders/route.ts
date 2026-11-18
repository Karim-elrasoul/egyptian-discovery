import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (process.env.NEXT_PUBLIC_APP_MODE !== "production") {
    return NextResponse.json({ error: "Demo mode is active. No order was created." }, { status: 409 });
  }
  const body = await request.json().catch(() => null) as {
    governorateCode?: string;
    address?: string;
    recipientName?: string;
    recipientPhone?: string;
    items?: Array<{ product_id: string; quantity: number }>;
  } | null;
  if (!body?.governorateCode || !body.address || !body.recipientName || !body.recipientPhone || !body.items?.length) {
    return NextResponse.json({ error: "Delivery details and at least one item are required." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in before placing an order." }, { status: 401 });

  const { data, error } = await supabase.rpc("create_store_order", {
    p_governorate_code: body.governorateCode,
    p_address: body.address,
    p_recipient_name: body.recipientName,
    p_recipient_phone: body.recipientPhone,
    p_items: body.items,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ order: data });
}
