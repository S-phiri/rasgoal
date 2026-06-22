
-- 1. Allow affiliates to be pre-created by email (no user_id yet)
ALTER TABLE public.affiliates ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.affiliates ALTER COLUMN user_id DROP NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS affiliates_email_lower_idx ON public.affiliates (lower(email)) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS affiliates_user_id_idx ON public.affiliates (user_id) WHERE user_id IS NOT NULL;

-- 2. Fixed K20 per subscribed referral (no percentage)
CREATE OR REPLACE FUNCTION public.handle_subscription_commission()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE _ref RECORD; _aff RECORD; _fixed numeric := 20;
BEGIN
  IF NEW.status <> 'active' THEN RETURN NEW; END IF;
  IF TG_OP = 'UPDATE' AND OLD.status = 'active' THEN RETURN NEW; END IF;

  SELECT * INTO _ref FROM public.affiliate_referrals WHERE referred_user_id = NEW.user_id LIMIT 1;
  IF _ref IS NULL THEN RETURN NEW; END IF;

  SELECT * INTO _aff FROM public.affiliates WHERE id = _ref.affiliate_id;
  IF _aff IS NULL THEN RETURN NEW; END IF;

  UPDATE public.affiliate_referrals SET status='subscribed', updated_at=now() WHERE id=_ref.id;

  INSERT INTO public.affiliate_commissions
    (affiliate_id, referral_id, subscription_id, subscription_amount, commission_rate, commission_amount)
  VALUES
    (_aff.id, _ref.id, NEW.id, COALESCE(NEW.amount,0), 0, _fixed);
  RETURN NEW;
END;
$function$;

-- 3. When a user signs up, link their auth account to a pre-created affiliate row by email
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, username)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'username');

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student'), (NEW.id, 'teacher');

  -- Link to pre-created affiliate row if email matches
  UPDATE public.affiliates
    SET user_id = NEW.id, status = 'active', updated_at = now()
    WHERE user_id IS NULL AND lower(email) = lower(NEW.email);

  RETURN NEW;
END;
$function$;

-- 4. RPC to check if an email is an invited affiliate (used by signup form)
CREATE OR REPLACE FUNCTION public.is_invited_affiliate(_email text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.affiliates WHERE lower(email) = lower(trim(_email)))
$$;
