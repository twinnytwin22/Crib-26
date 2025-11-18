# Contact Form Email Setup

The contact form is now connected to Nodemailer. To enable email sending, you need to configure SMTP settings in your `.env.local` file.

## Required Environment Variables

Add these to your `.env.local` file:

```env
# SMTP Configuration for Contact Form
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM_EMAIL=your-email@gmail.com
SMTP_FROM_NAME=Crib Network
CONTACT_EMAIL=info@cribnetwork.io
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-secret
GOOGLE_CHAT_INBOUND_SECRET=shared-secret-between-chat-and-api
```

> The Supabase service role key is only needed for the new chat persistence layer. Keep it server-side only; never expose it to browsers.

> `GOOGLE_CHAT_INBOUND_SECRET` secures the `/api/chat/inbound` webhook that accepts Google Chat replies. Use any long random string and configure the same value in your Google Chat app so only trusted events are accepted.

## Gmail Setup (Recommended for Development)

1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Generate an App Password:
   - Go to Security → 2-Step Verification → App passwords
   - Select "Mail" and your device
   - Copy the 16-character password
4. Use this app password as `SMTP_PASS`

## Other SMTP Providers

### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASS=your-mailgun-password
```

### Office 365
```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

## Development Mode

If SMTP is not configured, the form will work in development mode:
- Form submissions will be logged to the console
- No actual emails will be sent
- You'll see all form data in the terminal

## What Happens When Someone Submits the Form

1. **Email to You**: You'll receive an email at `CONTACT_EMAIL` with:
   - Contact person's name and email
   - Company details
   - Company size
   - Monthly budget
   - Their message
   - Reply-to set to their email address

2. **Confirmation Email**: The user receives an automatic confirmation email thanking them for reaching out

## Testing

To test the contact form:
1. Configure your SMTP settings in `.env.local`
2. Restart your development server
3. Fill out and submit the contact form
4. Check both your inbox and the user's email

## Troubleshooting

- **Emails not sending**: Check the terminal for error messages
- **Gmail blocking**: Make sure you're using an App Password, not your regular password
- **Port issues**: Try port 465 with `secure: true` if 587 doesn't work
- **Development mode**: If you see logs in console instead of emails, check that SMTP_USER and SMTP_PASS are set
