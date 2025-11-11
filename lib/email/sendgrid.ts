const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;
const isDevelopment = process.env.NODE_ENV === "development";

if (!SENDGRID_API_KEY || !SENDGRID_FROM_EMAIL) {
  console.warn("⚠️  SendGrid environment variables are not fully configured.");
  console.warn("Add SENDGRID_API_KEY and SENDGRID_FROM_EMAIL to .env.local");
  console.warn("See SENDGRID_SETUP.md for instructions");
}

interface SendGridMailPayload {
  personalizations: Array<{ to: Array<{ email: string; name?: string }> }>;
  from: { email: string; name?: string };
  subject: string;
  content: Array<{ type: string; value: string }>;
  attachments?: Array<{ content: string; filename: string; type: string }>;
}

export async function sendInvoiceEmail(options: {
  toEmail: string;
  toName?: string;
  subject: string;
  html: string;
  pdfBase64?: string;
  pdfFileName?: string;
}) {
  if (!SENDGRID_API_KEY || !SENDGRID_FROM_EMAIL) {
    const errorMessage = 
      "SendGrid is not configured. Please add SENDGRID_API_KEY and SENDGRID_FROM_EMAIL to your .env.local file. " +
      "See SENDGRID_SETUP.md for setup instructions.";
    
    if (isDevelopment) {
      // In development, log what would have been sent instead of throwing
      console.log("\n📧 [DEV MODE] Email would be sent:");
      console.log("To:", options.toEmail, options.toName ? `(${options.toName})` : "");
      console.log("Subject:", options.subject);
      console.log("Has PDF attachment:", !!options.pdfBase64);
      console.log("HTML preview (first 200 chars):", options.html.substring(0, 200) + "...");
      console.log("\n⚠️  To actually send emails, configure SendGrid in .env.local\n");
      return; // Don't throw in dev mode, just log
    }
    
    throw new Error(errorMessage);
  }

  const payload: SendGridMailPayload = {
    personalizations: [
      {
        to: [{ email: options.toEmail, name: options.toName }],
      },
    ],
    from: { email: SENDGRID_FROM_EMAIL },
    subject: options.subject,
    content: [
      {
        type: "text/html",
        value: options.html,
      },
    ],
  };

  if (options.pdfBase64 && options.pdfFileName) {
    payload.attachments = [
      {
        content: options.pdfBase64,
        filename: options.pdfFileName,
        type: "application/pdf",
      },
    ];
  }

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`SendGrid error: ${response.status} ${message}`);
  }
}
