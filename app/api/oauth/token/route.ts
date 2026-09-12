import { NextRequest, NextResponse } from "next/server";
import { issueAccessToken, secureEquals } from "@/lib/access-tokens";

export const dynamic = "force-dynamic";

type OAuthClient = { clientSecret: string; scopes: string[]; tokenLifetimeSeconds?: number };

function getClients(): Record<string, OAuthClient> {
  try {
    return JSON.parse(process.env.OAUTH_CLIENTS_JSON ?? "{}");
  } catch {
    return {};
  }
}

function getBasicCredentials(authorization: string | null) {
  const encoded = authorization?.match(/^Basic\s+(.+)$/i)?.[1];
  if (!encoded) return null;
  try {
    const decoded = Buffer.from(encoded, "base64").toString("utf8");
    const separator = decoded.indexOf(":");
    return separator > -1 ? { clientId: decoded.slice(0, separator), clientSecret: decoded.slice(separator + 1) } : null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";
  const values: Record<string, unknown> = contentType.includes("application/json")
    ? await request.json().catch(() => ({}))
    : Object.fromEntries((await request.formData()).entries());
  const grantType = typeof values.grant_type === "string" ? values.grant_type : "";
  const basicCredentials = getBasicCredentials(request.headers.get("authorization"));
  const clientId = basicCredentials?.clientId ?? (typeof values.client_id === "string" ? values.client_id : "");
  const clientSecret = basicCredentials?.clientSecret ?? (typeof values.client_secret === "string" ? values.client_secret : "");
  const requestedScopes = typeof values.scope === "string" ? values.scope.split(/\s+/).filter(Boolean) : [];

  const client = getClients()[clientId];
  if (grantType !== "client_credentials") {
    return NextResponse.json({ error: "unsupported_grant_type" }, { status: 400 });
  }
  if (!client || !clientSecret || !secureEquals(clientSecret, client.clientSecret)) {
    return NextResponse.json({ error: "invalid_client" }, { status: 401, headers: { "WWW-Authenticate": "Basic realm=oauth" } });
  }
  if (!requestedScopes.every((scope) => client.scopes.includes(scope))) {
    return NextResponse.json({ error: "invalid_scope" }, { status: 400 });
  }

  const scopes = requestedScopes.length ? requestedScopes : client.scopes;
  const expiresIn = Math.min(Math.max(client.tokenLifetimeSeconds ?? 3600, 60), 86_400);
  try {
    const issued = await issueAccessToken({
      name: `OAuth: ${clientId}`,
      tokenType: "oauth",
      subject: clientId,
      scopes,
      expiresAt: new Date(Date.now() + expiresIn * 1000),
    });
    return NextResponse.json({ access_token: issued.token, token_type: "Bearer", expires_in: expiresIn, scope: scopes.join(" ") }, { headers: { "Cache-Control": "no-store", Pragma: "no-cache" } });
  } catch (error) {
    console.error("OAuth token issuance failed", error);
    return NextResponse.json({ error: "server_error" }, { status: 503 });
  }
}
