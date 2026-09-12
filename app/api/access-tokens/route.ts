import { NextRequest, NextResponse } from "next/server";
import { issueAccessToken, secureEquals } from "@/lib/access-tokens";
import { getSupabaseServerClient } from "@/lib/providers/supabase/server-client";

export const dynamic = "force-dynamic";

const ADMIN_SECRET = process.env.ACCESS_TOKEN_ADMIN_SECRET;
const MAX_TTL_DAYS = 365;

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function isAdmin(request: NextRequest) {
  const supplied = request.headers.get("x-access-token-admin-secret");
  return Boolean(ADMIN_SECRET && supplied && secureEquals(supplied, ADMIN_SECRET));
}

function isValidScope(scope: unknown): scope is string {
  return typeof scope === "string" && /^[a-z][a-z0-9:_-]{0,63}$/.test(scope);
}

function noStore(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, { ...init, headers: { "Cache-Control": "no-store" } });
}

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) return unauthorized();
  const supabase = getSupabaseServerClient();
  if (!supabase) return noStore({ error: "Token storage is not configured" }, { status: 503 });

  const { data, error } = await supabase
    .from("access_tokens")
    .select("id, token_prefix, name, token_type, subject, scopes, expires_at, last_used_at, revoked_at, created_at")
    .order("created_at", { ascending: false });
  if (error) return noStore({ error: "Unable to list access tokens" }, { status: 500 });
  return noStore({ tokens: data });
}

export async function POST(request: NextRequest) {
  if (!isAdmin(request)) return unauthorized();
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const scopes: string[] = Array.isArray(body?.scopes) && body.scopes.every(isValidScope)
    ? [...new Set<string>(body.scopes)]
    : [];
  const expiresInDays = typeof body?.expiresInDays === "number" ? body.expiresInDays : null;

  if (!name || name.length > 120 || !scopes.length) {
    return noStore({ error: "A name and at least one valid scope are required" }, { status: 400 });
  }
  if (expiresInDays !== null && (!Number.isInteger(expiresInDays) || expiresInDays < 1 || expiresInDays > MAX_TTL_DAYS)) {
    return noStore({ error: `expiresInDays must be an integer from 1 to ${MAX_TTL_DAYS}` }, { status: 400 });
  }

  try {
    const issued = await issueAccessToken({
      name,
      tokenType: "mcp",
      scopes,
      expiresAt: expiresInDays ? new Date(Date.now() + expiresInDays * 86_400_000) : undefined,
    });
    return noStore({ token: issued.token, tokenInfo: { ...issued, token: undefined } }, { status: 201 });
  } catch (error) {
    console.error("Access token creation failed", error);
    return noStore({ error: "Unable to create access token" }, { status: 500 });
  }
}
