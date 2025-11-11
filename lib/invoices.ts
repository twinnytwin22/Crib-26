import { getSupabaseServer } from "@/lib/supabase/server-client";
import {
  getCache,
  setCache,
  invalidateCache,
  isRedisConfigured,
} from "@/lib/redis";

export interface InvoiceSummary {
  id: string;
  client_id: string;
  user_id: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  status: string;
  total: number;
  clients: {
    name: string;
    email?: string;
    company?: string | null;
  } | null;
}

export interface InvoiceDetail extends InvoiceSummary {
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  notes: string | null;
  payment_terms: number | null;
  stripe_invoice_id?: string | null;
  collection_method?: string | null;
  has_payment_plan?: boolean | null;
  payment_plan_data?: any | null;
  created_at?: string;
  updated_at?: string;
  clients: {
    id?: string;
    name: string;
    email?: string;
    company?: string | null;
    address?: string | null;
    phone?: string | null;
  } | null;
  invoice_line_items: {
    id: string;
    description: string;
    quantity: number;
    unit_price: number;
    amount: number;
    sort_order: number;
  }[];
  payments: {
    id: string;
    amount: number;
    scheduled_date: string;
    status: string;
    notes: string | null;
    paid_date?: string | null;
    stripe_payment_intent_id?: string | null;
  }[];
}

const listCacheKey = (userId: string) => `invoices:list:${userId}`;
const detailCacheKey = (invoiceId: string) => `invoices:detail:${invoiceId}`;

export async function fetchInvoicesForUser(userId: string): Promise<InvoiceSummary[]> {
  if (!userId) {
    throw new Error("User id is required to fetch invoices");
  }

  if (isRedisConfigured) {
    try {
      const cached = await getCache<InvoiceSummary[]>(listCacheKey(userId));
      if (cached) {
        return cached;
      }
    } catch (error) {
      console.error("Failed to read invoices from cache", error);
    }
  }

  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("invoices")
    .select(
      `id, client_id, user_id, invoice_number, issue_date, due_date, status, total, clients (name, email, company)`
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  if (isRedisConfigured) {
    try {
      await setCache(listCacheKey(userId), data);
    } catch (error) {
      console.error("Failed to write invoices to cache", error);
    }
  }

  return data || [];
}

export async function fetchInvoiceDetail(invoiceId: string): Promise<InvoiceDetail | null> {
  if (!invoiceId) {
    throw new Error("Invoice id is required");
  }

  if (isRedisConfigured) {
    try {
      const cached = await getCache<InvoiceDetail>(detailCacheKey(invoiceId));
      if (cached) {
        return cached;
      }
    } catch (error) {
      console.error("Failed to read invoice detail from cache", error);
    }
  }

  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("invoices")
    .select(
      `
        id,
        client_id,
        user_id,
        invoice_number,
        issue_date,
        due_date,
        status,
        subtotal,
        tax_rate,
        tax_amount,
        total,
        notes,
        stripe_invoice_id,
        clients (name, email, company, address, phone),
        invoice_line_items (id, description, quantity, unit_price, amount, sort_order),
        payments (id, amount, scheduled_date, status, notes, paid_date, stripe_payment_intent_id)
      `
    )
    .eq("id", invoiceId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  if (isRedisConfigured) {
    try {
      await setCache(detailCacheKey(invoiceId), data);
    } catch (error) {
      console.error("Failed to cache invoice detail", error);
    }
  }

  return data as unknown as InvoiceDetail;
}

export async function deleteInvoice(invoiceId: string, userId: string) {
  const supabase = getSupabaseServer();
  const { error } = await supabase.from("invoices").delete().eq("id", invoiceId);
  if (error) {
    throw new Error(error.message);
  }

  await clearInvoiceCaches(invoiceId, userId);
}

export async function clearInvoiceCaches(invoiceId: string, userId?: string) {
  if (!isRedisConfigured) return;
  try {
    await invalidateCache(detailCacheKey(invoiceId));
    if (userId) {
      await invalidateCache(listCacheKey(userId));
    }
  } catch (error) {
    console.error("Failed to invalidate cache", error);
  }
}
