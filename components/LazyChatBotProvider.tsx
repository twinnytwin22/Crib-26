"use client";

import { lazy, Suspense, useEffect, useState } from "react";

const DeferredChatBotProvider = lazy(async () => {
  const chatModule = await import("@/components/ChatBotProvider");
  return { default: chatModule.ChatBotProvider };
});

export function LazyChatBotProvider() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const revealChat = () => setIsReady(true);
    const eventOptions = { once: true, passive: true } as const;

    window.addEventListener("pointerdown", revealChat, eventOptions);
    window.addEventListener("keydown", revealChat, { once: true });

    const timeoutId = setTimeout(revealChat, 5000);

    return () => {
      window.removeEventListener("pointerdown", revealChat);
      window.removeEventListener("keydown", revealChat);
      clearTimeout(timeoutId);
    };
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <DeferredChatBotProvider />
    </Suspense>
  );
}
