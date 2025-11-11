import { stripe } from "@/lib/stripe/server";
import { getSupabaseServer } from "@/lib/supabase/server-client";
import type { Database } from "@/integrations/supabase/types";
import Stripe from "stripe";

type SupabaseClient = ReturnType<typeof getSupabaseServer>;
type InvoiceRow = Database["public"]["Tables"]["invoices"]["Row"];
type ClientRow = Database["public"]["Tables"]["clients"]["Row"];
type LineItemInsert = Database["public"]["Tables"]["invoice_line_items"]["Insert"];
type PaymentInsert = Database["public"]["Tables"]["payments"]["Insert"];

export interface SyncResult {
  success: boolean;
  message: string;
  invoice_id?: string;
  stripe_invoice_id?: string;
  error?: string;
}

export interface SyncOptions {
  userId: string;
  overwriteExisting?: boolean;
  createMissingClients?: boolean;
}

/**
 * Sync a single Stripe invoice to Supabase
 */
export async function syncStripeInvoiceToSupabase(
  stripeInvoiceId: string,
  options: SyncOptions
): Promise<SyncResult> {
  const supabase = getSupabaseServer();
  
  try {
    // Fetch the Stripe invoice with all details
    const stripeInvoice = await stripe.invoices.retrieve(stripeInvoiceId, {
      expand: [
        'customer',
        'lines.data.price.product',
        'payment_intent'
      ]
    });

    // Check if already synced
    const { data: existingInvoice } = await supabase
      .from("invoices")
      .select("id, invoice_number")
      .eq("stripe_invoice_id", stripeInvoiceId)
      .single();

    if (existingInvoice && !options.overwriteExisting) {
      return {
        success: true,
        message: `Invoice already synced: ${existingInvoice.invoice_number}`,
        invoice_id: existingInvoice.id,
        stripe_invoice_id: stripeInvoiceId,
      };
    }

    // Get or create customer in Supabase
    const clientResult = await syncStripeCustomerToSupabase(
      stripeInvoice.customer as Stripe.Customer,
      options.userId,
      supabase
    );

    if (!clientResult.success || !clientResult.client_id) {
      return {
        success: false,
        message: "Failed to sync customer",
        error: clientResult.error,
      };
    }

    // Calculate invoice totals
    const lineItems = stripeInvoice.lines.data;
    const subtotal = stripeInvoice.subtotal / 100;
    const taxAmount = (stripeInvoice.total - stripeInvoice.subtotal) / 100;
    const total = stripeInvoice.total / 100;

    // Prepare invoice data
    const invoiceData = {
      user_id: options.userId,
      client_id: clientResult.client_id,
      invoice_number: stripeInvoice.number || `STRIPE-${stripeInvoice.id.slice(-8)}`,
      issue_date: new Date(stripeInvoice.created * 1000).toISOString().split('T')[0],
      due_date: stripeInvoice.due_date 
        ? new Date(stripeInvoice.due_date * 1000).toISOString().split('T')[0]
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      status: mapStripeStatusToSupabase(stripeInvoice.status),
      notes: stripeInvoice.description || `Imported from Stripe (${stripeInvoice.id})`,
      subtotal,
      tax_amount: taxAmount,
      tax_rate: taxAmount > 0 ? (taxAmount / subtotal) * 100 : 0,
      total,
      stripe_invoice_id: stripeInvoice.id,
    };

    // Insert or update invoice
    let supabaseInvoiceId: string;
    
    if (existingInvoice) {
      // Update existing
      const { error: updateError } = await supabase
        .from("invoices")
        .update(invoiceData)
        .eq("id", existingInvoice.id);

      if (updateError) throw updateError;
      supabaseInvoiceId = existingInvoice.id;

      // Clear existing line items and payments
      await supabase.from("invoice_line_items").delete().eq("invoice_id", existingInvoice.id);
      await supabase.from("payments").delete().eq("invoice_id", existingInvoice.id);
    } else {
      // Create new
      const { data: newInvoice, error: insertError } = await supabase
        .from("invoices")
        .insert([invoiceData])
        .select("id")
        .single();

      if (insertError || !newInvoice) throw insertError;
      supabaseInvoiceId = newInvoice.id;
    }

    // Sync line items
    const lineItemsToInsert: LineItemInsert[] = lineItems.map((item, index) => ({
      invoice_id: supabaseInvoiceId,
      description: item.description || 'Imported line item',
      quantity: item.quantity || 1,
      unit_price: (item.amount / 100) / (item.quantity || 1),
      amount: item.amount / 100,
      sort_order: index,
    }));

    if (lineItemsToInsert.length > 0) {
      const { error: lineItemsError } = await supabase
        .from("invoice_line_items")
        .insert(lineItemsToInsert);

      if (lineItemsError) throw lineItemsError;
    }

    // Sync payments if any
    if (stripeInvoice.amount_paid > 0) {
      const paymentData: PaymentInsert = {
        invoice_id: supabaseInvoiceId,
        amount: stripeInvoice.amount_paid / 100,
        status: "paid",
        scheduled_date: new Date().toISOString().split('T')[0],
        paid_date: new Date().toISOString(),
        notes: "Payment from Stripe",
        stripe_payment_intent_id: null, // Will be populated when payments are processed
      };

      const { error: paymentError } = await supabase
        .from("payments")
        .insert([paymentData]);

      if (paymentError) throw paymentError;
    }

    return {
      success: true,
      message: `Successfully synced invoice: ${invoiceData.invoice_number}`,
      invoice_id: supabaseInvoiceId,
      stripe_invoice_id: stripeInvoice.id,
    };

  } catch (error) {
    console.error("Error syncing Stripe invoice:", error);
    return {
      success: false,
      message: "Failed to sync invoice from Stripe",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Sync multiple Stripe invoices to Supabase
 */
export async function syncMultipleStripeInvoices(
  stripeInvoiceIds: string[],
  options: SyncOptions
): Promise<SyncResult[]> {
  const results: SyncResult[] = [];

  for (const invoiceId of stripeInvoiceIds) {
    const result = await syncStripeInvoiceToSupabase(invoiceId, options);
    results.push(result);
  }

  return results;
}

/**
 * Sync all recent Stripe invoices to Supabase
 */
export async function syncAllRecentStripeInvoices(
  options: SyncOptions & { limit?: number; daysBack?: number }
): Promise<{ results: SyncResult[]; total: number }> {
  const limit = options.limit || 50;
  const daysBack = options.daysBack || 30;
  const createdAfter = Math.floor((Date.now() - (daysBack * 24 * 60 * 60 * 1000)) / 1000);

  try {
    const stripeInvoices = await stripe.invoices.list({
      limit,
      created: { gte: createdAfter },
    });

    const results = await syncMultipleStripeInvoices(
      stripeInvoices.data.map(inv => inv.id),
      options
    );

    return {
      results,
      total: stripeInvoices.data.length,
    };
  } catch (error) {
    console.error("Error syncing recent Stripe invoices:", error);
    return {
      results: [{
        success: false,
        message: "Failed to fetch invoices from Stripe",
        error: error instanceof Error ? error.message : "Unknown error",
      }],
      total: 0,
    };
  }
}

/**
 * Sync Stripe customer to Supabase clients table
 */
async function syncStripeCustomerToSupabase(
  stripeCustomer: Stripe.Customer,
  userId: string,
  supabase: SupabaseClient
): Promise<{ success: boolean; client_id?: string; error?: string }> {
  try {
    // Check if customer already exists
    const { data: existingClient } = await supabase
      .from("clients")
      .select("id")
      .eq("email", stripeCustomer.email || "")
      .eq("user_id", userId)
      .single();

    if (existingClient) {
      return { success: true, client_id: existingClient.id };
    }

    // Create new client
    const clientData = {
      user_id: userId,
      name: stripeCustomer.name || stripeCustomer.email || "Unknown Customer",
      email: stripeCustomer.email || "",
      company: stripeCustomer.description || null,
      address: stripeCustomer.address ? 
        `${stripeCustomer.address.line1 || ""} ${stripeCustomer.address.line2 || ""} ${stripeCustomer.address.city || ""} ${stripeCustomer.address.state || ""} ${stripeCustomer.address.postal_code || ""}`.trim() 
        : null,
      phone: stripeCustomer.phone || null,
    };

    const { data: newClient, error } = await supabase
      .from("clients")
      .insert([clientData])
      .select("id")
      .single();

    if (error || !newClient) {
      throw new Error(error?.message || "Failed to create client");
    }

    return { success: true, client_id: newClient.id };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Map Stripe invoice status to Supabase status
 */
function mapStripeStatusToSupabase(stripeStatus: string): Database["public"]["Enums"]["invoice_status"] {
  switch (stripeStatus) {
    case "draft":
      return "draft";
    case "open":
      return "sent";
    case "paid":
      return "paid";
    case "void":
    case "uncollectible":
      return "cancelled";
    default:
      return "draft";
  }
}

/**
 * Get Stripe invoices that haven't been synced to Supabase
 */
export async function getUnsyncedStripeInvoices(userId: string): Promise<{
  unsynced: string[];
  total_stripe: number;
  total_synced: number;
}> {
  try {
    const supabase = getSupabaseServer();

    // Get all Stripe invoice IDs from Supabase
    const { data: syncedInvoices } = await supabase
      .from("invoices")
      .select("stripe_invoice_id")
      .eq("user_id", userId)
      .not("stripe_invoice_id", "is", null);

    const syncedIds = new Set(
      syncedInvoices?.map(inv => inv.stripe_invoice_id).filter(Boolean) || []
    );

    // Get recent Stripe invoices
    const stripeInvoices = await stripe.invoices.list({ limit: 100 });
    const allStripeIds = stripeInvoices.data.map(inv => inv.id);

    const unsyncedIds = allStripeIds.filter(id => !syncedIds.has(id));

    return {
      unsynced: unsyncedIds,
      total_stripe: allStripeIds.length,
      total_synced: syncedIds.size,
    };
  } catch (error) {
    console.error("Error getting unsynced invoices:", error);
    return {
      unsynced: [],
      total_stripe: 0,
      total_synced: 0,
    };
  }
}