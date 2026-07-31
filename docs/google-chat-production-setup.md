# Google Chat and business email production setup

This application uses three deliberately separate identities:

1. A browser session cookie identifies one website visitor conversation.
2. A Google Chat service account posts as the Chat app and reads public replies
   in the configured internal space.
3. A Google Workspace mailbox sends email through SMTP with an app password.

Keeping these separate means a Chat read-approval problem cannot stop website
messages or email notifications.

## Required Google Chat scopes

Use only these scopes:

- `https://www.googleapis.com/auth/chat.bot`
  - Used to post website messages as the Chat app.
  - Self-authorized; it does not require administrator approval.
- `https://www.googleapis.com/auth/chat.app.messages.readonly`
  - Used to list public human replies in the configured space.
  - Requires one-time Google Workspace administrator approval.

Do not add Gmail scopes or domain-wide delegation for this implementation.
Email is configured separately through SMTP.

## 1. Finish revoking the exposed credential

In Google Cloud Console, open IAM & Admin > Service Accounts, select the old
service account, open Keys, and verify that the exposed key is deleted or
disabled. Remove the old value from every hosting environment and redeploy.

If the key existed in Git history, deleting the working-tree file does not
remove it from history. Revocation is the immediate protection. History cleanup
can be handled separately without delaying recovery.

## 2. Create the replacement service account

Use the same Google Cloud project that owns the Google Chat app:

1. Enable **Google Chat API** and **Google Workspace Marketplace SDK**.
2. Go to IAM & Admin > Service Accounts > Create service account.
3. Name it `crib-support-chat`.
4. Do not grant project IAM roles; Chat access is controlled by OAuth scopes
   and membership in the Chat space.
5. Open the service account > Keys > Add key > Create new key > JSON.
6. Put the JSON in the hosting provider's encrypted environment variable named
   `GOOGLE_CHAT_SERVICE_ACCOUNT_JSON`.
7. Delete the downloaded local JSON after the deployed secret is confirmed.
8. Remove any old `GOOGLE_CHAT_BOT_TOKEN`; OAuth access tokens expire and
   should not be treated as deployment credentials.

Never put the JSON file or any of its fields in source control, build logs,
client-side variables, or variables prefixed with `NEXT_PUBLIC_`.

## 3. Configure the Google Chat app

In APIs & Services > Google Chat API > Configuration:

1. Set the app name, avatar, and description.
2. Enable interactive features and **Join spaces and group conversations**.
3. Choose **HTTP endpoint URL**.
4. Set the endpoint to:

   `https://YOUR_DOMAIN/api/chat/inbound?secret=YOUR_RANDOM_INBOUND_SECRET`

5. Set the same random value as the server-only
   `GOOGLE_CHAT_INBOUND_SECRET`.
6. During testing, restrict visibility to your Workspace user or a test group.
7. Save the configuration.

Add the Chat app itself to the internal support space. A service account token
does not replace Chat-space membership.

Set `GOOGLE_CHAT_SPACE` to the canonical resource name, for example
`spaces/AAAA1234567`. Do not use the space display name.

Interaction events only cover messages that invoke the app, such as @mentions.
Normal human replies in a support thread are recovered through the
admin-approved message-list scope, which is why the next step is required.

## 4. Approve public reply reading

The `chat.app.messages.readonly` scope is an app-authentication scope and does
not use normal user consent or domain-wide delegation.

1. Open IAM & Admin > Service Accounts.
2. Select `crib-support-chat` > Advanced settings.
3. Click **Create Google Workspace Marketplace-compatible OAuth client**.
4. Open Google Workspace Marketplace SDK > App Configuration.
5. Set visibility to **Private**.
6. Choose **Individual + admin install**.
7. Select the **Chat app** integration.
8. Add exactly this OAuth scope:

   `https://www.googleapis.com/auth/chat.app.messages.readonly`

