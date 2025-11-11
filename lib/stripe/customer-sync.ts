import Stripe from 'stripe';
import { getSupabaseServer } from '@/lib/supabase/server-client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia' as any,
  typescript: true,
});

/**
 * Get or create a Stripe customer for a client
 * @param clientId - Supabase client ID
 * @returns Stripe customer ID
 */
export async function getOrCreateStripeCustomer(clientId: string): Promise<string> {
  console.log('🔍 Getting or creating Stripe customer for client:', clientId);
  const supabase = getSupabaseServer();

  // Get client from database
  const { data: client, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', clientId)
    .single();

  if (error || !client) {
    console.error('❌ Client not found in database:', error);
    throw new Error('Client not found');
  }

  console.log('👤 Client found:', { name: client.name, email: client.email, stripe_customer_id: client.stripe_customer_id });

  // If client already has a Stripe customer ID, return it
  if (client.stripe_customer_id) {
    // Verify the customer still exists in Stripe
    try {
      const customer = await stripe.customers.retrieve(client.stripe_customer_id);
      if (!('deleted' in customer) || !customer.deleted) {
        console.log('✅ Using existing Stripe customer:', client.stripe_customer_id);
        return client.stripe_customer_id;
      }
    } catch (err) {
      // Customer doesn't exist in Stripe, create a new one
      console.log('⚠️ Stripe customer not found, creating new one');
    }
  }

  // Create new Stripe customer
  console.log('🆕 Creating new Stripe customer...');
  const stripeCustomer = await stripe.customers.create({
    email: client.email,
    name: client.name,
    phone: client.phone || undefined,
    address: client.address ? {
      line1: client.address,
    } : undefined,
    metadata: {
      supabase_client_id: client.id,
      company: client.company || '',
    },
  });

  // Update client with Stripe customer ID
  await supabase
    .from('clients')
    .update({ stripe_customer_id: stripeCustomer.id })
    .eq('id', clientId);

  console.log('✅ Created and saved Stripe customer:', stripeCustomer.id);
  return stripeCustomer.id;
}

/**
 * Update Stripe customer information
 * @param clientId - Supabase client ID
 */
export async function updateStripeCustomer(clientId: string): Promise<void> {
  const supabase = getSupabaseServer();

  // Get client from database
  const { data: client, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', clientId)
    .single();

  if (error || !client || !client.stripe_customer_id) {
    return; // Nothing to update
  }

  // Update customer in Stripe
  await stripe.customers.update(client.stripe_customer_id, {
    email: client.email,
    name: client.name,
    phone: client.phone || undefined,
    address: client.address ? {
      line1: client.address,
    } : undefined,
    metadata: {
      supabase_client_id: client.id,
      company: client.company || '',
    },
  });
}
