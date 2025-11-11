import { getSupabaseServer } from "@/lib/supabase/server-client";
import { getCache, setCache, isRedisConfigured } from "@/lib/redis";

export interface ClientRecord {
  id: string;
  name: string;
  email: string;
  company: string | null;
  address: string | null;
  phone: string | null;
}

const clientCacheKey = (userId: string) => `clients:list:${userId}`;

export async function fetchClientsForUser(userId: string): Promise<ClientRecord[]> {
  if (isRedisConfigured) {
    try {
      const cached = await getCache<ClientRecord[]>(clientCacheKey(userId));
      if (cached) {
        return cached;
      }
    } catch (error) {
      console.error("Failed to read clients from cache", error);
    }
  }

  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("clients")
    .select("id, name, email, company, address, phone")
    .eq("user_id", userId)
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  if (isRedisConfigured) {
    try {
      await setCache(clientCacheKey(userId), data);
    } catch (error) {
      console.error("Failed to cache clients", error);
    }
  }

  return data || [];
}
