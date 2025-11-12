// import { InvoiceDetail, CompanyBranding } from '@/integrations/supabase/types';
// import { format } from 'date-fns';

// interface GenerateInvoiceEmailHtmlProps {
//   invoice: InvoiceDetail;
//   branding?: CompanyBranding | null;
//   customMessage?: string;
//   pdfDownloadUrl?: string;
// }

// export const generateInvoiceEmailHtml = ({ 
//   invoice, 
//   branding,
//   customMessage,
//   pdfDownloadUrl
// }: GenerateInvoiceEmailHtmlProps): string => {
//   const issueDate = invoice.issue_date ? format(new Date(invoice.issue_date), 'MM/dd/yyyy') : 'N/A';
//   const dueDate = invoice.due_date ? format(new Date(invoice.due_date), 'MM/dd/yyyy') : 'N/A';
//   const subtotal = invoice.invoice_line_items.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);
//   const tax = invoice.tax_amount || 0;
//   const total = invoice.total;

//   // Use branding or defaults
//   const companyName = branding?.company_name || 'Your Company Name';
//   const tagline = branding?.tagline || 'Professional Services';
//   const primaryColor = branding?.primary_color || '#000000';
//   const secondaryColor = branding?.secondary_color || '#6B7280';
//   const accentColor = branding?.accent_color || '#3B82F6';
//   const textColor = branding?.text_color || '#1F2937';
//   const backgroundColor = branding?.background_color || '#FFFFFF';
//   const footerText = branding?.footer_text || 'Thank you for your business!';
//   const contactEmail = branding?.contact_email || 'info@yourcompany.com';
//   const websiteUrl = branding?.website_url;

//   const getStatusStyle = (status: string) => {
//     switch (status) {
//       case 'paid':
//         return 'background-color: #dcfce7; color: #166534;';
//       case 'draft':
//         return 'background-color: #f3f4f6; color: #374151;';
//       case 'sent':
//         return 'background-color: #dbeafe; color: #1e40af;';
//       case 'overdue':
//         return 'background-color: #fee2e2; color: #991b1b;';
//       default:
//         return 'background-color: #f3f4f6; color: #374151;';
//     }
//   };

