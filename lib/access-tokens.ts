import "server-only";

import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { getSupabaseServerClient } from "@/lib/providers/supabase/server-client";

export type AccessTokenType = "mcp" | "oauth";

export type AccessTokenRecord = {
  id: string;
  name: string;
  token_type: AccessTokenType;
  subject: string | null;
  scopes: string[];
  expires_at: string | null;
  revoked_at: string | null;
  created_at: string;
};

type IssuedAccessToken = AccessTokenRecord & { token: string };

export function hashAccessToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function secureEquals(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export async function issueAccessToken(input: {
  name: string;
  tokenType: AccessTokenType;
  subject?: string;
  scopes: string[];
  expiresAt?: Date;
}): Promise<IssuedAccessToken> {
  const supabase = getSupabaseServerClient();
  if (!supabase) throw new Error("Access-token storage is not configured");

  const kind = input.tokenType === "mcp" ? "mcp" : "oauth";
  const token = `crib_${kind}_${randomBytes(32).toString("base64url")}`;
  const { data, error } = await supabase
    .from("access_tokens")
    .insert({
      token_hash: hashAccessToken(token),
      token_prefix: token.slice(0, 16),
      name: input.name,
      token_type: input.tokenType,
      subject: input.subject ?? null,
      scopes: input.scopes,
      expires_at: input.expiresAt?.toISOString() ?? null,
    })
    .select("id, name, token_type, subject, scopes, expires_at, revoked_at, created_at")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Unable to create access token");
  return { ...(data as AccessTokenRecord), token };
}

export async function getActiveAccessToken(token: string, requiredScopes: string[] = []) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("access_tokens")
    .select("id, name, token_type, subject, scopes, expires_at, revoked_at, created_at")
    .eq("token_hash", hashAccessToken(token))
    .is("revoked_at", null)
    .maybeSingle();
  if (error || !data) return null;

  const record = data as AccessTokenRecord;
  if (record.expires_at && new Date(record.expires_at) <= new Date()) return null;
  if (!requiredScopes.every((scope) => record.scopes.includes(scope))) return null;

  void supabase.from("access_tokens").update({ last_used_at: new Date().toISOString() }).eq("id", record.id);
  return record;
}

export function getBearerToken(authorization: string | null) {
  const match = authorization?.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() ?? null;
}

/** Use this at the MCP transport boundary before dispatching a tool request. */
export async function authorizeMcpRequest(authorization: string | null, requiredScopes: string[] = []) {
  const token = getBearerToken(authorization);
  if (!token || !token.startsWith("crib_")) return null;
  const record = await getActiveAccessToken(token, requiredScopes);
  return record?.token_type === "mcp" || record?.token_type === "oauth" ? record : null;
}
