"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { X, Send, MessageCircle, Minimize2 } from "lucide-react";
import type {
  RealtimeChannel,
  RealtimePostgresInsertPayload,
} from "@supabase/supabase-js";
import { Button } from "./button";
import { Input } from "./input";
import { Card } from "./card";
import { ScrollArea } from "./scroll-area";
import { Avatar, AvatarFallback } from "./avatar";
import { getSupabaseBrowserClient } from "@/lib/providers/supabase/browser-client";

export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

type IncomingChatMessage = Omit<ChatMessage, "timestamp"> & {
  timestamp: Date | string;
};

export interface ChatSessionInfo {
  id?: string;
  key?: string;
}

export type ChatSendHandlerResult =
  | string
  | {
      reply?: string;
      session?: ChatSessionInfo | null;
    };

export interface ChatBotProps {
  /** Title displayed in the chat header */
  title?: string;
  /** Subtitle/description in the chat header */
  subtitle?: string;
  /** Placeholder text for the input field */
  placeholder?: string;
  /** Initial welcome message from the bot */
  welcomeMessage?: string;
  /** Primary theme color */
  primaryColor?: string;
  /** Position of the chat button */
  position?: "bottom-right" | "bottom-left";
  /** Custom function to handle sending messages - for backend integration */
  onSendMessage?: (
    message: string,
    email?: string
  ) => Promise<ChatSendHandlerResult>;
  /** Mock responses for demo purposes */
  mockResponses?: { trigger: string; response: string }[];
  /** Whether to show an email capture field */
  collectEmail?: boolean;
  /** Require a valid email before sending messages */
  requireEmail?: boolean;
  /** Label for the email input */
  emailLabel?: string;
  /** Prefill the email input */
  initialEmail?: string;
}

const defaultMockResponses = [
  {
    trigger: "help",
    response: "I can assist you with questions about our services, support, and general inquiries. How can I help you today?",
  },
  {
    trigger: "support",
    response: "For support, you can reach us at support@example.com or call us at (555) 123-4567. What specific issue are you experiencing?",
  },
  {
    trigger: "hours",
    response: "We're available Monday-Friday, 9 AM - 5 PM EST. You can also submit inquiries 24/7 through this chat.",
  },
  {
    trigger: "pricing",
    response: "I'd be happy to discuss our pricing options. Could you tell me more about what you're interested in?",
  },
];

