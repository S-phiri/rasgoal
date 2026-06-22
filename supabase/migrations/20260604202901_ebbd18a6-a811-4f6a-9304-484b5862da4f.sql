ALTER TABLE public.subscriptions
  DROP CONSTRAINT IF EXISTS subscriptions_payment_method_check;

ALTER TABLE public.subscriptions
  ADD CONSTRAINT subscriptions_payment_method_check
  CHECK (payment_method IN ('airtel', 'mtn', 'dpo'));