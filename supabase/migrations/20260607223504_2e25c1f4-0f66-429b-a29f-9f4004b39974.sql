SELECT cron.unschedule('reconcile-dpo-payments')
WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'reconcile-dpo-payments'
);

SELECT cron.schedule(
  'reconcile-dpo-payments',
  '*/5 * * * *',
  $$
    WITH service_key AS (
      SELECT decrypted_secret AS token
      FROM vault.decrypted_secrets
      WHERE name = 'SUPABASE_SERVICE_ROLE_KEY'
      LIMIT 1
    )
    SELECT net.http_post(
      url := 'https://yjgbocwxumxurvzaidmd.supabase.co/functions/v1/reconcile-dpo-payments',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || service_key.token
      ),
      body := '{}'::jsonb
    )
    FROM service_key
    WHERE service_key.token IS NOT NULL
      AND service_key.token <> '';
  $$
);

WITH service_key AS (
  SELECT decrypted_secret AS token
  FROM vault.decrypted_secrets
  WHERE name = 'SUPABASE_SERVICE_ROLE_KEY'
  LIMIT 1
)
SELECT net.http_post(
  url := 'https://yjgbocwxumxurvzaidmd.supabase.co/functions/v1/reconcile-dpo-payments',
  headers := jsonb_build_object(
    'Content-Type', 'application/json',
    'Authorization', 'Bearer ' || service_key.token
  ),
  body := '{}'::jsonb
)
FROM service_key
WHERE service_key.token IS NOT NULL
  AND service_key.token <> '';