export function ChatBot({
  title = "Support Chat",
  subtitle = "We're here to help",
  placeholder = "Type your message...",
  welcomeMessage = "Hello! How can I help you today?",
  primaryColor: _primaryColor = "from-slate-950 via-slate-900 to-slate-800",
  position = "bottom-right",
  collectEmail = false,
  requireEmail = false,
  emailLabel = "Where should we reply?",
  initialEmail = "",
  onSendMessage,
  mockResponses = defaultMockResponses,
}: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome",
      content: welcomeMessage,
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [contactEmail, setContactEmail] = useState(initialEmail);
  const [emailTouched, setEmailTouched] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const knownMessageIds = useRef<Set<string>>(new Set(["welcome"]));
  const supabaseClient = useMemo(() => getSupabaseBrowserClient(), []);
  const realtimeChannelRef = useRef<RealtimeChannel | null>(null);
  const [sessionInfo, setSessionInfo] = useState<ChatSessionInfo | null>(null);

  const shouldCollectEmail = collectEmail || requireEmail;
  const emailIsValid = contactEmail
    ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim())
    : false;
  const canSend = inputValue.trim().length > 0 && (!requireEmail || emailIsValid);
  const showEmailError = shouldCollectEmail && requireEmail && emailTouched && !emailIsValid;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const normalizeMessage = useCallback(
    (message: IncomingChatMessage): ChatMessage => ({
      ...message,
      timestamp:
        message.timestamp instanceof Date
          ? message.timestamp
          : new Date(message.timestamp),
    }),
    []
  );

  const appendMessage = useCallback((message: ChatMessage) => {
    knownMessageIds.current.add(message.id);
    setMessages((prev) => [...prev, message]);
  }, []);

  const fetchMessages = useCallback(
    async (sessionKey: string) => {
      try {
        const response = await fetch(`/api/chat/messages?sessionKey=${encodeURIComponent(sessionKey)}`);
        if (!response.ok) {
          console.warn("Failed to fetch chat messages", response.status);
          return;
        }

        const data = await response.json();
        const rawMessages: IncomingChatMessage[] = Array.isArray(data.messages)
          ? data.messages
          : [];

        if (rawMessages.length === 0) {
          return;
        }

        const normalizedMessages = rawMessages.map(normalizeMessage);

        const newMessages = normalizedMessages.filter((msg: ChatMessage) => {
          if (!msg.timestamp) return false;
          return !knownMessageIds.current.has(msg.id);
        });

        if (newMessages.length > 0) {
          newMessages.forEach((msg: ChatMessage) => {
            knownMessageIds.current.add(msg.id);
          });
          setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const toAdd = newMessages.filter((m: ChatMessage) => !existingIds.has(m.id));
            return [...prev, ...toAdd];
          });
        }
      } catch (error) {
        console.error("Failed to poll chat messages", error);
      }
    },
    [normalizeMessage]
  );

  const subscribeToRealtime = useCallback(
    (sessionId: string) => {
      if (!supabaseClient) {
        console.warn("Supabase client not available for real-time subscription");
        return;
      }

      const channel = supabaseClient
        .channel(`chat-session-${sessionId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "chat_messages",
            filter: `session_id=eq.${sessionId}`,
          },
          (payload: RealtimePostgresInsertPayload<{
            id: string;
            role: "visitor" | "agent" | "system";
            content: string;
            created_at: string;
            source: string;
          }>) => {
            const newRow = payload.new;
            if (!newRow || newRow.role === "visitor") {
              return;
            }

            if (knownMessageIds.current.has(newRow.id)) {
              return;
            }

            const incomingMessage: ChatMessage = {
              id: newRow.id,
              content: newRow.content,
              sender: "bot",
              timestamp: new Date(newRow.created_at),
            };

            knownMessageIds.current.add(newRow.id);
            setMessages((prev) => [...prev, incomingMessage]);
          }
        )
        .subscribe((status) => {
          console.log("Realtime subscription status:", status);
        });

      realtimeChannelRef.current = channel;
    },
    [supabaseClient]
  );

  // Set up real-time subscription
  useEffect(() => {
    if (!sessionInfo?.id || !supabaseClient) {
      return;
    }

    subscribeToRealtime(sessionInfo.id);

    return () => {
      if (realtimeChannelRef.current && supabaseClient) {
        supabaseClient.removeChannel(realtimeChannelRef.current);
      }
      realtimeChannelRef.current = null;
    };
  }, [sessionInfo?.id, subscribeToRealtime, supabaseClient]);

  // Poll for messages as backup if real-time fails
  useEffect(() => {
    if (!sessionInfo?.key) {
      return;
    }

    const pollInterval = setInterval(() => {
      fetchMessages(sessionInfo.key!);
    }, 5000); // Poll every 5 seconds

    // Initial fetch
    fetchMessages(sessionInfo.key);

    return () => clearInterval(pollInterval);
  }, [sessionInfo?.key, fetchMessages]);

  const ACKNOWLEDGEMENT_RESPONSE =
    "Thanks for reaching out! Our team just received your message and will follow up shortly.";

  const generateBotResponse = async (
    userMessage: string
  ): Promise<{ reply: string; session?: ChatSessionInfo | null }> => {
    const trimmedMessage = userMessage.trim();

    // If custom onSendMessage handler is provided, use it
    if (onSendMessage) {
      const emailPayload = shouldCollectEmail ? contactEmail.trim() || undefined : undefined;
      const result = await onSendMessage(trimmedMessage, emailPayload);

      if (typeof result === "string") {
        return { reply: result };
      }

      return {
        reply: result?.reply || ACKNOWLEDGEMENT_RESPONSE,
        session: result?.session,
      };
    }

    // Otherwise, use mock responses
    const lowerMessage = trimmedMessage.toLowerCase();
    const matchedResponse = mockResponses.find((mock) =>
      lowerMessage.includes(mock.trigger.toLowerCase())
    );

    if (matchedResponse) {
      return { reply: matchedResponse.response };
    }

    // Default response
    return {
      reply:
        "Thank you for your message. A team member will get back to you shortly. Is there anything else I can help you with?",
    };
  };

  const handleSendMessage = async () => {
    const currentInput = inputValue.trim();
    if (!currentInput) return;

    if (shouldCollectEmail && requireEmail && !emailIsValid) {
      setEmailTouched(true);
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: currentInput,
      sender: "user",
      timestamp: new Date(),
    };

    appendMessage(userMessage);
    setInputValue("");
    setIsTyping(true);

    // Simulate typing delay
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000));

    let botResponseContent: string;
    let sessionUpdate: ChatSessionInfo | null | undefined;
    try {
      const botResponse = await generateBotResponse(currentInput);
      botResponseContent = botResponse.reply || ACKNOWLEDGEMENT_RESPONSE;
      sessionUpdate = botResponse.session;
    } catch (error) {
      console.error("Chat bot failed to send message", error);
      botResponseContent = "We couldn't deliver that message. Please try again or email us directly.";
    }

    if (sessionUpdate && (sessionUpdate.id || sessionUpdate.key)) {
      setSessionInfo((prev) => ({
        id: sessionUpdate?.id ?? prev?.id,
        key: sessionUpdate?.key ?? prev?.key,
      }));
    }

    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: botResponseContent,
      sender: "bot",
      timestamp: new Date(),
    };

    setIsTyping(false);
    appendMessage(botMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const positionClasses = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50`} data-theme-source={_primaryColor}>
      {/* Chat Window */}
      {isOpen && (
        <Card
          className={`mb-4 w-[min(380px,calc(100vw-32px))] overflow-hidden shadow-lg transition-all duration-300 ${
            isMinimized ? "h-16" : "h-[600px]"
          } flex flex-col`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-[var(--neutral-900)] p-4">
            <div className="relative z-10 flex items-center gap-3">
              <Avatar className="h-10 w-10 rounded-md border border-white/15">
                <AvatarFallback className="rounded-md bg-white/10 text-white">
                  <MessageCircle className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="text-white">
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="text-xs text-white/70">{subtitle}</p>
              </div>
            </div>
            <div className="relative z-10 flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/15 hover:text-white"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/15 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          {!isMinimized && (
            <>
              {shouldCollectEmail && (
                <div className="border-b border-border bg-card px-4 py-3">
                  <p className="mb-2 text-xs font-medium text-foreground">{emailLabel}</p>
                  <Input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    onBlur={() => setEmailTouched(true)}
                    placeholder="you@example.com"
                  />
                  {showEmailError && (
                    <p className="mt-1 text-xs text-destructive">
                      Please enter a valid email so we can reply.
                    </p>
                  )}
                </div>
              )}
              <ScrollArea className="flex-1 bg-background p-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                        message.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 shadow-sm ${
                          message.sender === "user"
                            ? "border border-white/10 bg-[var(--neutral-900)] text-white"
                            : "border border-border bg-card text-foreground"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start animate-in fade-in duration-300">
                      <div className="rounded-lg border border-border bg-card p-3 shadow-sm">
                        <div className="flex gap-1">
                          <div className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                          <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0.2s]" />
                          <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0.4s]" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t border-border bg-card p-4">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="icon"
                    disabled={!canSend}
                    className="text-white"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      )}

      {/* Floating Action Button */}
      {!isOpen && (
        <div className="relative">
          <Button
            onClick={() => setIsOpen(true)}
            size="lg"
            className="relative h-12 w-12 rounded-lg shadow-lg animate-in zoom-in"
          >
            <MessageCircle className="h-6 w-6 text-white" />
          </Button>
        </div>
      )}
    </div>
  );
}
