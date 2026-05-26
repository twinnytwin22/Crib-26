import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import {
  recordVisitorMessage,
  type RecordVisitorMessageResult,
  updateSessionThreadName,
} from "@/lib/providers/supabase/chat-storage";
import {
  createChatSessionToken,
  getChatSessionToken,
  setChatSessionCookie,
} from "@/lib/chat/session-cookie";
import {
  buildGoogleChatMessagesUrl,
  getChatAccessToken,
  getGoogleChatAuthMode,
  getGoogleChatSpaceName,
  GOOGLE_CHAT_SPACE,
  GOOGLE_CHAT_WEBHOOK_URL,
} from "@/lib/google/chat-api";
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
    const existingSessionToken = getChatSessionToken(req);
    const visitorIdentifier = existingSessionToken ?? createChatSessionToken();
    const shouldSetSessionCookie = !existingSessionToken;

    let sessionRecord: RecordVisitorMessageResult | null | undefined = null;
    try {
      sessionRecord = await recordVisitorMessage({
        email,
        message,
        visitorIdentifier,
        source: "web",
      });
    } catch (storageError) {
      console.error("Failed to persist chat message", storageError);
    }

    let sentToGoogleChat = false;

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
          chatPayload.thread = { threadKey: sessionRecord.sessionKey };
        }

        const apiUrl = buildGoogleChatMessagesUrl(GOOGLE_CHAT_SPACE);
        if (!apiUrl) {
          throw new Error("Google Chat space unavailable");
        }
        if (sessionRecord?.sessionKey) {
          apiUrl.searchParams.set("requestId", sessionRecord.sessionKey);
          apiUrl.searchParams.set(
            "messageReplyOption",
            "REPLY_MESSAGE_FALLBACK_TO_NEW_THREAD"
          );
        }

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
            {
              status: chatResponse.status,
              authMode: getGoogleChatAuthMode(),
              space: getGoogleChatSpaceName(),
              body: await chatResponse.text(),
            }
          );
        } else {
          sentToGoogleChat = true;
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
    }

    if (!sentToGoogleChat && GOOGLE_CHAT_WEBHOOK_URL) {
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
        if (sessionRecord?.sessionKey) {
          chatPayload.thread = { threadKey: sessionRecord.sessionKey };
        }

        const webhookUrl = new URL(GOOGLE_CHAT_WEBHOOK_URL);
        if (sessionRecord?.sessionKey) {
          webhookUrl.searchParams.set("threadKey", sessionRecord.sessionKey);
          webhookUrl.searchParams.set(
            "messageReplyOption",
            "REPLY_MESSAGE_FALLBACK_TO_NEW_THREAD"
          );
        }

        const chatResponse = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(chatPayload),
        });

        if (!chatResponse.ok) {
          console.error("Google Chat webhook failed", await chatResponse.text());
        } else {
          sentToGoogleChat = true;
        }
      } catch (chatError) {
        console.error("Google Chat webhook error", chatError);
      }
    }

    if (!sentToGoogleChat) {
      console.warn("Google Chat delivery is not configured or failed.");
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

    const response = NextResponse.json({
      success: true,
      reply,
      session: sessionRecord
        ? {
            id: sessionRecord.sessionId,
          }
        : undefined,
    });
    if (shouldSetSessionCookie && sessionRecord?.sessionKey) {
      setChatSessionCookie(response, sessionRecord.sessionKey);
    }
    return response;
  } catch (error) {
    console.error("Chat API error", error);
    return NextResponse.json(
      { error: "Unable to send your message right now. Please try again." },
      { status: 500 }
    );
  }
}
