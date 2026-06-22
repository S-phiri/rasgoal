-- Restrict policies to authenticated role only and prevent commission_rate self-modification

-- user_rewards: restrict insert to authenticated
DROP POLICY IF EXISTS "Users can insert own rewards" ON public.user_rewards;
CREATE POLICY "Users can insert own rewards"
ON public.user_rewards
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own rewards" ON public.user_rewards;
CREATE POLICY "Users can view own rewards"
ON public.user_rewards
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- subscriptions: restrict to authenticated
DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can insert their own subscriptions"
ON public.subscriptions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can update their own subscriptions"
ON public.subscriptions
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view their own subscriptions"
ON public.subscriptions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- affiliates: restrict to authenticated, and prevent self-modification of commission_rate
DROP POLICY IF EXISTS "Admin deletes affiliates" ON public.affiliates;
CREATE POLICY "Admin deletes affiliates"
ON public.affiliates
FOR DELETE
TO authenticated
USING (is_affiliate_admin(auth.uid()));

DROP POLICY IF EXISTS "Admin inserts affiliates" ON public.affiliates;
CREATE POLICY "Admin inserts affiliates"
ON public.affiliates
FOR INSERT
TO authenticated
WITH CHECK (is_affiliate_admin(auth.uid()) OR (auth.uid() = user_id));

DROP POLICY IF EXISTS "Affiliate updates own row" ON public.affiliates;
CREATE POLICY "Affiliate updates own row"
ON public.affiliates
FOR UPDATE
TO authenticated
USING ((auth.uid() = user_id) OR is_affiliate_admin(auth.uid()))
WITH CHECK ((auth.uid() = user_id) OR is_affiliate_admin(auth.uid()));

DROP POLICY IF EXISTS "Affiliate views own row" ON public.affiliates;
CREATE POLICY "Affiliate views own row"
ON public.affiliates
FOR SELECT
TO authenticated
USING ((auth.uid() = user_id) OR is_affiliate_admin(auth.uid()));

-- Prevent non-admins from modifying commission_rate on their own affiliate row
CREATE OR REPLACE FUNCTION public.prevent_commission_rate_self_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.commission_rate IS DISTINCT FROM OLD.commission_rate
     AND NOT public.is_affiliate_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can modify commission_rate';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_commission_rate_self_update ON public.affiliates;
CREATE TRIGGER prevent_commission_rate_self_update
BEFORE UPDATE ON public.affiliates
FOR EACH ROW EXECUTE FUNCTION public.prevent_commission_rate_self_update();