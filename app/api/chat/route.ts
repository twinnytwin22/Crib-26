import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import {
  recordVisitorMessage,
  type RecordVisitorMessageResult,
  updateSessionThreadName,
} from "@/lib/providers/supabase/chat-storage";
import { GoogleAuth } from "google-auth-library";

const GOOGLE_CHAT_SPACE = process.env.GOOGLE_CHAT_SPACE;
const GOOGLE_CHAT_WEBHOOK_URL = process.env.GOOGLE_CHAT_WEBHOOK_URL;
const GOOGLE_CHAT_BOT_TOKEN = process.env.GOOGLE_CHAT_BOT_TOKEN;
const GOOGLE_CHAT_SERVICE_ACCOUNT_JSON =
  process.env.GOOGLE_CHAT_SERVICE_ACCOUNT_JSON;
const CHAT_FORWARD_EMAIL =
  process.env.CHAT_FORWARD_EMAIL ||
  process.env.CONTACT_EMAIL ||
  process.env.SMTP_FROM_EMAIL;

const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587", 10);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM_EMAIL = process.env.SMTP_FROM_EMAIL || SMTP_USER;
const SMTP_FROM_NAME = process.env.SMTP_FROM_NAME || "Crib Network";
const CHAT_SCOPE = "https://www.googleapis.com/auth/chat.bot";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter && SMTP_USER && SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }
  return transporter;
}

function isValidEmail(value?: string) {
  if (!value) return false;
  return /[^\s@]+@[^\s@]+\.[^\s@]+/.test(value.trim());
}

async function getChatAccessToken(): Promise<string | null> {
  // Automatic minting via service account JSON (preferred)
  try {
    const auth = new GoogleAuth({
      scopes: [CHAT_SCOPE],
      ...(GOOGLE_CHAT_SERVICE_ACCOUNT_JSON
        ? { credentials: JSON.parse(GOOGLE_CHAT_SERVICE_ACCOUNT_JSON) }
        : {}),
    });

    const client = await auth.getClient();
    const token = await client.getAccessToken();
    if (token.token) {
      return token.token;
    }
  } catch (error) {
    console.error("Failed to mint Chat access token via GoogleAuth", error);
  }

  // Fallback to manually provided bearer token (short-lived)
  if (GOOGLE_CHAT_BOT_TOKEN) {
    return GOOGLE_CHAT_BOT_TOKEN;
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const previewEmail = isValidEmail(email) ? email : "Anonymous visitor";
    const timestamp = new Date().toISOString();

    let sessionRecord: RecordVisitorMessageResult | null | undefined = null;
    try {
      sessionRecord = await recordVisitorMessage({
        email,
        message,
        source: "web",
      });
    } catch (storageError) {
      console.error("Failed to persist chat message", storageError);
    }

    if (GOOGLE_CHAT_SPACE) {
      try {
        const accessToken = await getChatAccessToken();

        if (!accessToken) {
          throw new Error(
            "Google Chat access token unavailable. Verify service account access or GOOGLE_CHAT_BOT_TOKEN."
          );
        }

        const details = [
          "?? *New Website Chat*",
          `*From:* ${previewEmail}`,
          `*Time:* ${timestamp}`,
        ];

        if (sessionRecord?.sessionKey) {
          details.push(`*Session Key:* ${sessionRecord.sessionKey}`);
        }

        details.push("", `*Message:* ${message}`);

        const chatPayload: Record<string, unknown> = {
          text: details.join("\n"),
        };

        if (sessionRecord?.sessionKey) {
          chatPayload.threadKey = sessionRecord.sessionKey;
          chatPayload.requestId = sessionRecord.sessionKey;
        }

        const apiUrl = `https://chat.googleapis.com/v1/spaces/${encodeURIComponent(
          GOOGLE_CHAT_SPACE
        )}/messages`;

        const chatResponse = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(chatPayload),
        });

        if (!chatResponse.ok) {
          console.error(
            "Google Chat API send failed",
            await chatResponse.text()
          );
        } else {
          try {
            const chatJson = await chatResponse.json();
            const threadName = chatJson?.thread?.name;
            if (threadName && sessionRecord?.sessionKey) {
              await updateSessionThreadName(sessionRecord.sessionKey, threadName);
            }
          } catch (parseError) {
            console.warn("Unable to parse Google Chat API response", parseError);
          }
        }
      } catch (chatError) {
        console.error("Google Chat API error", chatError);
      }
    } else if (GOOGLE_CHAT_WEBHOOK_URL) {
      try {
        const details = [
          "?? *New Website Chat*",
          `*From:* ${previewEmail}`,
          `*Time:* ${timestamp}`,
        ];

        if (sessionRecord?.sessionKey) {
          details.push(`*Session Key:* ${sessionRecord.sessionKey}`);
        }

        details.push("", `*Message:* ${message}`);

        const chatPayload: Record<string, unknown> = {
          text: details.join("\n"),
        };

        const chatResponse = await fetch(GOOGLE_CHAT_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(chatPayload),
        });

        if (!chatResponse.ok) {
          console.error("Google Chat webhook failed", await chatResponse.text());
        }
      } catch (chatError) {
        console.error("Google Chat webhook error", chatError);
      }
    } else {
      console.warn("GOOGLE_CHAT_WEBHOOK_URL is not configured.");
    }

    if (SMTP_USER && SMTP_PASS && CHAT_FORWARD_EMAIL) {
      try {
        const transport = getTransporter();
        if (!transport) {
          throw new Error("Failed to initialize email transporter");
        }

        const emailHtml = `
          <!DOCTYPE html>
          <html>
            <body style="font-family: Arial, sans-serif;">
              <h2>New Website Chat</h2>
              <p><strong>From:</strong> ${previewEmail}</p>
              <p><strong>Time:</strong> ${timestamp}</p>
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap;">${message}</p>
            </body>
          </html>
        `;

        await transport.sendMail({
          from: {
            name: SMTP_FROM_NAME,
            address: SMTP_FROM_EMAIL || SMTP_USER!,
          },
          to: CHAT_FORWARD_EMAIL,
          subject: "New chat message from cribnetwork.io",
          replyTo: isValidEmail(email) ? email : undefined,
          html: emailHtml,
        });
      } catch (emailError) {
        console.error("Failed to send chat notification email", emailError);
      }
    } else {
      console.warn("SMTP credentials or CHAT_FORWARD_EMAIL not configured.");
    }

    const reply = isValidEmail(email)
      ? `Thanks! We just sent your note to the team. We'll reach out at ${email}.`
      : "Thanks! Our team just received your message and will follow up shortly.";

    return NextResponse.json({
      success: true,
      reply,
      session: sessionRecord
        ? {
            id: sessionRecord.sessionId,
            key: sessionRecord.sessionKey,
          }
        : undefined,
    });
  } catch (error) {
    console.error("Chat API error", error);
    return NextResponse.json(
      { error: "Unable to send your message right now. Please try again." },
      { status: 500 }
    );
  }
}
