import Stripe from 'stripe';
import { getSupabaseServer } from '@/lib/supabase/server-client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia' as any,
  typescript: true,
});

interface PaymentPlanAmount {
  amount: number;
  days_until_due?: number;
  due_date?: number;
  description: string;
}

interface CreateInvoiceWithPlanParams {
  customerId: string;
  customerEmail: string;
  lineItems: Array<{
    price_data: {
      currency: string;
      product_data: {
        name: string;
        description?: string;
      };
      unit_amount: number;
      tax_behavior?: 'exclusive' | 'inclusive' | 'unspecified';
    };
    quantity: number;
  }>;
  paymentPlan?: PaymentPlanAmount[];
  metadata?: Record<string, string>;
  daysUntilDue?: number;
}

export async function createStripeInvoiceWithPaymentPlan(
  params: CreateInvoiceWithPlanParams
): Promise<Stripe.Invoice> {
  const { customerId, customerEmail, lineItems, paymentPlan, metadata, daysUntilDue } = params;

  // Ensure customer exists in Stripe
  let stripeCustomer: Stripe.Customer;
  try {
    const customer = await stripe.customers.retrieve(customerId);
    if ('deleted' in customer && customer.deleted) {
      throw new Error('Customer was deleted');
    }
    stripeCustomer = customer as Stripe.Customer;
  } catch (error) {
    // Create customer if doesn't exist
    stripeCustomer = await stripe.customers.create({
      email: customerEmail,
      metadata: metadata || {},
    });
  }

  // Create invoice with payment plan
  const invoiceParams: Stripe.InvoiceCreateParams = {
    customer: stripeCustomer.id,
    collection_method: 'send_invoice',
    auto_advance: true,
    days_until_due: daysUntilDue || 30,
    metadata: metadata || {},
  };

  // Add payment plan if provided
  if (paymentPlan && paymentPlan.length > 0) {
    (invoiceParams as any).amounts_due = paymentPlan.map((amount) => ({
      amount: amount.amount,
      days_until_due: amount.days_until_due,
      due_date: amount.due_date,
      description: amount.description,
    }));
  }

  const invoice = await stripe.invoices.create(invoiceParams, {
    headers: paymentPlan && paymentPlan.length > 0 ? {
      'Stripe-Version': '2024-11-20.acacia; invoice_payment_plans_beta=v1',
    } : undefined,
  } as any);

  // Add line items
  for (const item of lineItems) {
    await stripe.invoiceItems.create({
      customer: stripeCustomer.id,
      invoice: invoice.id,
      price_data: {
        ...item.price_data,
        product_data: {
          name: item.price_data.product_data.name,
          ...(item.price_data.product_data.description && { description: item.price_data.product_data.description }),
        },
      } as any,
      quantity: item.quantity,
    });
  }

  // Finalize invoice
  const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);

  return finalizedInvoice;
}

export async function updateStripeInvoicePaymentPlan(
  invoiceId: string,
  paymentPlan: PaymentPlanAmount[]
): Promise<Stripe.Invoice> {
  const updateParams: any = {
    amounts_due: paymentPlan.map((amount) => ({
      amount: amount.amount,
      days_until_due: amount.days_until_due,
      due_date: amount.due_date,
      description: amount.description,
    })),
  };

  return await stripe.invoices.update(invoiceId, updateParams, {
    headers: {
      'Stripe-Version': '2024-11-20.acacia; invoice_payment_plans_beta=v1',
    },
  } as any);
}

export async function syncInvoiceToSupabase(
  stripeInvoice: Stripe.Invoice,
  supabaseInvoiceId: string,
  userId: string
) {
  const supabase = getSupabaseServer();

  // Update invoice with Stripe data
  const { error: invoiceError } = await supabase
    .from('invoices')
    .update({
      stripe_invoice_id: stripeInvoice.id,
      collection_method: stripeInvoice.collection_method,
      has_payment_plan: !!(stripeInvoice as any).amounts_due && (stripeInvoice as any).amounts_due.length > 0,
      payment_plan_data: (stripeInvoice as any).amounts_due || null,
      status: stripeInvoice.status === 'open' ? 'sent' : (stripeInvoice.status as any),
      updated_at: new Date().toISOString(),
    })
    .eq('id', supabaseInvoiceId)
    .eq('user_id', userId);

  if (invoiceError) throw invoiceError;

  // If there's a payment plan, sync the amounts
  if ((stripeInvoice as any).amounts_due && (stripeInvoice as any).amounts_due.length > 0) {
    // Delete existing payment amounts
    await supabase
      .from('invoice_payment_amounts')
      .delete()
      .eq('invoice_id', supabaseInvoiceId);

    // Insert new payment amounts
    const paymentAmounts = (stripeInvoice as any).amounts_due.map((amount: any) => ({
      invoice_id: supabaseInvoiceId,
      amount: amount.amount,
      due_date: amount.due_date ? new Date(amount.due_date * 1000).toISOString() : null,
      days_until_due: amount.days_until_due,
      description: amount.description,
      status: 'pending',
    }));

    const { error: amountsError } = await supabase
      .from('invoice_payment_amounts')
      .insert(paymentAmounts);

    if (amountsError) throw amountsError;
  }

  return { success: true, stripe_invoice_url: stripeInvoice.hosted_invoice_url };
}

export async function getStripeInvoice(invoiceId: string): Promise<Stripe.Invoice> {
  return await stripe.invoices.retrieve(invoiceId);
}

export async function voidStripeInvoice(invoiceId: string): Promise<Stripe.Invoice> {
  return await stripe.invoices.voidInvoice(invoiceId);
}

export async function sendStripeInvoice(invoiceId: string): Promise<Stripe.Invoice> {
  return await stripe.invoices.sendInvoice(invoiceId);
}

/**
 * Update a Stripe invoice by voiding the old one and creating a new one.
 * This is necessary because finalized Stripe invoices are immutable.
 */
export async function updateStripeInvoice(
  oldInvoiceId: string,
  params: CreateInvoiceWithPlanParams
): Promise<Stripe.Invoice> {
  // Void the old invoice
  await stripe.invoices.voidInvoice(oldInvoiceId);
  console.log('✅ Voided old Stripe invoice:', oldInvoiceId);

  // Create new invoice with updated data
  const newInvoice = await createStripeInvoiceWithPaymentPlan(params);
  console.log('✅ Created new Stripe invoice:', newInvoice.id);

  return newInvoice;
}
