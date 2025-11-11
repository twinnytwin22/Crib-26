import puppeteer from "puppeteer";
import { generateInvoiceHtml } from "@/components/invoices/InvoiceHtmlTemplate";
import type { InvoiceDetail, CompanyBranding } from "@/integrations/supabase/types";

/**
 * Server-side function to generate PDF buffer from invoice data
 * Uses Puppeteer to convert HTML to PDF - same as the download route
 * This ensures email attachments match the downloadable invoice exactly
 */
export async function generateInvoicePdfBuffer(
  invoice: InvoiceDetail,
  branding?: CompanyBranding
): Promise<Buffer> {
  // Generate branded HTML content
  const htmlContent = generateInvoiceHtml(invoice, branding);

  // Convert HTML to PDF using Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();

  return Buffer.from(pdfBuffer);
}
