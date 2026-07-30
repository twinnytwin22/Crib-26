# CRIB measurement plan

Owner: Marketing Operations  
Implementation: Google Tag Manager → Google Analytics 4  
Primary business objective: Generate and qualify consulting leads

## Rules

- A primary lead is recorded only after the server confirms that an inquiry was delivered.
- Do not send names, email addresses, message content, or other user-entered text to GTM or GA4.
- CTA clicks, form starts, chat opens, and errors are diagnostic events—not key events.
- The first successfully delivered chat message generates one lead per page lifecycle. Later messages are engagement events.
- Test every release in GTM Preview and GA4 DebugView before publishing.

## Consent

- Consent Mode v2 defaults execute before GTM with analytics and advertising
  storage denied.
- The first-party privacy component stores the visitor's choice under
  `crib_consent_v1`.
- The component updates `analytics_storage`, `ad_storage`, `ad_user_data`, and
  `ad_personalization`.
- Necessary-only visitors remain denied for analytics and advertising.
- Visitors can reopen the square Privacy control fixed to the bottom-left and
  revise their choice.
- Consent events contain state labels only and never include identity or form
  data.

## Event contract

| Event | Trigger | Parameters | GA4 key event |
| --- | --- | --- | --- |
| `generate_lead` | Contact API confirms success | `lead_source_surface`, `form_id` when applicable | Yes |
| `form_start` | First focus inside intro-call form | `form_id` | No |
| `form_error` | Contact API or network failure | `form_id`, `error_type` | No |
| `chat_open` | Visitor opens site chat | `chat_id` | No |
| `chat_message_sent` | Chat API confirms delivery | `chat_id`, `message_number` | No |

## Allowed parameter values

- `lead_source_surface`: `contact_form`, `website_chat`
- `form_id`: `intro_call`
- `chat_id`: `sales_support`
- `error_type`: `server_error`, `network_error`

## GTM build

1. Google tag: fire on Initialization / All Pages using the CRIB GA4 measurement ID.
2. GA4 Event — Lead Generated: custom-event trigger `generate_lead`; pass `lead_source_surface` and `form_id`.
3. GA4 Event — Form Started: trigger `form_start`; pass `form_id`.
4. GA4 Event — Form Error: trigger `form_error`; pass `form_id` and `error_type`.
5. GA4 Event — Chat Opened: trigger `chat_open`; pass `chat_id`.
6. GA4 Event — Chat Message Sent: trigger `chat_message_sent`; pass `chat_id` and `message_number`.
7. Create data-layer variables for each parameter named above.

## GA4 administration

- Mark only `generate_lead` as a key event.
- Create event-scoped custom dimensions for `lead_source_surface`, `form_id`, `chat_id`, and `error_type`.
- Create an event-scoped custom metric for `message_number` only if reporting requires it.
- Define internal traffic and retain the filter in testing mode until verified.
- Link the verified Search Console domain property.

## Release QA

- Confirm exactly one `generate_lead` after a successful form request.
- Confirm no lead event after a failed form request.
- Confirm exactly one `generate_lead` after the first successful chat message.
- Confirm later successful chat messages emit `chat_message_sent` but not another lead.
- Inspect event payloads and verify that no PII is present.
- Confirm events in GTM Preview, GA4 DebugView, Realtime, and standard reports after processing.
