-- Add payment reference to commissions for dedup + renewal support
ALTER TABLE public.affiliate_commissions
  ADD COLUMN IF NOT EXISTS payment_id uuid REFERENCES public.payments(id) ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS affiliate_commissions_payment_unique
  ON public.affiliate_commissions(payment_id)
  WHERE payment_id IS NOT NULL;

-- Replace the trigger function: fire on every paid activation/renewal, dedup by payment_id
CREATE OR REPLACE FUNCTION public.handle_subscription_commission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _ref RECORD;
  _aff RECORD;
  _fixed numeric := 20;
BEGIN
  -- Only credit commissions on active subscriptions with a linked payment
  IF NEW.status <> 'active' OR NEW.payment_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Find the referral for this subscriber
  SELECT * INTO _ref FROM public.affiliate_referrals
    WHERE referred_user_id = NEW.user_id LIMIT 1;
  IF _ref IS NULL THEN RETURN NEW; END IF;

  SELECT * INTO _aff FROM public.affiliates WHERE id = _ref.affiliate_id;
  IF _aff IS NULL THEN RETURN NEW; END IF;

  -- Mark the referral as subscribed (first time only)
  IF _ref.status IS DISTINCT FROM 'subscribed' THEN
    UPDATE public.affiliate_referrals
      SET status = 'subscribed', updated_at = now()
      WHERE id = _ref.id;
  END IF;

  -- Insert the commission; ON CONFLICT prevents duplicates if the trigger
  -- fires more than once for the same payment (e.g., insert then update).
  INSERT INTO public.affiliate_commissions
    (affiliate_id, referral_id, subscription_id, payment_id,
     subscription_amount, commission_rate, commission_amount)
  VALUES
    (_aff.id, _ref.id, NEW.id, NEW.payment_id,
     COALESCE(NEW.amount, 0), 0, _fixed)
  ON CONFLICT (payment_id) WHERE payment_id IS NOT NULL DO NOTHING;

  RETURN NEW;
END;
$function$;

-- Ensure trigger fires on INSERT and on any UPDATE that touches status or payment_id
DROP TRIGGER IF EXISTS trg_subscription_commission ON public.subscriptions;
CREATE TRIGGER trg_subscription_commission
AFTER INSERT OR UPDATE OF status, payment_id ON public.subscriptions
FOR EACH ROW EXECUTE FUNCTION public.handle_subscription_commission();