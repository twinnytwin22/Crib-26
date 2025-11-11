import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM_EMAIL = process.env.SMTP_FROM_EMAIL || SMTP_USER;
const SMTP_FROM_NAME = process.env.SMTP_FROM_NAME || 'Your Company';
const isDevelopment = process.env.NODE_ENV === 'development';

if (!SMTP_USER || !SMTP_PASS) {
  console.warn('⚠️  SMTP credentials are not configured.');
  console.warn('Add SMTP_USER and SMTP_PASS to .env.local');
  console.warn('See NODEMAILER_SETUP.md for instructions');
}

// Create reusable transporter
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter && SMTP_USER && SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }
  return transporter;
}

/**
 * Send invoice email with PDF attachment using Nodemailer
 */
export async function sendInvoiceEmail(options: {
  toEmail: string;
  toName?: string;
  subject: string;
  html: string;
  pdfBase64?: string;
  pdfFileName?: string;
}) {
  if (!SMTP_USER || !SMTP_PASS) {
    const errorMessage = 
      'SMTP is not configured. Please add SMTP_USER and SMTP_PASS to your .env.local file. ' +
      'See NODEMAILER_SETUP.md for setup instructions.';
    
    if (isDevelopment) {
      // In development, log what would have been sent instead of throwing
      console.log('\n📧 [DEV MODE] Email would be sent via SMTP:');
      console.log('From:', SMTP_FROM_EMAIL, SMTP_FROM_NAME ? `(${SMTP_FROM_NAME})` : '');
      console.log('To:', options.toEmail, options.toName ? `(${options.toName})` : '');
      console.log('Subject:', options.subject);
      console.log('Has PDF attachment:', !!options.pdfBase64);
      console.log('HTML preview (first 200 chars):', options.html.substring(0, 200) + '...');
      console.log('\n⚠️  To actually send emails, configure SMTP in .env.local\n');
      return; // Don't throw in dev mode, just log
    }
    
    throw new Error(errorMessage);
  }

  try {
    const transport = getTransporter();
    if (!transport) {
      throw new Error('Failed to create email transport');
    }

    const mailOptions: nodemailer.SendMailOptions = {
      from: {
        name: SMTP_FROM_NAME,
        address: SMTP_FROM_EMAIL!,
      },
      to: options.toName 
        ? `"${options.toName}" <${options.toEmail}>`
        : options.toEmail,
      subject: options.subject,
      html: options.html,
    };

    // Add PDF attachment if provided
    if (options.pdfBase64 && options.pdfFileName) {
      mailOptions.attachments = [
        {
          filename: options.pdfFileName,
          content: options.pdfBase64,
          encoding: 'base64',
          contentType: 'application/pdf',
        },
      ];
    }

    // Send email
    const info = await transport.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully:', info.messageId);
    
    return info;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw error;
  }
}

/**
 * Verify SMTP connection (useful for testing)
 */
export async function verifySmtpConnection(): Promise<boolean> {
  if (!SMTP_USER || !SMTP_PASS) {
    return false;
  }

  try {
    const transport = getTransporter();
    if (!transport) {
      return false;
    }

    await transport.verify();
    console.log('✅ SMTP connection verified');
    return true;
  } catch (error) {
    console.error('❌ SMTP connection failed:', error);
    return false;
  }
}