//   return `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="utf-8" />
//       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//       <style>
//         * { margin: 0; padding: 0; box-sizing: border-box; }
//         body { 
//           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
//           font-size: 14px; 
//           line-height: 1.6; 
//           color: ${textColor}; 
//           background-color: #f3f4f6; 
//           padding: 20px;
//         }
//         .email-wrapper { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
//         .email-header { 
//           background: linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%); 
//           color: #ffffff; 
//           padding: 32px 24px; 
//           text-align: center;
//         }
//         .logo { max-width: 120px; max-height: 60px; margin-bottom: 16px; }
//         .email-header h1 { font-size: 28px; margin-bottom: 8px; }
//         .email-header p { font-size: 14px; opacity: 0.9; }
//         .email-body { padding: 32px 24px; background-color: ${backgroundColor}; }
//         .greeting { font-size: 16px; margin-bottom: 16px; color: ${textColor}; }
//         .message-box { 
//           background-color: ${backgroundColor === '#FFFFFF' ? '#f9fafb' : backgroundColor}; 
//           border-left: 4px solid ${accentColor}; 
//           padding: 16px; 
//           margin: 24px 0; 
//           border-radius: 4px;
//         }
//         .invoice-summary { 
//           background-color: ${backgroundColor === '#FFFFFF' ? '#f9fafb' : backgroundColor}; 
//           border: 2px solid ${accentColor}; 
//           border-radius: 8px; 
//           padding: 20px; 
//           margin: 24px 0;
//         }
//         .summary-row { 
//           display: flex; 
//           justify-content: space-between; 
//           padding: 8px 0; 
//           border-bottom: 1px solid ${secondaryColor}40;
//         }
//         .summary-row:last-child { border-bottom: none; }
//         .summary-label { font-weight: 600; color: ${secondaryColor}; }
//         .summary-value { color: ${textColor}; }
//         .total-row { 
//           margin-top: 16px; 
//           padding-top: 16px; 
//           border-top: 2px solid ${accentColor}; 
//           font-size: 18px; 
//           font-weight: bold;
//         }
//         .total-row .summary-label { color: ${primaryColor}; }
//         .total-row .summary-value { color: ${primaryColor}; }
//         .status-badge { 
//           display: inline-block; 
//           padding: 6px 12px; 
//           border-radius: 20px; 
//           font-size: 12px; 
//           font-weight: 600; 
//           text-transform: uppercase; 
//           ${getStatusStyle(invoice.status)}
//         }
//         .cta-button { 
//           display: inline-block; 
//           background-color: ${primaryColor}; 
//           color: #ffffff; 
//           padding: 14px 28px; 
//           text-decoration: none; 
//           border-radius: 6px; 
//           font-weight: 600; 
//           margin: 20px 0;
//           text-align: center;
//         }
//         .cta-button:hover { opacity: 0.9; }
//         .invoice-details { 
//           background-color: ${backgroundColor === '#FFFFFF' ? '#f9fafb' : backgroundColor}; 
//           padding: 16px; 
//           border-radius: 8px; 
//           margin: 16px 0;
//         }
//         .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
//         .detail-item { margin-bottom: 8px; }
//         .detail-label { 
//           font-size: 11px; 
//           text-transform: uppercase; 
//           font-weight: 700; 
//           color: ${secondaryColor}; 
//           margin-bottom: 4px;
//         }
//         .detail-value { color: ${textColor}; }
//         .line-items { margin: 24px 0; }
//         .line-items table { width: 100%; border-collapse: collapse; }
//         .line-items th { 
//           background-color: ${primaryColor}; 
//           color: #ffffff; 
//           padding: 10px; 
//           text-align: left; 
//           font-size: 11px; 
//           text-transform: uppercase;
//         }
//         .line-items td { 
//           padding: 10px; 
//           border-bottom: 1px solid ${secondaryColor}40; 
//           color: ${textColor};
//         }
//         .line-items tr:nth-child(even) { background-color: ${backgroundColor === '#FFFFFF' ? '#f9fafb' : backgroundColor}; }
//         .text-right { text-align: right; }
//         .email-footer { 
//           background-color: ${backgroundColor === '#FFFFFF' ? '#f9fafb' : backgroundColor}; 
//           padding: 24px; 
//           text-align: center; 
//           color: ${secondaryColor}; 
//           font-size: 12px; 
//           border-top: 1px solid ${secondaryColor}40;
//         }
//         .email-footer p { margin: 8px 0; }
//         .email-footer a { color: ${accentColor}; text-decoration: none; }
//         @media only screen and (max-width: 600px) {
//           .details-grid { grid-template-columns: 1fr; }
//         }
//       </style>
//     </head>
//     <body>
//       <div class="email-wrapper">
//         <!-- Header -->
//         <div class="email-header">
//           ${branding?.logo_url ? `<img src="${branding.logo_url}" alt="${companyName}" class="logo" />` : ''}
//           <h1>${companyName}</h1>
//           <p>${tagline}</p>
//         </div>

//         <!-- Body -->
//         <div class="email-body">
//           <p class="greeting">Hello ${invoice.clients?.name || 'there'},</p>
          
//           ${customMessage ? `
//             <div class="message-box">
//               <p>${customMessage}</p>
//             </div>
//           ` : `
//             <p>Thank you for your business! Please find your invoice details below.</p>
//           `}

//           ${pdfDownloadUrl ? `
//             <div style="text-align: center; margin: 24px 0;">
//               <a href="${pdfDownloadUrl}" class="cta-button" style="color: #ffffff;">
//                 📄 Download Invoice PDF
//               </a>
//               <p style="font-size: 12px; color: ${secondaryColor}; margin-top: 8px;">
//                 Click the button above to download a PDF copy of your invoice
//               </p>
//             </div>
//           ` : ''}

