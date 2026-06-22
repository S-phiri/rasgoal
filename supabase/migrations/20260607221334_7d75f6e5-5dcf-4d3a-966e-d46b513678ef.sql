CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'reconcile-dpo-payments') THEN
    PERFORM cron.unschedule('reconcile-dpo-payments');
  END IF;
END $$;

SELECT cron.schedule(
  'reconcile-dpo-payments',
  '*/5 * * * *',
  $$
    WITH pending_payments AS (
      SELECT id, dpo_transaction_token
      FROM public.payments
      WHERE payment_type = 'yearly_subscription'
        AND status = 'pending'
        AND dpo_transaction_token IS NOT NULL
        AND created_at >= now() - interval '2 days'
        AND created_at <= now() - interval '2 minutes'
      ORDER BY created_at ASC
      LIMIT 10
    )
    SELECT net.http_post(
      url := 'https://yjgbocwxumxurvzaidmd.supabase.co/functions/v1/verify-yearly-dpo-payment',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true),
        'x-dpo-server-callback', '1'
      ),
      body := jsonb_build_object(
        'payment_id', id,
        'TransactionToken', dpo_transaction_token
      )
    )
    FROM pending_payments
    WHERE current_setting('app.settings.service_role_key', true) IS NOT NULL
      AND current_setting('app.settings.service_role_key', true) <> '';
  $$
);