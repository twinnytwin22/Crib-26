import { GoogleAuth, JWT } from "google-auth-library";

export const GOOGLE_CHAT_WRITE_SCOPE =
  "https://www.googleapis.com/auth/chat.bot";
export const GOOGLE_CHAT_READ_SCOPE =
  "https://www.googleapis.com/auth/chat.app.messages.readonly";

export const GOOGLE_CHAT_SPACE =
  process.env.GOOGLE_CHAT_SPACE || process.env.CHAT_SPACE_ID;
export const GOOGLE_CHAT_WEBHOOK_URL = process.env.GOOGLE_CHAT_WEBHOOK_URL;

const GOOGLE_CHAT_BOT_TOKEN = process.env.GOOGLE_CHAT_BOT_TOKEN;
const GOOGLE_CHAT_SERVICE_ACCOUNT_JSON =
  process.env.GOOGLE_CHAT_SERVICE_ACCOUNT_JSON;
const GOOGLE_CHAT_CLIENT_EMAIL = process.env.GOOGLE_CHAT_CLIENT_EMAIL;
const GOOGLE_CHAT_PRIVATE_KEY = process.env.GOOGLE_CHAT_PRIVATE_KEY;
const TOKEN_CACHE_TTL_MS = 50 * 60 * 1000;

type CachedToken = {
  token: string;
  expiresAt: number;
};

const tokenCache = new Map<string, CachedToken>();

function parseServiceAccountJson(value: string) {
  try {
    return JSON.parse(value);
  } catch (error) {
    const normalized = value.replace(
      /"private_key"\s*:\s*"([\s\S]*?)"\s*,\s*"client_email"/,
      (_match, privateKey: string) =>
        `"private_key":"${privateKey
          .replace(/\r?\n/g, "\\n")
          .replace(/"/g, '\\"')}","client_email"`
    );

    try {
      return JSON.parse(normalized);
    } catch {
      throw error;
    }
  }
}

export function getGoogleChatAuthMode() {
  if (GOOGLE_CHAT_SERVICE_ACCOUNT_JSON) return "service_account_json";
  if (GOOGLE_CHAT_CLIENT_EMAIL && GOOGLE_CHAT_PRIVATE_KEY) {
    return "split_service_account";
  }
  if (GOOGLE_CHAT_BOT_TOKEN?.startsWith("ya29.")) return "oauth_access_token";
  if (GOOGLE_CHAT_BOT_TOKEN) return "unsupported_bot_token";
  return "missing";
}

export function getGoogleChatSpaceName(space = GOOGLE_CHAT_SPACE) {
  if (!space) return null;
  return space.startsWith("spaces/") ? space : `spaces/${space}`;
}

export function buildGoogleChatMessagesUrl(space = GOOGLE_CHAT_SPACE) {
  const spaceName = getGoogleChatSpaceName(space);
  if (!spaceName) return null;
  return new URL(`https://chat.googleapis.com/v1/${spaceName}/messages`);
}

async function mintServiceAccountToken(
  scope: string
): Promise<string | null> {
  const cached = tokenCache.get(scope);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.token;
  }

  if (GOOGLE_CHAT_SERVICE_ACCOUNT_JSON) {
    try {
      const auth = new GoogleAuth({
        scopes: [scope],
        credentials: parseServiceAccountJson(GOOGLE_CHAT_SERVICE_ACCOUNT_JSON),
      });

      const client = await auth.getClient();
      const token = await client.getAccessToken();
      if (token.token) {
        tokenCache.set(scope, {
          token: token.token,
          expiresAt: Date.now() + TOKEN_CACHE_TTL_MS,
        });
        return token.token;
      }
    } catch (error) {
      console.error(
        "Failed to mint Google Chat service-account token",
        { scope, error }
      );
    }
  }

  if (GOOGLE_CHAT_CLIENT_EMAIL && GOOGLE_CHAT_PRIVATE_KEY) {
    try {
      const client = new JWT({
        email: GOOGLE_CHAT_CLIENT_EMAIL,
        key: GOOGLE_CHAT_PRIVATE_KEY.replace(/\\n/g, "\n"),
        scopes: [scope],
      });

      const token = await client.getAccessToken();
      if (token.token) {
        tokenCache.set(scope, {
          token: token.token,
          expiresAt: Date.now() + TOKEN_CACHE_TTL_MS,
        });
        return token.token;
      }
    } catch (error) {
      console.error(
        "Failed to mint Google Chat split service-account token",
        { scope, error }
      );
    }
  }

  if (GOOGLE_CHAT_BOT_TOKEN?.startsWith("ya29.")) {
    return GOOGLE_CHAT_BOT_TOKEN;
  }

  console.warn(
    "Google Chat API access is disabled: configure GOOGLE_CHAT_SERVICE_ACCOUNT_JSON or GOOGLE_CHAT_CLIENT_EMAIL plus GOOGLE_CHAT_PRIVATE_KEY."
  );
  return null;
}

/**
 * Uses the self-authorized chat.bot scope. Read-side approval failures must
 * never prevent the website from delivering new messages to Google Chat.
 */
export function getChatWriteAccessToken() {
  return mintServiceAccountToken(GOOGLE_CHAT_WRITE_SCOPE);
}

/**
 * Uses the admin-approved app scope that can list public human messages in a
 * space. The chat.bot scope alone only sees messages that invoke the app.
 */
export function getChatReadAccessToken() {
  return mintServiceAccountToken(GOOGLE_CHAT_READ_SCOPE);
}
