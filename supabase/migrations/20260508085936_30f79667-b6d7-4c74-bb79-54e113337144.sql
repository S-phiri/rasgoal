
-- AFFILIATES
CREATE TABLE public.affiliates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  code text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending',
  commission_rate numeric NOT NULL DEFAULT 20,
  full_name text,
  phone text,
  country text,
  payment_method text,
  payout_details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.affiliate_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  referred_user_id uuid NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending',
  referred_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_affiliate_referrals_affiliate ON public.affiliate_referrals(affiliate_id);
ALTER TABLE public.affiliate_referrals ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.affiliate_commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  referral_id uuid REFERENCES public.affiliate_referrals(id) ON DELETE SET NULL,
  subscription_id uuid,
  subscription_amount numeric NOT NULL DEFAULT 0,
  commission_rate numeric NOT NULL DEFAULT 0,
  commission_amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  earned_at timestamptz NOT NULL DEFAULT now(),
  approved_at timestamptz,
  paid_at timestamptz,
  payout_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_affiliate_commissions_affiliate ON public.affiliate_commissions(affiliate_id);
ALTER TABLE public.affiliate_commissions ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.affiliate_payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  amount numeric NOT NULL DEFAULT 0,
  method text,
  reference text,
  notes text,
  paid_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_affiliate_payouts_affiliate ON public.affiliate_payouts(affiliate_id);
ALTER TABLE public.affiliate_payouts ENABLE ROW LEVEL SECURITY;

-- Helper functions
CREATE OR REPLACE FUNCTION public.is_affiliate_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id=_user_id AND role='affiliate_admin'::app_role);
$$;

CREATE OR REPLACE FUNCTION public.current_affiliate_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT id FROM public.affiliates WHERE user_id = auth.uid() LIMIT 1;
$$;

-- RLS: affiliates
CREATE POLICY "Affiliate views own row" ON public.affiliates FOR SELECT
  USING (auth.uid() = user_id OR public.is_affiliate_admin(auth.uid()));
CREATE POLICY "Affiliate updates own row" ON public.affiliates FOR UPDATE
  USING (auth.uid() = user_id OR public.is_affiliate_admin(auth.uid()))
  WITH CHECK (auth.uid() = user_id OR public.is_affiliate_admin(auth.uid()));
CREATE POLICY "Admin inserts affiliates" ON public.affiliates FOR INSERT
  WITH CHECK (public.is_affiliate_admin(auth.uid()) OR auth.uid() = user_id);
CREATE POLICY "Admin deletes affiliates" ON public.affiliates FOR DELETE
  USING (public.is_affiliate_admin(auth.uid()));

-- RLS: referrals
CREATE POLICY "Affiliate sees own referrals" ON public.affiliate_referrals FOR SELECT
  USING (affiliate_id = public.current_affiliate_id() OR public.is_affiliate_admin(auth.uid()));
CREATE POLICY "Insert referral by self or admin" ON public.affiliate_referrals FOR INSERT
  WITH CHECK (referred_user_id = auth.uid() OR public.is_affiliate_admin(auth.uid()));
CREATE POLICY "Admin updates referrals" ON public.affiliate_referrals FOR UPDATE
  USING (public.is_affiliate_admin(auth.uid())) WITH CHECK (public.is_affiliate_admin(auth.uid()));

-- RLS: commissions
CREATE POLICY "Affiliate sees own commissions" ON public.affiliate_commissions FOR SELECT
  USING (affiliate_id = public.current_affiliate_id() OR public.is_affiliate_admin(auth.uid()));
CREATE POLICY "Admin manages commissions" ON public.affiliate_commissions FOR ALL
  USING (public.is_affiliate_admin(auth.uid())) WITH CHECK (public.is_affiliate_admin(auth.uid()));

-- RLS: payouts
CREATE POLICY "Affiliate sees own payouts" ON public.affiliate_payouts FOR SELECT
  USING (affiliate_id = public.current_affiliate_id() OR public.is_affiliate_admin(auth.uid()));
CREATE POLICY "Admin manages payouts" ON public.affiliate_payouts FOR ALL
  USING (public.is_affiliate_admin(auth.uid())) WITH CHECK (public.is_affiliate_admin(auth.uid()));

CREATE TRIGGER trg_affiliates_updated BEFORE UPDATE ON public.affiliates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_affiliate_referrals_updated BEFORE UPDATE ON public.affiliate_referrals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Link a signed-in user to an affiliate by code (called right after signup)
CREATE OR REPLACE FUNCTION public.link_referral_by_code(_code text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE _aff_id uuid;
BEGIN
  IF auth.uid() IS NULL THEN RETURN; END IF;
  SELECT id INTO _aff_id FROM public.affiliates WHERE code = upper(trim(_code)) AND status = 'active' LIMIT 1;
  IF _aff_id IS NULL THEN RETURN; END IF;
  INSERT INTO public.affiliate_referrals (affiliate_id, referred_user_id)
  VALUES (_aff_id, auth.uid())
  ON CONFLICT (referred_user_id) DO NOTHING;
END;
$$;

-- Auto-create commission when a subscription becomes active
CREATE OR REPLACE FUNCTION public.handle_subscription_commission()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE _ref RECORD; _aff RECORD;
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
    (_aff.id, _ref.id, NEW.id, COALESCE(NEW.amount,0), _aff.commission_rate,
     ROUND(COALESCE(NEW.amount,0) * _aff.commission_rate / 100.0, 2));
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_subscription_commission
AFTER INSERT OR UPDATE OF status ON public.subscriptions
FOR EACH ROW EXECUTE FUNCTION public.handle_subscription_commission();
