import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { verifyRecaptcha } from '@/lib/recaptcha';

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM_EMAIL = process.env.SMTP_FROM_EMAIL || SMTP_USER;
const SMTP_FROM_NAME = process.env.SMTP_FROM_NAME || 'Crib Network';
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'info@cribnetwork.io';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, companySize, budget, message, recaptchaToken } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const verified = await verifyRecaptcha(
      recaptchaToken,
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? req.headers.get('x-real-ip')
    );
    if (!verified) {
      return NextResponse.json(
        { error: 'reCAPTCHA verification failed. Please try again.' },
        { status: 403 }
      );
    }

    // Check if SMTP is configured
    if (!SMTP_USER || !SMTP_PASS) {
      console.log('📧 [DEV MODE] Contact form submission:');
      console.log('Name:', name);
      console.log('Email:', email);
      console.log('Company:', company);
      console.log('Company Size:', companySize);
      console.log('Budget:', budget);
      console.log('Message:', message);
      console.log('\n⚠️  To actually send emails, configure SMTP in .env.local\n');
      
      return NextResponse.json({ 
        success: true, 
        message: 'Development mode: Form data logged to console' 
      });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    // Email HTML template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #be123c 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .field { margin-bottom: 20px; }
            .field-label { font-weight: bold; color: #be123c; margin-bottom: 5px; }
            .field-value { padding: 10px; background: white; border-left: 3px solid #be123c; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Contact Form Submission</h1>
              <p>From Crib Website</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="field-label">Name:</div>
                <div class="field-value">${name}</div>
              </div>
              
              <div class="field">
                <div class="field-label">Email:</div>
                <div class="field-value"><a href="mailto:${email}">${email}</a></div>
              </div>
              
              ${company ? `
              <div class="field">
                <div class="field-label">Company:</div>
                <div class="field-value">${company}</div>
              </div>
              ` : ''}
              
              ${companySize ? `
              <div class="field">
                <div class="field-label">Company Size:</div>
                <div class="field-value">${companySize}</div>
              </div>
              ` : ''}
              
              ${budget ? `
              <div class="field">
                <div class="field-label">Monthly Budget:</div>
                <div class="field-value">${budget}</div>
              </div>
              ` : ''}
              
              ${message ? `
              <div class="field">
                <div class="field-label">Message:</div>
                <div class="field-value">${message.replace(/\n/g, '<br>')}</div>
              </div>
              ` : ''}
              
              <div class="footer">
                <p>This email was sent from the Crib contact form.</p>
                <p>Received on ${new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email to your contact email
    await transporter.sendMail({
      from: {
        name: SMTP_FROM_NAME,
        address: SMTP_FROM_EMAIL!,
      },
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: htmlContent,
    });

    // Optional: Send confirmation email to the user
    const confirmationHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #be123c 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #be123c; color: white; text-decoration: none; border-radius: 25px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thanks for reaching out!</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Thank you for contacting Crib! We've received your message and will get back to you within 24 hours.</p>
              <p>In the meantime, feel free to explore more about what we do at <a href="https://cribnetwork.io">cribnetwork.io</a>.</p>
              <p style="margin-top: 30px;">Best regards,<br><strong>The Crib Team</strong></p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: {
        name: SMTP_FROM_NAME,
        address: SMTP_FROM_EMAIL!,
      },
      to: email,
      subject: 'Thanks for contacting Crib!',
      html: confirmationHtml,
    });

    console.log('✅ Contact form email sent successfully');

    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully' 
    });

  } catch (error) {
    console.error('❌ Failed to send contact form email:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}
