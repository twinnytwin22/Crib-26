"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Send, MessageCircle, Minimize2 } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { Card } from "./card";
import { ScrollArea } from "./scroll-area";
import { Avatar, AvatarFallback } from "./avatar";

export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

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
  onSendMessage?: (message: string) => Promise<string>;
  /** Mock responses for demo purposes */
  mockResponses?: { trigger: string; response: string }[];
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
  primaryColor = "from-slate-950 via-slate-900 to-slate-800",
  position = "bottom-right",
  onSendMessage,
  mockResponses = defaultMockResponses,
}: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      content: welcomeMessage,
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const generateBotResponse = async (userMessage: string): Promise<string> => {
    // If custom onSendMessage handler is provided, use it
    if (onSendMessage) {
      return await onSendMessage(userMessage);
    }

    // Otherwise, use mock responses
    const lowerMessage = userMessage.toLowerCase();
    const matchedResponse = mockResponses.find((mock) =>
      lowerMessage.includes(mock.trigger.toLowerCase())
    );

    if (matchedResponse) {
      return matchedResponse.response;
    }

    // Default response
    return "Thank you for your message. A team member will get back to you shortly. Is there anything else I can help you with?";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate typing delay
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000));

    const botResponseContent = await generateBotResponse(inputValue);
    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: botResponseContent,
      sender: "bot",
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, botMessage]);
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
    <div className={`fixed ${positionClasses[position]} z-50`}>
      {/* Chat Window */}
      {isOpen && (
        <Card
          className={`mb-4 w-[380px] shadow-2xl transition-all duration-300 overflow-hidden ${
            isMinimized ? "h-16" : "h-[600px]"
          } flex flex-col border-none`}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between p-4 bg-linear-to-br ${primaryColor} relative overflow-hidden`}
          >
            {/* Decorative gradient orbs matching homepage */}
            <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-pink-500/30 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-purple-500/20 blur-3xl" />
            
            <div className="flex items-center gap-3 relative z-10">
              <Avatar className="h-10 w-10 border border-white/20">
                <AvatarFallback className="bg-white/5 text-white backdrop-blur">
                  <MessageCircle className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="text-white">
                <h3 className="font-bold text-sm tracking-tight">{title}</h3>
                <p className="text-xs text-white/70">{subtitle}</p>
              </div>
            </div>
            <div className="flex gap-1 relative z-10">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20 transition-all duration-200 hover:scale-110"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20 transition-all duration-200 hover:scale-110"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          {!isMinimized && (
            <>
              <ScrollArea className="flex-1 p-4 bg-linear-to-b from-slate-100 to-white" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                        message.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl p-3 shadow-sm ${
                          message.sender === "user"
                            ? "bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 text-white border border-white/10"
                            : "bg-white border border-slate-200"
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
                      <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-linear-to-r from-purple-500 to-pink-500 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-linear-to-r from-pink-500 to-purple-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                          <div className="w-2 h-2 bg-linear-to-r from-purple-500 to-pink-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-4 border-t bg-white">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    className="flex-1 rounded-xl border-slate-300 focus-visible:ring-2 focus-visible:ring-slate-400"
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="icon"
                    disabled={!inputValue.trim()}
                    className="rounded-xl bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 hover:opacity-90 transition-all duration-200 hover:scale-105 disabled:opacity-50 text-white"
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
          <div className="absolute inset-0 rounded-full bg-pink-500/20 blur-xl animate-pulse" />
          <Button
            onClick={() => setIsOpen(true)}
            size="lg"
            className={`relative h-14 w-14 rounded-full shadow-2xl bg-linear-to-br ${primaryColor} hover:scale-110 transition-all duration-300 animate-in zoom-in border border-white/10`}
          >
            <MessageCircle className="h-6 w-6 text-white" />
          </Button>
        </div>
      )}
    </div>
  );
}
