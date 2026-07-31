"use client";

import { lazy, Suspense } from "react";

const DeferredChatBotProvider = lazy(async () => {
  const chatModule = await import("@/components/ChatBotProvider");
  return { default: chatModule.ChatBotProvider };
});

export function LazyChatBotProvider() {
  return (
    <Suspense fallback={null}>
      <DeferredChatBotProvider />
    </Suspense>
  );
}