//           <!-- Invoice Summary -->
//           <div class="invoice-summary">
//             <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
//               <div>
//                 <h2 style="color: ${primaryColor}; margin: 0; font-size: 20px;">Invoice #${invoice.invoice_number}</h2>
//                 <div style="margin-top: 8px;">
//                   <span class="status-badge">${invoice.status.toUpperCase()}</span>
//                 </div>
//               </div>
//             </div>
            
//             <div class="summary-row">
//               <span class="summary-label">Issue Date:</span>
//               <span class="summary-value">${issueDate}</span>
//             </div>
//             <div class="summary-row">
//               <span class="summary-label">Due Date:</span>
//               <span class="summary-value">${dueDate}</span>
//             </div>
//             <div class="summary-row">
//               <span class="summary-label">Payment Terms:</span>
//               <span class="summary-value">Net ${invoice.payment_terms || 30} days</span>
//             </div>
            
//             <div class="total-row summary-row">
//               <span class="summary-label">Amount Due:</span>
//               <span class="summary-value">$${total.toFixed(2)}</span>
//             </div>
//           </div>

//           <!-- Line Items -->
//           <div class="line-items">
//             <h3 style="color: ${primaryColor}; margin-bottom: 12px;">Invoice Details</h3>
//             <table>
//               <thead>
//                 <tr>
//                   <th>Description</th>
//                   <th class="text-right">Qty</th>
//                   <th class="text-right">Rate</th>
//                   <th class="text-right">Amount</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 ${invoice.invoice_line_items.map(item => `
//                   <tr>
//                     <td>${item.description}</td>
//                     <td class="text-right">${item.quantity}</td>
//                     <td class="text-right">$${item.unit_price.toFixed(2)}</td>
//                     <td class="text-right">$${(item.quantity * item.unit_price).toFixed(2)}</td>
//                   </tr>
//                 `).join('')}
//               </tbody>
//             </table>
//           </div>

//           <!-- Totals -->
//           <div style="text-align: right; margin: 24px 0;">
//             <table style="margin-left: auto; min-width: 250px;">
//               <tr>
//                 <td style="padding: 8px; color: ${textColor};">Subtotal:</td>
//                 <td style="padding: 8px; text-align: right; color: ${textColor};">$${subtotal.toFixed(2)}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 8px; color: ${textColor};">Tax:</td>
//                 <td style="padding: 8px; text-align: right; color: ${textColor};">$${tax.toFixed(2)}</td>
//               </tr>
//               <tr style="border-top: 2px solid ${accentColor};">
//                 <td style="padding: 12px 8px; font-weight: bold; font-size: 18px; color: ${primaryColor};">Total:</td>
//                 <td style="padding: 12px 8px; font-weight: bold; font-size: 18px; text-align: right; color: ${primaryColor};">$${total.toFixed(2)}</td>
//               </tr>
//             </table>
//           </div>

//           ${invoice.notes ? `
//             <div class="invoice-details">
//               <p class="detail-label">Notes:</p>
//               <p style="color: ${textColor}; white-space: pre-wrap;">${invoice.notes}</p>
//             </div>
//           ` : ''}

//           <p style="margin-top: 32px; color: ${secondaryColor};">
//             The complete invoice is attached as a PDF for your records.
//           </p>
//         </div>

//         <!-- Footer -->
//         <div class="email-footer">
//           <p><strong>${footerText}</strong></p>
//           <p>Questions? Contact us at <a href="mailto:${contactEmail}">${contactEmail}</a></p>
//           ${websiteUrl ? `<p><a href="${websiteUrl}">${websiteUrl}</a></p>` : ''}
//           <p style="margin-top: 16px; font-size: 11px; color: ${secondaryColor};">
//             This is an automated email from ${companyName}. Please do not reply directly to this message.
//           </p>
//         </div>
//       </div>
//     </body>
//     </html>
//   `;
// };
