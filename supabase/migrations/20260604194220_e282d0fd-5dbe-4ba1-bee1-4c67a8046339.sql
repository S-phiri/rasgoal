
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_ref TEXT NOT NULL UNIQUE,
  dpo_transaction_token TEXT,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'ZMW',
  payment_type TEXT NOT NULL DEFAULT 'yearly_subscription',
  status TEXT NOT NULL DEFAULT 'pending',
  dpo_result_code TEXT,
  dpo_result_explanation TEXT,
  raw_create_token_response TEXT,
  raw_verify_token_response TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments"
  ON public.payments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_dpo_token ON public.payments(dpo_transaction_token);

ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS plan_name TEXT,
  ADD COLUMN IF NOT EXISTS payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_payment_id ON public.subscriptions(payment_id) WHERE payment_id IS NOT NULL;
