import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ActiveSubscription {
  id: string;
  plan_name: string | null;
  status: string;
  started_at: string | null;
  expires_at: string | null;
}

export const useActiveSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<ActiveSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const nowIso = new Date().toISOString();
    const { data } = await supabase
      .from("subscriptions")
      .select("id, plan_name, status, started_at, expires_at")
      .eq("user_id", user.id)
      .eq("status", "active")
      .gt("expires_at", nowIso)
      .order("expires_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    setSubscription((data as ActiveSubscription) ?? null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { subscription, loading, refresh, isActive: !!subscription };
};
