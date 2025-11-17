"use client";

import React from "react";
import { ChatBot, ChatBotProps } from "./ui/chat-bot";

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

export function ChatBotProvider({ enabled = true, ...props }: ChatBotProviderProps) {
  if (!enabled) return null;

  return <ChatBot {...props} />;
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
        response: "You can reach us at support@logical-pharma.com or call (555) 123-4567.",
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
