import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAffiliateAuth } from "../AffiliateAuthContext";

export interface Affiliate {
  id: string;
  user_id: string;
  code: string;
  status: string;
  commission_rate: number;
  full_name: string | null;
  phone: string | null;
  country: string | null;
  payment_method: string | null;
  payout_details: any;
}

export const useAffiliate = () => {
  const { user } = useAffiliateAuth();
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) { setAffiliate(null); setLoading(false); return; }
    const { data } = await (supabase as any).from("affiliates").select("*").eq("user_id", user.id).maybeSingle();
    setAffiliate(data);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  return { affiliate, loading, refetch: fetch };
};
