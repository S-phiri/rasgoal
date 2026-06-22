CREATE OR REPLACE FUNCTION public.link_referral_by_code(_code text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _aff_id uuid;
  _existing_ref uuid;
BEGIN
  IF auth.uid() IS NULL THEN RETURN; END IF;

  -- Skip if this user already has a referral linked (prevents duplication)
  SELECT id INTO _existing_ref FROM public.affiliate_referrals
    WHERE referred_user_id = auth.uid() LIMIT 1;
  IF _existing_ref IS NOT NULL THEN RETURN; END IF;

  SELECT id INTO _aff_id FROM public.affiliates
    WHERE code = upper(trim(_code)) AND status = 'active' LIMIT 1;
  IF _aff_id IS NULL THEN RETURN; END IF;

  INSERT INTO public.affiliate_referrals (affiliate_id, referred_user_id)
  VALUES (_aff_id, auth.uid())
  ON CONFLICT (referred_user_id) DO NOTHING;
END;
$function$;