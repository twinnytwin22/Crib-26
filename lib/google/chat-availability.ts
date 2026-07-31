import { OAuth2Client } from "google-auth-library";

export const GOOGLE_CHAT_AVAILABILITY_SCOPE =
  "https://www.googleapis.com/auth/chat.users.availability.readonly";

const CLIENT_ID = process.env.GOOGLE_CHAT_AVAILABILITY_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CHAT_AVAILABILITY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_CHAT_AVAILABILITY_REFRESH_TOKEN;
const CACHE_TTL_MS = 30_000;

export type ChatAvailability = {
  configured: boolean;
  state: "ACTIVE" | "AWAY" | "DO_NOT_DISTURB" | "OFFLINE" | "UNKNOWN";
  customStatus?: string;
};

let cachedAvailability: { value: ChatAvailability; expiresAt: number } | null =
  null;

function configured() {
  return Boolean(CLIENT_ID && CLIENT_SECRET && REFRESH_TOKEN);
}

function normalizeState(value: unknown): ChatAvailability["state"] {
  switch (value) {
    case "ACTIVE":
    case "AWAY":
    case "DO_NOT_DISTURB":
    case "OFFLINE":
      return value;
    default:
      return "UNKNOWN";
  }
}

/**
 * Returns availability for the Workspace account that supplied the refresh
 * token. Google Chat only permits this API to read the authenticated user.
 */
export async function getOwnerChatAvailability(): Promise<ChatAvailability> {
  if (!configured()) {
    return { configured: false, state: "UNKNOWN" };
  }

  if (cachedAvailability && cachedAvailability.expiresAt > Date.now()) {
    return cachedAvailability.value;
  }

  try {
    const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET);
    client.setCredentials({ refresh_token: REFRESH_TOKEN });
    const token = await client.getAccessToken();

    if (!token.token) {
      throw new Error("Google Chat availability access token unavailable");
    }

    const response = await fetch(
      "https://chat.googleapis.com/v1/users/me/availability",
      { headers: { Authorization: `Bearer ${token.token}` }, cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error(`Google Chat availability request failed (${response.status})`);
    }

    const body = (await response.json()) as {
      availability?: unknown;
      customStatus?: { emoji?: string; text?: string };
    };
    const customStatus = [body.customStatus?.emoji, body.customStatus?.text]
      .filter(Boolean)
      .join(" ");
    const value: ChatAvailability = {
      configured: true,
      state: normalizeState(body.availability),
      ...(customStatus ? { customStatus } : {}),
    };
    cachedAvailability = { value, expiresAt: Date.now() + CACHE_TTL_MS };
    return value;
  } catch (error) {
    console.error("Unable to read owner Google Chat availability", error);
    return { configured: true, state: "UNKNOWN" };
  }
}

export function formatAvailability(availability: ChatAvailability) {
  if (!availability.configured) {
    return "Workspace availability is not connected yet. An administrator must finish the Google Chat OAuth setup.";
  }

  const label = availability.state
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
  return `Internal Workspace status: ${label}${
    availability.customStatus ? ` — ${availability.customStatus}` : ""
  }.`;
}
