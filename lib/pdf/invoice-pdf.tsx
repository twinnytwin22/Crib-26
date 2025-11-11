import React from "react";
import { renderToStream } from "@react-pdf/renderer";
import InvoicePdfDocument from "@/components/invoices/InvoicePdfDocument";
import type { InvoiceDetail, CompanyBranding } from "@/integrations/supabase/types";

export async function buildInvoicePdf(
  invoice: InvoiceDetail,
  branding?: CompanyBranding
): Promise<Buffer> {
  // Render PDF to stream
  const stream = await renderToStream(
    <InvoicePdfDocument invoice={invoice} branding={branding} />
  );
  
  // Convert readable stream to buffer
  const chunks: Buffer[] = [];
  
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk: Buffer) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}