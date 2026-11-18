import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const recovery = request.nextUrl.searchParams.get("type") === "recovery";
      return NextResponse.redirect(new URL(recovery ? "/auth/reset" : "/account", request.url));
    }
  }
  return NextResponse.redirect(new URL("/account?auth_error=invalid_or_expired_link", request.url));
}
