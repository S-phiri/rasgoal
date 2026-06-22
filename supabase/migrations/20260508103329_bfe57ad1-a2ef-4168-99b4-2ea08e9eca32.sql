CREATE OR REPLACE FUNCTION public.link_referral_by_code(_code text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _aff_id uuid;
  _user_created timestamptz;
  _existing_ref uuid;
BEGIN
  IF auth.uid() IS NULL THEN RETURN; END IF;

  -- Skip if this user already has a referral linked (prevents duplication)
  SELECT id INTO _existing_ref FROM public.affiliate_referrals
    WHERE referred_user_id = auth.uid() LIMIT 1;
  IF _existing_ref IS NOT NULL THEN RETURN; END IF;

  -- Only credit referrals for brand-new accounts (created within last 10 minutes).
  -- This prevents already-signed-up users from being counted when they click a referral link.
  SELECT created_at INTO _user_created FROM auth.users WHERE id = auth.uid();
  IF _user_created IS NULL OR _user_created < (now() - interval '10 minutes') THEN
    RETURN;
  END IF;

  SELECT id INTO _aff_id FROM public.affiliates
    WHERE code = upper(trim(_code)) AND status = 'active' LIMIT 1;
  IF _aff_id IS NULL THEN RETURN; END IF;

  INSERT INTO public.affiliate_referrals (affiliate_id, referred_user_id)
  VALUES (_aff_id, auth.uid())
  ON CONFLICT (referred_user_id) DO NOTHING;
END;
$function$;