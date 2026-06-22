-- 1. Remove affiliate tables from Realtime publication to prevent broadcasting
-- sensitive commission/referral data to all subscribers. The dashboards already
-- refresh via window focus + 30s polling, so functionality is preserved.
ALTER PUBLICATION supabase_realtime DROP TABLE public.affiliate_commissions;
ALTER PUBLICATION supabase_realtime DROP TABLE public.affiliate_referrals;

-- 2. Explicitly block client INSERT/UPDATE/DELETE on affiliate_referrals.
-- All referral linking must go through the link_referral_by_code SECURITY DEFINER
-- function. Admins can still update via the existing "Admin updates referrals" policy.
CREATE POLICY "No client inserts on referrals"
  ON public.affiliate_referrals FOR INSERT
  TO authenticated, anon
  WITH CHECK (false);

CREATE POLICY "No client deletes on referrals"
  ON public.affiliate_referrals FOR DELETE
  TO authenticated, anon
  USING (false);

-- 3. Harden is_assigned_to_test: require caller to be the student being checked,
-- or be the test owner. Prevents info disclosure about other users' assignments.
CREATE OR REPLACE FUNCTION public.is_assigned_to_test(_test_id uuid, _student_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.test_assignments ta
    WHERE ta.test_id = _test_id
      AND ta.student_id = _student_id
      AND (
        auth.uid() = _student_id
        OR public.is_test_owner(_test_id, auth.uid())
      )
  )
$function$;
