import { NextRequest, NextResponse } from "next/server";
import { secureEquals } from "@/lib/access-tokens";
import { getSupabaseServerClient } from "@/lib/providers/supabase/server-client";

const ADMIN_SECRET = process.env.ACCESS_TOKEN_ADMIN_SECRET;

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supplied = request.headers.get("x-access-token-admin-secret");
  if (!ADMIN_SECRET || !supplied || !secureEquals(supplied, ADMIN_SECRET)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Token storage is not configured" }, { status: 503 });
  const { id } = await params;
  const { error } = await supabase.from("access_tokens").update({ revoked_at: new Date().toISOString() }).eq("id", id).is("revoked_at", null);
  if (error) return NextResponse.json({ error: "Unable to revoke access token" }, { status: 500 });
  return new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}
