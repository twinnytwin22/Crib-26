import { GoogleAuth, JWT } from "google-auth-library";

const CHAT_SCOPES = [
  "https://www.googleapis.com/auth/chat.bot",
  "https://www.googleapis.com/auth/chat.app.messages.readonly",
];

export const GOOGLE_CHAT_SPACE =
  process.env.GOOGLE_CHAT_SPACE || process.env.CHAT_SPACE_ID;
export const GOOGLE_CHAT_WEBHOOK_URL = process.env.GOOGLE_CHAT_WEBHOOK_URL;

const GOOGLE_CHAT_BOT_TOKEN = process.env.GOOGLE_CHAT_BOT_TOKEN;
const GOOGLE_CHAT_SERVICE_ACCOUNT_JSON =
  process.env.GOOGLE_CHAT_SERVICE_ACCOUNT_JSON;
const GOOGLE_CHAT_CLIENT_EMAIL = process.env.GOOGLE_CHAT_CLIENT_EMAIL;
const GOOGLE_CHAT_PRIVATE_KEY = process.env.GOOGLE_CHAT_PRIVATE_KEY;

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

export async function getChatAccessToken(): Promise<string | null> {
  if (GOOGLE_CHAT_SERVICE_ACCOUNT_JSON) {
    try {
      const auth = new GoogleAuth({
        scopes: CHAT_SCOPES,
        credentials: parseServiceAccountJson(GOOGLE_CHAT_SERVICE_ACCOUNT_JSON),
      });

      const client = await auth.getClient();
      const token = await client.getAccessToken();
      if (token.token) {
        return token.token;
      }
    } catch (error) {
      console.error(
        "Failed to mint Chat access token from GOOGLE_CHAT_SERVICE_ACCOUNT_JSON",
        error
      );
    }
  }

  if (GOOGLE_CHAT_CLIENT_EMAIL && GOOGLE_CHAT_PRIVATE_KEY) {
    try {
      const client = new JWT({
        email: GOOGLE_CHAT_CLIENT_EMAIL,
        key: GOOGLE_CHAT_PRIVATE_KEY.replace(/\\n/g, "\n"),
        scopes: CHAT_SCOPES,
      });

      const token = await client.getAccessToken();
      if (token.token) {
        return token.token;
      }
    } catch (error) {
      console.error(
        "Failed to mint Chat access token from GOOGLE_CHAT_CLIENT_EMAIL/GOOGLE_CHAT_PRIVATE_KEY",
        error
      );
    }
  }

  if (GOOGLE_CHAT_BOT_TOKEN?.startsWith("ya29.")) {
    return GOOGLE_CHAT_BOT_TOKEN;
  }

  console.warn(
    "Google Chat API sync is disabled: configure GOOGLE_CHAT_SERVICE_ACCOUNT_JSON or GOOGLE_CHAT_CLIENT_EMAIL plus GOOGLE_CHAT_PRIVATE_KEY."
  );
  return null;
}
