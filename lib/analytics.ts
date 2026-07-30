"use client";

export type MarketingEvent =
  | {
      event: "generate_lead";
      lead_source_surface: "contact_form" | "website_chat";
      form_id?: "intro_call";
    }
  | {
      event: "form_start";
      form_id: "intro_call";
    }
  | {
      event: "form_error";
      form_id: "intro_call";
      error_type: "server_error" | "network_error";
    }
  | {
      event: "chat_open";
      chat_id: "sales_support";
    }
  | {
      event: "chat_message_sent";
      chat_id: "sales_support";
      message_number: number;
    };

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

/**
 * Pushes a deliberately PII-free marketing event to the GTM data layer.
 * Never add names, email addresses, message content, or other user-entered text.
 */
export function trackMarketingEvent(event: MarketingEvent) {
  if (typeof window === "undefined") {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
}
