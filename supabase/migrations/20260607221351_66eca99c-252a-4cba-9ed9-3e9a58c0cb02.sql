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
    ), service_key AS (
      SELECT decrypted_secret AS token
      FROM vault.decrypted_secrets
      WHERE name = 'email_queue_service_role_key'
      LIMIT 1
    )
    SELECT net.http_post(
      url := 'https://yjgbocwxumxurvzaidmd.supabase.co/functions/v1/verify-yearly-dpo-payment',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || service_key.token,
        'x-dpo-server-callback', '1'
      ),
      body := jsonb_build_object(
        'payment_id', pending_payments.id,
        'TransactionToken', pending_payments.dpo_transaction_token
      )
    )
    FROM pending_payments
    CROSS JOIN service_key
    WHERE service_key.token IS NOT NULL
      AND service_key.token <> '';
  $$
);