9. Do not add `chat.bot` to the Marketplace SDK scope list.
10. Save the draft.
11. In the Google Admin console, grant the Chat app one-time authorization for
    the requested scope.

A 403 response saying that an administrator must grant the required OAuth
scope means this step is incomplete. Outbound messages should continue working
because write and read tokens are isolated in the code.

## 5. Connect the owner availability status

Availability uses **user OAuth**, not the Chat app service account. It reads
only the Google Chat™ availability of the Workspace account that authorizes it.

1. In Google Cloud Console > Google Auth platform, create a **Web application**
   OAuth client for this project.
2. Add this scope to the OAuth consent screen and Google Workspace Marketplace
   SDK configuration:

   `https://www.googleapis.com/auth/chat.users.availability.readonly`

3. Complete one authorization as the internal account whose status should be
   shown. Request offline access and store the resulting refresh token only in
   the encrypted `GOOGLE_CHAT_AVAILABILITY_REFRESH_TOKEN` environment variable.
4. Set `GOOGLE_CHAT_AVAILABILITY_CLIENT_ID` and
   `GOOGLE_CHAT_AVAILABILITY_CLIENT_SECRET` from that OAuth client, then
   redeploy.
5. In Google Chat™, send `/status` to CRIB Support. It must report only that
   authorized account's state. The protected
   `GET /api/chat/availability` diagnostic endpoint returns the same data when
   called with the `x-chat-diagnostics-secret` header.

Do not use domain-wide delegation or add scopes for other users' availability.
If this authorization fails, website chat delivery and support-thread sync stay
available.

## 6. Configure business email

For the Workspace mailbox in `SMTP_USER`:

1. Enable 2-Step Verification.
2. Create a Google app password for the website.
3. Store the 16-character app password as the encrypted `SMTP_PASS` value.
4. Set `SMTP_FROM_EMAIL`, `CHAT_FORWARD_EMAIL`, and `CONTACT_EMAIL` to approved
   mailbox addresses.

The app password is not the Google account password and is not the Chat service
account key. If Workspace policy disables app passwords, use a transactional
SMTP provider instead; the application already supports standard SMTP.

## 7. Deploy and verify without exposing secrets

Copy the variable names from `.env.example` into the hosting provider, fill
their values there, and redeploy.

Then verify in this order:

1. Send a first website message. A new Google Chat thread should appear.
2. Send a second website message from the same browser. It should land in the
   same thread.
3. Open the website in a private window and send a message. It should create a
   different thread.
4. Reply normally inside the first Google Chat thread. Within the widget's poll
   interval, the reply should appear only in the first browser conversation.
5. Submit the contact form and verify both the team notification and visitor
   confirmation email.

The browser conversation cookie now has a rolling one-year lifetime. Supabase
remains the durable source of truth. Clearing cookies or switching browsers
creates a new visitor identity; cross-device identity would require website
login and is intentionally outside the anonymous-widget design.

## Diagnostics

`GET /api/chat/diagnostics` performs separate checks for:

- `outboundAppAccess`: `chat.bot` access and Chat-space membership.
- `publicReplyReadAccess`: administrator-approved public message reading.

Authorize it with the `x-chat-diagnostics-secret` header whose value matches
`GOOGLE_CHAT_INBOUND_SECRET`. Avoid putting that secret in a query string.
The response reports status and sanitized errors, never Chat message content.

## Deferred goals after Marketplace review

- Add an owner-only OAuth connection using
  `https://www.googleapis.com/auth/chat.users.availability.readonly`.
- Expose Workspace availability through a dedicated server route with a short
  cache and an `unavailable` fallback. Presence must never block message
  delivery or thread synchronization.
- Add the availability scope consistently to the OAuth consent screen and
  Marketplace SDK before enabling the feature.
- Rotate `GOOGLE_CHAT_INBOUND_SECRET` in both the deployed environment and the
  Google Chat endpoint configuration before production rollout.
- Run the production verification sequence above after Marketplace approval,
  then enable the integration gradually while watching diagnostics and logs.
