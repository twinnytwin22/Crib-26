"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";

interface ChatDebugPanelProps {
  sessionInfo: { id?: string } | null;
  isRealtimeConnected: boolean;
  lastPolledAt?: Date;
}

type DebugMessage = {
  id: string;
  sender: "user" | "bot";
  source?: string;
  content: string;
};

export function ChatDebugPanel({
  sessionInfo,
  isRealtimeConnected,
  lastPolledAt,
}: ChatDebugPanelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState<DebugMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = useCallback(async () => {
    if (!sessionInfo?.id) return;
    
    setLoading(true);
    try {
      const response = await fetch("/api/chat/messages");
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  }, [sessionInfo?.id]);

  useEffect(() => {
    if (isVisible && sessionInfo?.id) {
      void fetchMessages();
      const interval = setInterval(() => {
        void fetchMessages();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [fetchMessages, isVisible, sessionInfo?.id]);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-20 right-20 rounded-full bg-slate-800 px-3 py-1 text-xs text-white shadow-lg hover:bg-slate-700"
      >
        🔧 Debug Chat
      </button>
    );
  }

  return (
    <Card className="fixed bottom-20 right-20 w-96 p-4 shadow-2xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Chat Debug Panel</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
        >
          ✕
        </Button>
      </div>

      <div className="space-y-3 text-xs">
        <div>
          <div className="font-medium text-slate-600">Session ID:</div>
          <code className="block rounded bg-slate-100 p-2 text-xs">
            {sessionInfo?.id || "Not created yet"}
          </code>
        </div>

        <div>
          <div className="font-medium text-slate-600">Session Cookie:</div>
          <code className="block rounded bg-slate-100 p-2 text-xs">
            {sessionInfo?.id ? "HttpOnly browser cookie" : "Not created yet"}
          </code>
        </div>

        <div className="flex items-center gap-2">
          <div className="font-medium text-slate-600">Realtime:</div>
          <Badge variant={isRealtimeConnected ? "default" : "secondary"}>
            {isRealtimeConnected ? "✓ Connected" : "✗ Disconnected"}
          </Badge>
        </div>

        {lastPolledAt && (
          <div className="text-slate-500">
            Last polled: {lastPolledAt.toLocaleTimeString()}
          </div>
        )}

        <div className="mt-4 border-t pt-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="font-medium text-slate-600">
              Messages ({messages.length}):
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchMessages}
              disabled={loading}
            >
              {loading ? "..." : "Refresh"}
            </Button>
          </div>
          <div className="max-h-48 space-y-1 overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="rounded border border-slate-200 bg-slate-50 p-2"
              >
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant={msg.sender === "user" ? "outline" : "default"}>
                    {msg.sender}
                  </Badge>
                  <Badge variant="secondary">{msg.source}</Badge>
                </div>
                <div className="mt-1 text-xs text-slate-600">
                  {msg.content.substring(0, 80)}
                  {msg.content.length > 80 && "..."}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
