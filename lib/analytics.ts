"use client";

export type MarketingEvent =
  | {
      event: "fit_check_opened";
      surface: "primary_nav" | "mobile_nav" | "footer";
    }
  | {
      event: "generate_lead";
      lead_source_surface: "contact_form" | "website_chat";
      form_id?: "intro_call";
    }
  | {
      event: "form_start";
      form_id: "intro_call" | "fit_check";
    }
  | {
      event: "form_error";
      form_id: "intro_call" | "fit_check";
      error_type: "server_error" | "network_error";
    }
  | {
      event: "fit_check_step_complete";
      form_id: "fit_check";
      step_number: 1 | 2;
    }
  | {
      event: "fit_check_scan_started";
      form_id: "fit_check";
    }
  | {
      event: "fit_check_scan_complete";
      form_id: "fit_check";
      cached: boolean;
      mobile_performance_score: number | null;
    }
  | {
      event: "fit_check_report_downloaded";
      form_id: "fit_check";
      cached: boolean;
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
