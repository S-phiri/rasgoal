DROP POLICY IF EXISTS "Users can insert their own referral" ON public.affiliate_referrals;
DROP POLICY IF EXISTS "Users insert own referral" ON public.affiliate_referrals;
DROP POLICY IF EXISTS "Insert own referral" ON public.affiliate_referrals;
DROP POLICY IF EXISTS "affiliate_referrals_insert_self" ON public.affiliate_referrals;

DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname='public' AND tablename='affiliate_referrals' AND cmd='INSERT'
  LOOP
    EXECUTE format('DROP POLICY %I ON public.affiliate_referrals', pol.policyname);
  END LOOP;
END $$;