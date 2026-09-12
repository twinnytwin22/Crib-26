# Access tokens

Apply `supabase/migrations/0004_access_tokens.sql` before enabling token issuance. MCP personal tokens are created with `POST /api/access-tokens`, authenticated by the `x-access-token-admin-secret` header. The token value is returned once only; list and revoke records with `GET /api/access-tokens` and `DELETE /api/access-tokens/:id` using the same header.

OAuth client-credentials clients call `POST /api/oauth/token` using form data (`grant_type=client_credentials`, `client_id`, `client_secret`, and optional space-separated `scope`). Configure clients in `OAUTH_CLIENTS_JSON`; tokens are opaque Bearer tokens and expire after the configured lifetime.
