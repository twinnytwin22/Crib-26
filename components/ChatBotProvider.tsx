"use client";

import React, { useCallback } from "react";
import { ChatBot, ChatBotProps, type ChatSessionInfo } from "./ui/chat-bot";

/**
 * ChatBotProvider - A wrapper component to easily add a chat bot to any page
 * 
 * Usage:
 * 1. Add to layout.tsx for site-wide availability
 * 2. Add to specific pages for page-specific chat
 * 3. Customize props for different contexts
 */

interface ChatBotProviderProps extends ChatBotProps {
  /** Whether to show the chat bot */
  enabled?: boolean;
}

export function ChatBotProvider({
  enabled = true,
  onSendMessage,
  collectEmail,
  requireEmail,
  emailLabel,
  ...props
}: ChatBotProviderProps) {
  const sendToSupport = useCallback(async (message: string, email?: string) => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      return "Please enter a message so we can help.";
    }

    const normalizedEmail = email?.trim();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: trimmedMessage, email }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Chat request failed");
      }

      const data = await response.json();

      const defaultReply = normalizedEmail
        ? `Thanks! We just sent your note to the team. We'll reach out at ${normalizedEmail}.`
        : "Thanks for reaching out! Our team just received your message and will follow up shortly.";

      return {
        reply: data.reply || defaultReply,
        session: data.session as ChatSessionInfo | undefined,
      };
    } catch (error) {
      console.error("Chat relay failed", error);
      return "We couldn't deliver that message. Please try again or email hello@cribnetwork.io.";
    }
  }, []);

  if (!enabled) return null;

  return (
    <ChatBot
      {...props}
      collectEmail={collectEmail ?? true}
      requireEmail={requireEmail ?? true}
      emailLabel={emailLabel ?? "Where can we reach you?"}
      onSendMessage={onSendMessage ?? sendToSupport}
    />
  );
}

// Example configuration presets for different use cases
export const chatBotPresets = {
  support: {
    title: "CRIB Support",
    subtitle: "We're here to help",
    welcomeMessage: "Hello! How can I assist you today?",
    primaryColor: "from-slate-950 via-slate-900 to-slate-800",
    mockResponses: [
      {
        trigger: "help",
        response: "I can help with technical issues, account questions, and general support. What do you need help with?",
      },
      {
        trigger: "contact",
        response: "You can reach us at support@cribnetwork.io or call (555) 123-4567.",
      },
    ],
  },
  sales: {
    title: "CRIB Sales",
    subtitle: "Let's grow together",
    welcomeMessage: "Hi! I'm here to help you find the right solution. What are you interested in?",
    primaryColor: "from-slate-950 via-slate-900 to-slate-800",
    mockResponses: [
      {
        trigger: "demo",
        response: "I'd be happy to schedule a demo for you. Could you provide your email address?",
      },
      {
        trigger: "pricing",
        response: "Our pricing varies based on your specific needs. Let me connect you with our sales team.",
      },
    ],
  },
  feedback: {
    title: "CRIB Feedback",
    subtitle: "We value your opinion",
    welcomeMessage: "We'd love to hear your feedback! How was your experience?",
    primaryColor: "from-slate-950 via-slate-900 to-slate-800",
    mockResponses: [
      {
        trigger: "good",
        response: "That's great to hear! Is there anything specific you'd like to share?",
      },
      {
        trigger: "bad",
        response: "I'm sorry to hear that. Could you tell me more about what went wrong?",
      },
    ],
  },
};
